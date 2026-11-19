-- Rollback for closed-shops-schema.sql.
ALTER TABLE shops DROP COLUMN IF EXISTS permanently_closed;
