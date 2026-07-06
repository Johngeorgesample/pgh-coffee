-- Rollback for verified-roasters-schema.sql. Drops the verification columns from
-- roaster (and any verification state stored in them). Irreversible.

ALTER TABLE roaster DROP COLUMN IF EXISTS verified_claim_id;
ALTER TABLE roaster DROP COLUMN IF EXISTS verified_at;
ALTER TABLE roaster DROP COLUMN IF EXISTS is_verified;
