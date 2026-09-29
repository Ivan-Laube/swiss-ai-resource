/**
 * In-page Turnstile stub injected via page.route on challenges.cloudflare.com.
 * Behavior is controlled by window.__turnstileMode set before navigation
 * (via addInitScript): "pass" | "manual" | "error".
 */

export const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const E2E_TURNSTILE_TOKEN = "e2e-token";

/** Script body served in place of the real Turnstile api.js. */
export const TURNSTILE_STUB_SOURCE = `
(function () {
  var calls = [];
  var nextId = 1;
  var widgets = {};

  function record(method, args) {
    calls.push({ method: method, args: args || [] });
  }

  function firePass(opts, id) {
    var token = ${JSON.stringify(E2E_TURNSTILE_TOKEN)};
    if (typeof opts.callback === "function") {
      setTimeout(function () { opts.callback(token); }, 0);
    }
    widgets[id] = opts;
  }

  function fireError(opts) {
    if (typeof opts["error-callback"] === "function") {
      setTimeout(function () { opts["error-callback"](); }, 0);
    }
  }

  window.__turnstileCalls = calls;
  window.__turnstileExpire = function (id) {
    var opts = widgets[id];
    if (opts && typeof opts["expired-callback"] === "function") {
      opts["expired-callback"]();
    }
  };
  window.__turnstileIssueToken = function (id) {
    var opts = widgets[id];
    if (opts && typeof opts.callback === "function") {
      opts.callback(${JSON.stringify(E2E_TURNSTILE_TOKEN)});
    }
  };

  window.__turnstileActiveId = null;

  window.turnstile = {
    render: function (container, options) {
      var id = String(nextId++);
      window.__turnstileActiveId = id;
      record("render", [{
        id: id,
        sitekey: options && options.sitekey,
        action: options && options.action,
      }]);
      widgets[id] = options || {};
      var mode = window.__turnstileMode || "pass";
      if (mode === "pass") {
        firePass(widgets[id], id);
      } else if (mode === "error") {
        fireError(widgets[id]);
      }
      // "manual": wait for __turnstileIssueToken
      return id;
    },
    reset: function (widgetId) {
      record("reset", [widgetId]);
      // Do not auto-complete on reset. Real widgets require a new solve;
      // always-pass test keys eventually re-pass, but for hermetic e2e the
      // test (or a delayed issueTurnstileToken) must re-issue the token.
      // Auto-firing here races React state: form setFormError(msg) then
      // reset → callback → setFormError(null) in the same turn.
    },
    remove: function (widgetId) {
      record("remove", [widgetId]);
      delete widgets[widgetId];
      if (window.__turnstileActiveId === widgetId) {
        window.__turnstileActiveId = null;
      }
    },
  };
})();
`;

export type TurnstileMode = "pass" | "manual" | "error";

export type TurnstileCall = {
  method: "render" | "reset" | "remove";
  args: unknown[];
};

declare global {
  interface Window {
    __turnstileMode?: TurnstileMode;
    __turnstileCalls?: TurnstileCall[];
    __turnstileActiveId?: string | null;
    __turnstileExpire?: (id: string | number) => void;
    __turnstileIssueToken?: (id: string | number) => void;
    __cspViolations?: { blockedURI: string; violatedDirective: string }[];
    __consoleErrors?: string[];
    __xss?: number;
  }
}
