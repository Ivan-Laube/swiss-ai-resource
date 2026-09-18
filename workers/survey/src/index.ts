import surveyJson from "../../../data/survey-questions.json";
import {
  isHoneypotTriggered,
  validateIntake,
} from "../../../src/survey/answers";
import { parseSurvey } from "../../../src/survey/schema";

import { runAggregateJob } from "./aggregate-job";
import {
  BodyTooLargeError,
  MAX_SUBMIT_BODY_BYTES,
  readJsonWithLimit,
} from "./body-limit";
import {
  emptyResponse,
  isAllowedOrigin,
  jsonResponse,
  optionsResponse,
  rejectIfDisallowedOrigin,
} from "./cors";
import type { Env } from "./env";
import { purgeExpiredSurveyData, storeResponse } from "./store";
import { verifyTurnstile } from "./turnstile";

const survey = parseSurvey(surveyJson);

function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

function siteOrigin(env: Env): string {
  const origin = env.SITE_ORIGIN?.trim();
  if (!origin) {
    throw new Error("SITE_ORIGIN is not configured");
  }
  return origin;
}

function misconfiguredSiteOrigin(): Response {
  return new Response(
    JSON.stringify({ error: "SITE_ORIGIN is not configured" }),
    {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    },
  );
}

async function handleSubmit(
  request: Request,
  env: Env,
  origin: string,
): Promise<Response> {
  const ip = clientIp(request);

  const { success: withinLimit } = await env.SURVEY_RATE_LIMITER.limit({
    key: ip,
  });
  if (!withinLimit) {
    return jsonResponse({ error: "Too many requests" }, 429, origin);
  }

  let body: unknown;
  try {
    body = await readJsonWithLimit(request, MAX_SUBMIT_BODY_BYTES);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return jsonResponse({ error: "Request body too large" }, 413, origin);
    }
    return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
  }

  // Silent bot reject before schema/Turnstile so scrapers get a fake success.
  if (
    body !== null &&
    typeof body === "object" &&
    isHoneypotTriggered((body as { website?: string }).website)
  ) {
    return emptyResponse(204, origin);
  }

  const validated = validateIntake(survey, body);
  if (!validated.ok) {
    return jsonResponse({ error: validated.error }, validated.status, origin);
  }

  const { intake, answers, email } = validated;

  const turnstile = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    intake.turnstile_token,
    ip === "unknown" ? undefined : ip,
  );
  if (!turnstile.ok) {
    if (turnstile.reason === "missing_secret") {
      return jsonResponse({ error: "Server misconfigured" }, 500, origin);
    }
    return jsonResponse({ error: "Turnstile verification failed" }, 403, origin);
  }

  const id = crypto.randomUUID();
  try {
    await storeResponse(env, {
      id,
      surveyId: intake.survey_id,
      surveyVersion: intake.survey_version,
      locale: intake.locale,
      answers,
      reportOptIn: intake.report_opt_in,
      email,
    });
  } catch (err) {
    console.error("D1 insert failed", err);
    return jsonResponse({ error: "Failed to store response" }, 500, origin);
  }

  return jsonResponse({ ok: true, id }, 201, origin);
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    let origin: string;
    try {
      origin = siteOrigin(env);
    } catch {
      return misconfiguredSiteOrigin();
    }

    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname === "/submit") {
      const rejected = rejectIfDisallowedOrigin(request, origin);
      if (rejected) return rejected;
      return optionsResponse(request.headers.get("Origin")!);
    }

    if (request.method === "POST" && url.pathname === "/submit") {
      const rejected = rejectIfDisallowedOrigin(request, origin);
      if (rejected) return rejected;
      return handleSubmit(request, env, request.headers.get("Origin")!);
    }

    const requestOrigin = request.headers.get("Origin");
    const corsOrigin =
      requestOrigin && isAllowedOrigin(requestOrigin, origin)
        ? requestOrigin
        : origin;
    return jsonResponse({ error: "Not found" }, 404, corsOrigin);
  },
  scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): void {
    ctx.waitUntil(
      (async () => {
        const retention = await purgeExpiredSurveyData(env);
        console.log(
          JSON.stringify({
            event: "survey_retention_purge",
            ...retention,
          }),
        );

        const result = await runAggregateJob(env, controller.scheduledTime);
        console.log(
          JSON.stringify({
            event: "survey_aggregation_complete",
            ...result,
          }),
        );
      })().catch((error: unknown) => {
        console.error(
          JSON.stringify({
            event: "survey_scheduled_failed",
            error: error instanceof Error ? error.message : String(error),
          }),
        );
        throw error;
      }),
    );
  },
} satisfies ExportedHandler<Env>;

export default worker;
