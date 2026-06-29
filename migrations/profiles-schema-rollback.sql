-- Rollback for profiles-schema.sql. Drops the profiles table (and all profile
-- data with it), the signup trigger/function, and the public-read policy added
-- to user_visits. The owner-only user_visits policies are left intact.

DROP POLICY IF EXISTS "Public read visits of public profiles" ON user_visits;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS profiles;
