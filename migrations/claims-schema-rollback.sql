-- Rollback for claims-schema.sql. Drops the claims table (with its policy,
-- indexes, and all submitted claims). Irreversible.

DROP TABLE IF EXISTS claims;
