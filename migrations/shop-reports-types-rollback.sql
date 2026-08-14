-- Rollback for shop-reports-types.sql
--
-- Restores the three dropped columns as nullable text, which is exactly how they
-- were. This does NOT recover their values — they were NULL in every row when the
-- up script ran, so there was nothing to preserve.
--
-- WARNING: dropping `details` discards the text of every report submitted since
-- the up script was applied. Read shop_reports before running this.

ALTER TABLE shop_reports
  ADD COLUMN IF NOT EXISTS reported_name text,
  ADD COLUMN IF NOT EXISTS reported_address text,
  ADD COLUMN IF NOT EXISTS reported_neighborhood text,
  DROP COLUMN IF EXISTS report_type,
  DROP COLUMN IF EXISTS details;
