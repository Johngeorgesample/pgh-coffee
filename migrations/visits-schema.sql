-- Schema for the "visited" passport primitive.
--
-- Apply by hand (no migration framework in this repo). Purely additive: creates
-- one new table, an index, and RLS. Mirrors the user_favorites shape.
--
-- user_visits — one row per (user, shop) the user has marked as visited.
--               RLS: each user reads/writes only their own rows.
--
-- NOTE: the user_favorites migration is not committed, so its live RLS could not
-- be diffed from source. Before applying, confirm these policies match the actual
-- user_favorites policies on the live database and reconcile any differences.

CREATE TABLE IF NOT EXISTS user_visits (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id    uuid NOT NULL REFERENCES shops(uuid) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, shop_id)
);

CREATE INDEX IF NOT EXISTS idx_user_visits_user ON user_visits(user_id);

ALTER TABLE user_visits ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users read own visits"   ON user_visits FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users insert own visits" ON user_visits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own visits" ON user_visits FOR DELETE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
