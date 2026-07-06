-- Verified badge for companies. Mirrors verified-schema.sql (shops).
--
-- Apply by hand (no migration framework in this repo). Purely additive: adds two
-- columns to the existing companies table. Safe to run on a live table — the
-- default backfills existing rows to unverified, and no rows are rewritten beyond
-- that.
--
-- is_verified — true once a company's ownership has been confirmed (today via a
--               hand-reviewed claims row targeting the company). Surfaced through
--               /api/companies/[company] and drives the company page badge.
-- verified_at — when verification was granted, for audit and clean un-verifying.
-- verified_claim_id — the claim that granted verification, for provenance. FK to
--               claims(id), so apply claims-schema.sql before this file.

ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS verified_at timestamptz;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS verified_claim_id uuid REFERENCES claims(id) ON DELETE SET NULL;
