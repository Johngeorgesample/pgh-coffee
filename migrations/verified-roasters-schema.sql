-- Verified badge for roasters. Mirrors verified-schema.sql (shops).
--
-- Apply by hand (no migration framework in this repo). Purely additive: adds two
-- columns to the existing roaster table. Safe to run on a live table — the default
-- backfills existing rows to unverified, and no rows are rewritten beyond that.
--
-- is_verified — true once a roaster's ownership has been confirmed (today via a
--               hand-reviewed claims row targeting the roaster). Surfaced through
--               /api/roasters/[slug] and drives the roaster page badge.
-- verified_at — when verification was granted, for audit and clean un-verifying.

ALTER TABLE roaster ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE roaster ADD COLUMN IF NOT EXISTS verified_at timestamptz;
