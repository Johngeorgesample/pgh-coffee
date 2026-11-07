-- Schema for the shop hours-of-operation feature.
--
-- Apply by hand (no migration framework in this repo). Purely additive: creates
-- two new tables, an index, and RLS. Safe to run ahead of any data load.
--
-- shop_hours      — canonical, source-agnostic weekly schedule (public-read).
-- shop_hours_meta — per-shop provenance + Google-specific operational data (admin-only).
--
-- Hours data itself is loaded separately (see the generated hours-backfill.sql,
-- which is NOT committed: Google-sourced hours are 30-day-max cached content under
-- the Maps Platform terms, so they must not live permanently in version control).
-- Day-of-week: 0=Sunday .. 6=Saturday. Times are local (America/New_York).

CREATE TABLE IF NOT EXISTS shop_hours (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_uuid      uuid NOT NULL REFERENCES shops(uuid) ON DELETE CASCADE,
  day_of_week    smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at       time NOT NULL,
  closes_at      time NOT NULL,
  spans_midnight boolean NOT NULL DEFAULT false,
  UNIQUE (shop_uuid, day_of_week, opens_at)
);
CREATE INDEX IF NOT EXISTS idx_shop_hours_shop ON shop_hours(shop_uuid);
ALTER TABLE shop_hours ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Enable read access for all users" ON shop_hours FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS shop_hours_meta (
  shop_uuid        uuid PRIMARY KEY REFERENCES shops(uuid) ON DELETE CASCADE,
  source           text NOT NULL DEFAULT 'google_places'
                     CHECK (source IN ('google_places','manual','shop_submitted')),
  status           text NOT NULL
                     CHECK (status IN ('ok','no_hours','not_found','low_confidence','not_operational','error')),
  google_place_id  text,
  match_distance_m double precision,
  fetched_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE shop_hours_meta ENABLE ROW LEVEL SECURITY;
-- No policies: admin/service-role only (not readable/writable by anon).
