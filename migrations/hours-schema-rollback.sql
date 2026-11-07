-- Rollback for hours-schema.sql
--
-- The up script is purely additive (two new tables, an index, and RLS), so a full
-- reversal is just dropping both tables. DROP ... CASCADE also removes the read
-- policy, the idx_shop_hours_shop index, and the foreign keys to shops(uuid).
--
-- WARNING: this discards ALL hours data, including any rows later added or
-- corrected by hand (source='manual'/'shop_submitted'). Run it only when you
-- intend to remove the hours feature wholesale, not to undo a single bad refresh.

DROP TABLE IF EXISTS shop_hours CASCADE;
DROP TABLE IF EXISTS shop_hours_meta CASCADE;
