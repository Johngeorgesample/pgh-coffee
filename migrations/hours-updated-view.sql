-- shop_hours_updated — public read of when each shop's hours were last written.
--
-- shop_hours_meta stays admin-only (place ids and match distances are not for
-- the client); this view exposes only the timestamp. It runs as its owner, so
-- it reads through meta's RLS on purpose.
--
-- A failed refresh still bumps fetched_at but keeps the old hours, so only
-- successful writes count as an update.

CREATE OR REPLACE VIEW shop_hours_updated AS
  SELECT shop_uuid, fetched_at AS updated_at FROM shop_hours_meta
  WHERE status IN ('ok', 'no_hours');

GRANT SELECT ON shop_hours_updated TO anon, authenticated;
