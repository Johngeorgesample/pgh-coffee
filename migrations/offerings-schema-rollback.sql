-- Rollback for offerings-schema.sql.
--
-- offerings-schema.sql only ADDED a column and backfilled it; the amenities
-- column was never modified. So a full rollback is simply dropping the column.

ALTER TABLE shops DROP COLUMN IF EXISTS offerings;
