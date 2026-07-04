-- Schema for photos on events and updates.
--
-- Apply by hand (no migration framework in this repo). Purely additive: adds one
-- nullable text column to each table. Safe to run ahead of any data load; existing
-- rows keep image_url = NULL and the UI falls back to no photo.
--
-- image_url — absolute URL of the hero/thumbnail image for the event or update.

ALTER TABLE events  ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE updates ADD COLUMN IF NOT EXISTS image_url text;
