-- Rollback for tasting-notes-schema.sql. Drops the user_tasting_notes table (and
-- its policies and all logged cups with it). Irreversible.

DROP TABLE IF EXISTS user_tasting_notes;
