-- Rollback for descriptions-backfill.sql
--
-- Fully reverses the up script:
--   1. Restores companies.description and roaster.description for every row the
--      up script overwrote, to the exact value captured before it ran.
--   2. Drops the additive shops.description column (which also discards the shop
--      descriptions, since they lived only in that column).
--
-- The pre-up values were captured from the live database while the up script was
-- still unapplied. Run this only against a database in the post-up state.

-- ============================================================================
-- RESTORE COMPANIES  (18 rows: 16 were NULL, 2 were empty string)
-- ============================================================================

UPDATE companies SET description = NULL WHERE id IN (
  '77878cd4-273d-421d-b5d0-47c7180cffef', -- Brave Bean Coffee Company
  'b435608a-74fa-4a64-9bdc-025ecef9b524', -- Brother Andre's Cafe
  'ab2524bd-ad30-4aa4-a534-30489a70f54c', -- COLOMBINO Coffee
  '7e33f4fa-8483-4e82-8160-0c033fa5a295', -- Convive Coffee
  '35ac14e2-4eb6-4c91-952a-186e668d54bf', -- Delanie's Coffee
  'fb3a074e-2955-4aa7-931c-87adb5507465', -- Dynamic Coffee
  '76e39c25-aa8a-4b66-8e49-a803d9184c35', -- Ineffable Cà Phê
  'c3bff338-c662-4baf-8432-4465a1b011a1', -- Mediterra Cafe
  'b2a58d2c-916e-4897-a1cc-d19b05dcf3ec', -- Redhawk Coffee Roasters
  'e66f5c0c-783e-4931-8711-f9df9529aba6', -- Rockin' Cat
  '6ce24e15-c994-4e94-831d-73349e2db6ba', -- Ruckus Cafe
  '1dad24f2-8d92-49e5-b031-5a5154514595', -- Standing Wave Coffee
  '140134e1-20a8-4af7-a8a7-4af45d0a6b02', -- Tazza D'Oro
  'b9667143-a7a5-4131-ae6c-409d4f8651b6', -- The Boredom Set
  '443e3277-d603-444d-a120-71609a0cbaa8', -- The Coffee Village
  'cafa0802-5ee6-4f8f-86a1-9684bf899481'  -- Trace
);

UPDATE companies SET description = '' WHERE id IN (
  '97b9daa4-f6af-4d2f-a78c-f6b4a586890c', -- Mechanic Coffee
  'eadf385b-a80b-4df2-9387-0db5d660c343'  -- Yinz Coffee
);

-- ============================================================================
-- RESTORE ROASTERS  (3 rows: 1 was NULL, 2 held their original copy)
-- ============================================================================

UPDATE roaster SET description = NULL WHERE id = '62fdc95a-bdeb-44c4-a5e7-513b161e8b5f'; -- Mechanic Coffee

UPDATE roaster SET description = $d$At Commonplace, we love when things are the very best version they can be. When we aren’t behind bar, roasting coffee, fixing espresso machines, or the many other things that happen within Commonplace, you’ll often find us making things at home and in our communities. We’re potters, carpenters, painters, knitters, illustrators, cooks, mechanics, and so much more. Craft can be considered the meeting place of art and science. To us, the term “craft” applies directly to the process of making coffee. We use the artistic side to decide where we want to take our coffee, and the science behind the process to make the idea replicable and the best it can be. Just like other artists and scientists, we get excited about sharing our craft with others. We love hosting classes and events that show people how complex, surprising, and fun coffee can be. We hope you think it’s fun too! $d$ WHERE id = '5902c75b-a894-4390-9c6b-dc96afcd4132'; -- Commonplace Coffee

UPDATE roaster SET description = $d$At It's Still Coffee, we believe any coffee can be a welcoming coffee. Each lot carries its own story, shaped by place, people, and process—and each has something to offer when approached with care. Alongside timeless profiles, we embrace innovative coffees that push boundaries while staying rooted in origin. The result is a selection that’s balanced, expressive, and honest, inviting connection from first sip to last. This is coffee meant to be explored, shared, and enjoyed, just as it is.$d$ WHERE id = '82fad668-ab0e-47e8-86cd-112bc2ebdc6b'; -- It's Still Coffee

-- ============================================================================
-- DROP COLUMN  (reverts the MIGRATION section and all shop descriptions)
-- ============================================================================

ALTER TABLE shops DROP COLUMN IF EXISTS description;
