-- Schema for public, shareable profiles.
--
-- Apply by hand (no migration framework in this repo). Additive: creates one new
-- table, its RLS, a public-read policy on user_visits, a signup trigger, and a
-- one-time backfill. Mirrors the public-sharing shape already used by
-- user_lists (is_public + "own or public" SELECT policy).
--
-- profiles — one row per user. A profile becomes publicly viewable at
--            /u/<username> once the user claims a username AND sets is_public.
--            Public identity is display_name + avatar_url ONLY; email and other
--            auth.users fields are never exposed through this table.

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS profiles (
  user_id      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     citext UNIQUE,
  display_name text,
  avatar_url   text,
  is_public    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT username_format CHECK (username IS NULL OR username ~ '^[a-z0-9_]{3,30}$')
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone may read a public profile; owners may read their own (even when private).
DO $$ BEGIN
  CREATE POLICY "Public or own profiles readable" ON profiles
    FOR SELECT TO anon, authenticated
    USING (is_public = true OR auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Owners may edit their own profile only. user_id is fixed by the trigger and
-- the policy prevents reassigning rows to another user.
DO $$ BEGIN
  CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Public read path for a public profile's visits. The existing owner-only
-- "Users read own visits" policy stays; policies are OR-ed together.
DO $$ BEGIN
  CREATE POLICY "Public read visits of public profiles" ON user_visits
    FOR SELECT TO anon, authenticated
    USING (EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = user_visits.user_id AND p.is_public = true));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Auto-create a profile row on signup, seeding display_name / avatar_url from
-- the OAuth metadata. Stays private with no username until the user claims one.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (user_id, display_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- One-time backfill for users who signed up before the trigger existed.
INSERT INTO profiles (user_id, display_name, avatar_url)
SELECT id,
       raw_user_meta_data->>'full_name',
       raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
