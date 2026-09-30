"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Button, Callout, IconExternalLink, StatusPill } from "@/components/ui";
import { cx } from "@/components/ui/cx";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import {
  formatAnswerHash,
  longestQuestionCount,
  parseAnswerHash,
  replayPath,
  type PathStep,
} from "@/rules/path";
import {
  pickLocalized,
  type DecisionTree as DecisionTreeData,
  type Verdict,
} from "@/rules/schema";

import styles from "./DecisionTree.module.css";

type ToolsMessages = Messages["tools"];

type RelatedTitle = {
  slug: string;
  title: string;
};

type DecisionTreeProps = {
  tree: DecisionTreeData;
  locale: Locale;
  toolsMessages: ToolsMessages;
  relatedTitles: RelatedTitle[];
  surveyEstimatedMinutes: number;
};

function verdictLabel(verdict: Verdict, messages: ToolsMessages): string {
  switch (verdict) {
    case "likely":
      return messages.verdictLikely;
    case "unlikely":
      return messages.verdictUnlikely;
    case "unclear":
      return messages.verdictUnclear;
    case "depends":
      return messages.verdictDepends;
  }
}

function verdictTone(verdict: Verdict): "info" | "neutral" | "warning" {
  switch (verdict) {
    case "likely":
      return "info";
    case "unlikely":
      return "neutral";
    case "depends":
    case "unclear":
      return "warning";
  }
}

function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function subscribeNoop() {
  return () => {};
}

function getClipboardWriteSupported(): boolean {
  return typeof navigator.clipboard?.writeText === "function";
}

