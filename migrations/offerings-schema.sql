-- Schema for shop "offerings" — what a shop serves (food + drink specialties),
-- as distinct from amenities (physical facilities like wifi, outlets, parking).
--
-- Apply by hand (no migration framework in this repo). Purely additive and
-- non-breaking: adds one column and backfills it. The amenities column is left
-- completely untouched, so existing amenity filters keep working. The food keys
-- are COPIED (not moved) here; they are removed from amenities in a later
-- cleanup migration once offerings is fully shipped.
--
-- Drink specialties (espresso, pour_over, ...) have no source data yet; they are
-- populated separately via an editorial backfill (see descriptions-backfill.sql
-- for the pattern). This migration only seeds the food keys.

ALTER TABLE shops ADD COLUMN IF NOT EXISTS offerings text[] NOT NULL DEFAULT '{}';

-- Copy the three food keys out of amenities into offerings. Unions with any
-- existing offerings and de-dupes, so it is safe to re-run and order-independent
-- with the editorial drink backfill.
UPDATE shops
SET offerings = array(
  SELECT DISTINCT unnest(
    offerings || array(
      SELECT unnest(amenities)
      INTERSECT
      SELECT unnest(ARRAY['pastries', 'snacks', 'full_food_menu'])
    )
  )
)
WHERE amenities && ARRAY['pastries', 'snacks', 'full_food_menu'];
