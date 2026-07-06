-- Rollback for verified-companies-schema.sql. Drops the verification columns from
-- companies (and any verification state stored in them). Irreversible.

ALTER TABLE companies DROP COLUMN IF EXISTS verified_at;
ALTER TABLE companies DROP COLUMN IF EXISTS is_verified;
