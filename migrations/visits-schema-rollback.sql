-- Rollback for visits-schema.sql. Drops the user_visits table (and its policies,
-- index, and all visit data with it). Irreversible.

DROP TABLE IF EXISTS user_visits;
