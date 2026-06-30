-- Rollback for verified-schema.sql. Drops the verification columns from shops
-- (and any verification state stored in them). Irreversible.

ALTER TABLE shops DROP COLUMN IF EXISTS verified_at;
ALTER TABLE shops DROP COLUMN IF EXISTS is_verified;
