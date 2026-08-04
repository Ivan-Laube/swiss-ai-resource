-- Survey intake (T23). Answers and optional report emails are unlinkable:
-- separate tables, separate ids, no foreign key between them.

CREATE TABLE responses (
  id TEXT PRIMARY KEY NOT NULL,
  survey_id TEXT NOT NULL,
  survey_version INTEGER NOT NULL,
  locale TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  report_opt_in INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX responses_created_at_idx ON responses (created_at);

-- Standalone opt-in list for benchmark-report notification. No response_id.
CREATE TABLE report_signups (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  locale TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX report_signups_email_idx ON report_signups (email);
CREATE INDEX report_signups_created_at_idx ON report_signups (created_at);
