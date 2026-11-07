-- Rollback for event-update-photos-schema.sql. Drops the image_url column from
-- both tables (and any URLs stored in it). Irreversible.

ALTER TABLE events  DROP COLUMN IF EXISTS image_url;
ALTER TABLE updates DROP COLUMN IF EXISTS image_url;
