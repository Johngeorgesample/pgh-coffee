-- Rollback for descriptions-backfill.sql
--
-- Reverses ONLY the additive schema change from that script's MIGRATION section:
-- the shops.description column. Dropping the column also discards the shop
-- descriptions stored in it.
--
-- NOTE: the up script's COMPANIES and ROASTERS UPDATEs overwrote values in
-- pre-existing columns (companies.description, roaster.description). Those are
-- data edits, not schema, and are NOT reversible by this script — restore them
-- from a database backup if you need the prior copy.

ALTER TABLE shops DROP COLUMN IF EXISTS description;
