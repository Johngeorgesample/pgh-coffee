-- Rollback for claims-schema.sql. Drops the shop_claims table (with its policy,
-- indexes, and all submitted claims). Irreversible.

DROP TABLE IF EXISTS shop_claims;
