-- Schema for the verified-shop badge.
--
-- Apply by hand (no migration framework in this repo). Purely additive: adds two
-- columns to the existing shops table. Safe to run on a live table — the default
-- backfills existing rows to unverified, and no rows are rewritten beyond that.
--
-- is_verified — true once a shop's ownership has been confirmed (today via a
--               hand-reviewed shop_claims row). Surfaced through the public shops
--               API as `properties.verified` and drives the panel badge.
-- verified_at — when verification was granted, for audit and so a shop can be
--               cleanly un-verified later.
--
-- NOTE: a link back to the claim that granted verification
-- (e.g. verified_claim_id uuid REFERENCES shop_claims(id)) is intentionally left
-- out until shop_claims is actually live in Supabase — a FK to a not-yet-created
-- table would fail to apply. Add it in the same migration that creates shop_claims.

ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS verified_at timestamptz;
