-- Schema for the verified-shop badge.
--
-- Apply by hand (no migration framework in this repo). Purely additive: adds two
-- columns to the existing shops table. Safe to run on a live table — the default
-- backfills existing rows to unverified, and no rows are rewritten beyond that.
--
-- is_verified — true once a shop's ownership has been confirmed (today via a
--               hand-reviewed claims row). Surfaced through the public shops
--               API as `properties.verified` and drives the panel badge.
-- verified_at — when verification was granted, for audit and so a shop can be
--               cleanly un-verified later.
-- verified_claim_id — the claim that granted verification, for provenance when a
--               claim is reviewed by hand. FK to claims(id), so apply
--               claims-schema.sql before this file. ON DELETE SET NULL: pruning a
--               claim drops the link, it doesn't un-verify the shop.

ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS verified_at timestamptz;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS verified_claim_id uuid REFERENCES claims(id) ON DELETE SET NULL;
