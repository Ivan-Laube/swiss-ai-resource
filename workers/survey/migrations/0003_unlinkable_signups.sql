-- Make answers and report emails unlinkable again (Datenschutzerklärung
-- §2.2/§2.3). Before this, `responses.report_opt_in` marked exactly the
-- answers that had an email, and on a quiet day (date, locale, opt-in) was
-- enough to match a `report_signups` row to its answer.
--
-- Deploy the Worker that no longer writes `report_opt_in` BEFORE applying
-- this migration remotely: the previous Worker names the column in its
-- INSERT and fails once it is gone. See DEPLOY.md "Unlinkability rollout".

-- 1. Drop the opt-in marker. This also removes it from every existing row,
--    so no separate backfill is needed.
ALTER TABLE responses DROP COLUMN report_opt_in;

-- 2. report_signups: week-precision created_at (Monday of the UTC week) and
--    no rowid, so neither the date nor the insert order can be lined up
--    with responses.created_at. SQLite can't change either in place, so
--    rebuild the table and coarsen existing rows on the way.
CREATE TABLE report_signups_new (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  locale TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (date('now', '-6 days', 'weekday 1'))
) WITHOUT ROWID;

INSERT INTO report_signups_new (id, email, locale, created_at)
SELECT id, email, locale, date(created_at, '-6 days', 'weekday 1')
FROM report_signups;

DROP TABLE report_signups;
ALTER TABLE report_signups_new RENAME TO report_signups;

CREATE INDEX report_signups_email_idx ON report_signups (email);
CREATE INDEX report_signups_created_at_idx ON report_signups (created_at);

-- 3. Quota rows written before the switch to a keyed hash hold an unsalted
--    SHA-256 of the client IP, which is reversible for IPv4. They only
--    matter for the current UTC day, so drop them all (today's counters
--    restart; the new hashes would not match them anyway).
DELETE FROM submission_quotas;
