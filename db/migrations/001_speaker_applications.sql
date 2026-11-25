-- "Apply to speak" submissions for the Call For Professionals page.
-- Lengths and the LinkedIn rule are validated in the app (src/lib/applications.ts, shared by form and API).
-- This repo's migrations never touch the Demo Day `applications` table.

CREATE TABLE IF NOT EXISTS speaker_applications (
  id            BIGSERIAL   PRIMARY KEY,
  full_name     TEXT        NOT NULL,
  job_title     TEXT        NOT NULL,
  expertise     TEXT        NOT NULL,
  company       TEXT        NOT NULL,
  linkedin_url  TEXT        NOT NULL,
  bio           TEXT        NOT NULL,          -- short bio and the conference topics they can speak about
  locale        TEXT        NOT NULL CHECK (locale IN ('en', 'ar')),
  ip_hash       TEXT,                          -- salted SHA-256 (IP_HASH_SALT), never the raw IP
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS speaker_applications_created_idx ON speaker_applications (created_at DESC);
