-- Apply by hand. Purely additive: events without a known time stay NULL.
-- Times are Pittsburgh local (America/New_York).
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_time time;
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time time;
