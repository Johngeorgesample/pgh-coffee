-- Schema for the advent tasting journal.
--
-- Apply by hand (no migration framework in this repo). Purely additive: creates
-- one new table and RLS. Mirrors the user_visits shape.
--
-- user_tasting_notes — one row per (user, coffee) the user has logged.
--                      RLS: each user reads/writes only their own rows. No
--                      DELETE policy; the UI can't delete a cup.

CREATE TABLE IF NOT EXISTS user_tasting_notes (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coffee_id  text NOT NULL,
  rating     smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  tasted     text[] NOT NULL DEFAULT '{}',
  method     text,
  body       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, coffee_id)
);

ALTER TABLE user_tasting_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users read own tasting notes"   ON user_tasting_notes FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users insert own tasting notes" ON user_tasting_notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users update own tasting notes" ON user_tasting_notes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
