-- Daily per-IP submission quotas (hashed IP only — no raw addresses).
-- Used to bound survey spam that could skew published aggregates.

CREATE TABLE submission_quotas (
  day TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, ip_hash)
);

CREATE INDEX submission_quotas_day_idx ON submission_quotas (day);