export function DecisionTree({
  tree,
  locale,
  toolsMessages,
  relatedTitles,
  surveyEstimatedMinutes,
}: DecisionTreeProps) {
  const [currentId, setCurrentId] = useState(tree.start);
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const [steps, setSteps] = useState<PathStep[]>([]);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skipFocusRef = useRef(true);
  const liveId = useId();

  const canCopy = useSyncExternalStore(
    subscribeNoop,
    getClipboardWriteSupported,
    () => false,
  );

  const applyHash = useCallback(
    (hash: string) => {
      const parsed = parseAnswerHash(hash);
      if (!parsed.ok) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, "", `${pathname}${search}`);
        setCurrentId(tree.start);
        setAnswerIds([]);
        setSteps([]);
        return;
      }

      const replayed = replayPath(tree, parsed.ids);
      if (!replayed.ok) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, "", `${pathname}${search}`);
        setCurrentId(tree.start);
        setAnswerIds([]);
        setSteps([]);
        return;
      }

      setCurrentId(replayed.currentId);
      setAnswerIds(replayed.answerIds);
      setSteps(replayed.steps);
    },
    [tree],
  );

  useEffect(() => {
    const syncFromUrl = () => {
      applyHash(window.location.hash);
    };
    // Hydrate from the fragment on mount.
    // hashchange: location.hash writes; popstate: history.pushState back/forward.
    syncFromUrl();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration flag for e2e
    setHydrated(true);
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [applyHash]);

  useEffect(() => {
    if (skipFocusRef.current) {
      skipFocusRef.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [currentId]);

  const node = tree.nodes[currentId];
  if (!node) {
    return null;
  }

  const progressLabel =
    node.type === "question"
      ? toolsMessages.progress
          .replace("{n}", String(answerIds.length + 1))
          .replace(
            "{m}",
            String(answerIds.length + longestQuestionCount(tree, currentId)),
          )
      : "";

  const liveAnnouncement =
    node.type === "question"
      ? `${progressLabel}. ${pickLocalized(node.prompt, locale)}`
      : verdictLabel(node.verdict, toolsMessages);

  function writeHash(nextIds: string[], mode: "push" | "replace") {
    const nextHash = formatAnswerHash(nextIds);
    const { pathname, search } = window.location;
    const url = `${pathname}${search}${nextHash}`;
    if (mode === "replace") {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }
    // history API does not fire hashchange — apply explicitly.
    applyHash(nextHash);
  }

  function chooseAnswer(answerId: string) {
    writeHash([...answerIds, answerId], "push");
  }

  function goBack() {
    if (answerIds.length === 0) {
      return;
    }
    writeHash(answerIds.slice(0, -1), "push");
  }

  function restart() {
    writeHash([], "replace");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function printOutcome() {
    window.print();
  }

  const relatedBySlug = new Map(
    relatedTitles.map((item) => [item.slug, item.title]),
  );

  const progressN = answerIds.length + 1;
  const progressM =
    answerIds.length + longestQuestionCount(tree, currentId);

  return (
    <div className={styles.root} data-hydrated={hydrated ? "true" : "false"}>
      <p id={liveId} className={styles.live} aria-live="polite">
        {liveAnnouncement}
      </p>

      <div className={cx(styles.controls, "decision-tree-controls")}>
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={answerIds.length === 0}
        >
          {toolsMessages.back}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={restart}
          disabled={currentId === tree.start && answerIds.length === 0}
        >
          {toolsMessages.restart}
        </Button>
      </div>

      {node.type === "question" ? (
        <div className={styles.question}>
          <div className={cx(styles.progress, "decision-tree-progress")}>
            <p className={styles.progressLabel}>{progressLabel}</p>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={progressM}
              aria-valuenow={progressN}
              aria-label={progressLabel}
            >
              <div
                className={styles.progressFill}
                style={{
                  width: `${Math.min(100, (progressN / Math.max(progressM, 1)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className={styles.prompt}
          >
            {pickLocalized(node.prompt, locale)}
          </h2>
          {node.help ? (
            <p className={styles.help}>{pickLocalized(node.help, locale)}</p>
          ) : null}
          <ul className={styles.answers}>
            {node.answers.map((answer) => (
              <li key={answer.id}>
                <button
                  type="button"
                  className={styles.answerButton}
                  onClick={() => chooseAnswer(answer.id)}
                >
                  {pickLocalized(answer.label, locale)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.outcome}>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className={styles.outcomeHeading}
          >
            <StatusPill tone={verdictTone(node.verdict)}>
              {verdictLabel(node.verdict, toolsMessages)}
            </StatusPill>
          </h2>

          <Callout
            tone={
              verdictTone(node.verdict) === "warning" ? "warning" : "neutral"
            }
            className={styles.summaryCallout}
          >
            {pickLocalized(node.summary, locale)}
          </Callout>

          {steps.length > 0 ? (
            <section
              className={styles.section}
              aria-labelledby="recap-heading"
            >
              <h3 id="recap-heading" className={styles.sectionTitle}>
                {toolsMessages.answerRecap}
              </h3>
              <dl className={styles.recap}>
                {steps.map((step) => (
                  <div key={`${step.questionId}-${step.answerId}`}>
                    <dt>{pickLocalized(step.prompt, locale)}</dt>
                    <dd>{pickLocalized(step.answerLabel, locale)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className={cx(styles.outcomeActions, "decision-tree-controls")}>
            {canCopy ? (
              <Button type="button" variant="secondary" onClick={copyLink}>
                {copied ? toolsMessages.copyLinkDone : toolsMessages.copyLink}
              </Button>
            ) : null}
            <Button type="button" variant="secondary" onClick={printOutcome}>
              {toolsMessages.print}
            </Button>
          </div>

          <section
            className={styles.section}
            aria-labelledby="caveats-heading"
          >
            <h3 id="caveats-heading" className={styles.sectionTitle}>
              {toolsMessages.caveats}
            </h3>
            <ul className={styles.list}>
              {node.caveats.map((caveat, index) => (
                <li key={index}>{pickLocalized(caveat, locale)}</li>
              ))}
            </ul>
          </section>

          <section
            className={styles.section}
            aria-labelledby="sources-heading"
          >
            <h3 id="sources-heading" className={styles.sectionTitle}>
              {toolsMessages.sources}
            </h3>
            <ul className={styles.sourceList}>
              {node.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                  >
                    <span className={styles.sourceTitle}>{source.title}</span>
                    <span className={styles.sourceMeta}>
                      {sourceHost(source.url)}
                      <IconExternalLink size={16} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {node.related_pages.length > 0 ? (
            <section
              className={styles.section}
              aria-labelledby="related-heading"
            >
              <h3 id="related-heading" className={styles.sectionTitle}>
                {toolsMessages.relatedPages}
              </h3>
              <ul className={styles.list}>
                {node.related_pages.map((slug) => {
                  const title = relatedBySlug.get(slug);
                  if (!title) {
                    return null;
                  }
                  return (
                    <li key={slug}>
                      <Link href={`/${locale}/${slug}/`}>{title}</Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <Callout tone="info" className={styles.surveyPrompt}>
            <p>
              {toolsMessages.surveyPrompt.replace(
                "{minutes}",
                String(surveyEstimatedMinutes),
              )}
            </p>
            <Button href={`/${locale}/survey/`} variant="secondary">
              {toolsMessages.surveyCta}
            </Button>
          </Callout>
        </div>
      )}

      <p className={styles.disclaimer}>{toolsMessages.disclaimer}</p>
    </div>
  );
}
