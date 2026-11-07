-- Turn shop_reports from a field editor into a typed report queue.
--
-- Apply by hand (no migration framework in this repo).
--
-- The old shape let users retype name/address/neighborhood/website. In practice
-- nobody ever did: every row that existed at migration time had NULL in all four
-- columns. What actually goes stale is hours and whether the shop still exists,
-- so reports are now typed and carry free text instead.
--
-- report_type   — what the reporter is telling us.
-- details       — free text for 'hours' and 'other'. 'closed' needs none, and
--                 'website' uses the surviving reported_website column.
--
-- APPLYING AN 'hours' REPORT: also set shop_hours_meta.source = 'shop_submitted'
-- for that shop. Refresh authority is that column alone (a shop is protected iff
-- source <> 'google_places'), so writing shop_hours by itself is reverted by the
-- next Google refresh within 14 days.

ALTER TABLE shop_reports
  ADD COLUMN IF NOT EXISTS report_type text NOT NULL DEFAULT 'other'
    CHECK (report_type IN ('hours','closed','website','other')),
  ADD COLUMN IF NOT EXISTS details text,
  DROP COLUMN IF EXISTS reported_name,
  DROP COLUMN IF EXISTS reported_address,
  DROP COLUMN IF EXISTS reported_neighborhood;
