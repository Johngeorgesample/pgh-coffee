-- Marks a shop as permanently closed.
--
-- Apply by hand (no migration framework in this repo). Purely additive: the
-- default backfills every existing row to open, and no rows are rewritten
-- beyond the explicit seed below.
--
-- Closed shops are filtered out of every list surface (map, search, sitemap,
-- company/roaster panels) but stay readable by uuid. That's what lets a user's
-- passport keep the stamp and /shops/<slug> render a tombstone instead of a 404.
--
-- This replaces the old hand-rolled workflow of copying the row into
-- `closed_shops` and deleting it from `shops`, which destroyed the visits.

ALTER TABLE shops ADD COLUMN IF NOT EXISTS permanently_closed boolean NOT NULL DEFAULT false;

-- Seed: the one shop Google Places currently reports as CLOSED_PERMANENTLY.
-- The other `shop_hours_meta.status = 'not_operational'` rows are
-- CLOSED_TEMPORARILY and deliberately left open.
UPDATE shops SET permanently_closed = true WHERE uuid = 'e3bd219a-c907-4b6c-9a78-d4c177bc7e1a';
