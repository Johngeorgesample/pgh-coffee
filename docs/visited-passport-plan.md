# Visited (passport primitive) — implementation plan

**Scope:** `visited` as a boolean-mirror data primitive, login-gated, that makes
accounts meaningful. It is a near-exact clone of the existing `favorites` stack,
plus the one thing favorites lacks: a **progress denominator** (X of N shops).

This plan deliberately stops at the primitive. The Coffee Week seasonal view
(`COMPETITIVE_IDEAS.md` STEAL #1) is a later view on top of this data and is out
of scope here.

**Explicitly NOT in scope** (per `BLIND_SPOTS.md` #4): friends/social graph,
public profiles, shared feeds, cross-user leaderboards, crowd ratings, any paid
passport.

---

## What makes this different from favorites

Architecturally the row is identical to `user_favorites`
(`user_id`, `shop_id = shop uuid`, `created_at`). The differentiation is entirely
on the **read side**: the account surfaces *visited count against total shops*,
broken down by neighborhood. Favorites is an unbounded wishlist; visited is
progress toward a known denominator. That denominator is the whole feature.

Reuse, don't fork: every file below is a copy of its favorites counterpart with
`favorite`→`visit` renames, except the new progress endpoint.

---

## 1. Database — `migrations/visits-schema.sql`

Hand-applied, following the convention in `migrations/hours-schema.sql` (additive,
RLS enabled, `DO $$` guard for idempotent policy creation). Mirrors the
`user_favorites` shape.

```sql
-- User "visited" marks — the passport primitive.
-- Additive. One row per (user, shop). RLS: each user sees/writes only their own.

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
```

Plus `migrations/visits-schema-rollback.sql` (`DROP TABLE IF EXISTS user_visits;`).

> **Step-1 dependency, not resolvable from the repo.** There is no committed
> favorites migration — `migrations/` contains only hours + backfill files, so
> `user_favorites`' actual RLS exists only on the live table. "Match it exactly"
> requires live DB introspection before applying this migration; it can't be
> verified from source.

---

## 2. API — `app/api/visits/route.ts`

Direct clone of `app/api/favorites/route.ts`. Same three handlers, same 401-if-no-user
gate, same shop-existence validation on POST, same logger calls. Changes:

- table `user_favorites` → `user_visits`
- `metrics.favoriteAdded/Removed` → `metrics.visitAdded/Removed`
- log messages "favorite" → "visit"

GET returns rows with embedded `shop:shops (*)` ordered by `created_at desc`
(identical shape to favorites, so the account list page can reuse `ShopCard` +
`formatDBShopAsFeature`).

### New: `app/api/visits/progress/route.ts`

The denominator endpoint. Auth-gated. Returns:

```ts
{
  total: number,          // count of all shops
  visited: number,        // count of this user's visits
  byNeighborhood: { neighborhood: string; total: number; visited: number }[]
}
```

This is the one piece that is *not* a clone, and it has no existing precedent in
the codebase — specify it carefully rather than leaning on patterns that aren't
there:

- **Count in JS, not via `GROUP BY`.** PostgREST aggregates / `GROUP BY` are not
  enabled on a stock Supabase project, so "`shops` grouped by neighborhood" won't
  run through supabase-js. The real implementation is: `select neighborhood` from
  `shops` and `user_visits` (joined to `shops(neighborhood)`), then tally both in
  JS and merge. (Note: `metrics.shopsPerNeighborhood` is a defined-but-*unused*
  gauge setter with zero callers — there is no existing counting code to mirror.)
- **`total` = `count(shops)`.** Correct denominator: `shops` is the live published
  set; submissions go to a separate `moderation` table, so there is no status
  filter to apply.
- **`byNeighborhood` denominator = neighborhoods that contain ≥1 shop**, derived
  from the `shops` table — *not* the `TNeighborhood` enum (90 entries, most with
  zero shops; they'd be pure noise). The dashboard's "N neighborhoods" number is
  this count.
- **Decide on null `neighborhood` explicitly.** Some shop rows may have
  `neighborhood = null`; drop them or give them an explicit bucket, or the
  per-neighborhood rows silently won't sum to `total`.

Keep it one round-trip each; this is read-light.

---

## 3. Metrics — `lib/metrics.ts`

Add next to the favorite counters (line 88–89):

```ts
visitAdded:   (neighborhood: string) => increment('visit_added_total', { neighborhood }),
visitRemoved: () => increment('visit_removed_total'),
```

---

## 4. Client — `app/components/VisitedButton.tsx`

Clone of `FavoriteButton.tsx`. Same `useAuth()` gate → `LoginPromptModal` when
logged out, same toggle against `/api/visits`, same Plausible event
(`'visited'` instead of `'favorite'`). Visual differences only:

> Clone the toggle behavior exactly — it is **not** optimistic.
> `FavoriteButton.handleToggle` awaits the response and only then calls
> `setIsFavorited`. Don't "improve" it into a truly optimistic update, or
> VisitedButton diverges from the favorites behavior this plan wants to mirror.

- Icon: `Check` / `MapPinCheck` (lucide) instead of `Heart`.
- Filled/active state uses a "been here" treatment (e.g. solid green check) so it
  reads distinctly from the red favorite heart sitting next to it.
- `aria-label`/`title`: "Mark as visited" / "Visited".

Reuse `LoginPromptModal` as-is. A `VisitedToast` is optional — favorites has one
(`FavoriteToast.tsx`); clone it only if you want the same "added · View passport"
confirmation. Recommended yes, linking to `/account/visited`.

> **Known inherited cost.** `FavoriteButton` fetches the user's *entire* favorites
> list on every shop view just to compute one boolean (`isFavorited`). Cloning it
> verbatim means each shop detail view now fires **two** full-collection GETs
> (favorites + visits), and the dashboard adds the progress fetch on top.
> Acceptable for v1 — but the cheap fix, if it bites, is an existence check by
> `shopUUID` instead of pulling the whole collection.

### Wire into `QuickActionsBar.tsx`

Add immediately after the `FavoriteButton` line:

```tsx
<VisitedButton shopUUID={uuid} shopName={name} />
```

Order in the bar stays: Directions (primary) → Favorite → Visited → Share → …
Directions remains the primary action.

---

## 5. Account surfaces

**Progress card on the dashboard** (`app/account/AccountDetails.tsx`, rendered by
`Dashboard.tsx`): fetch `/api/visits/progress`, show the hero number
("12 of 172 shops · 4 of 31 neighborhoods") and a per-neighborhood breakdown
(simple bars or `visited/total` rows). This card is the payoff that favorites
doesn't have — it's why the account is now worth making.

> Both denominators come from the endpoint, not from constants. The neighborhood
> denominator is *neighborhoods that contain ≥1 shop* (see §2) — not the 90-entry
> `TNeighborhood` enum. Numbers above are illustrative; use whatever the endpoint
> returns.

**Visited list page:** `app/account/visited/page.tsx` + `Visited.tsx`, cloned from
`app/account/favorites/page.tsx` + `Favorites.tsx`. Swap copy ("No visits yet…"),
icon, and the fetch URL to `/api/visits`. Same `ShopCard`/`formatDBShopAsFeature`
rendering.

**Sidebar nav** (`app/account/components/Sidebar.tsx`): add a "Passport" / "Visited"
entry pointing to `/account/visited`, mirroring the Favorites entry.

---

## 6. Tests

Mirror `tests/unit/favoritesRoute.test.ts` for `/api/visits` (401 unauthenticated,
400 missing `shopUUID`, 404 unknown shop, happy-path insert/delete). Add a focused
test for `/api/visits/progress` asserting the denominator math (total vs. visited,
neighborhood merge) — that's the only genuinely new logic; don't restate the
clone-of-favorites handlers beyond the progress merge.

---

## Build order

1. `visits-schema.sql` + rollback; apply to the DB.
2. `metrics.ts` counters.
3. `app/api/visits/route.ts` (+ test).
4. `app/api/visits/progress/route.ts` (+ test).
5. `VisitedButton.tsx` (+ optional `VisitedToast.tsx`); wire into `QuickActionsBar`.
6. Account: progress card on dashboard, visited list page, sidebar entry.

Steps 1–4 are the primitive; 5–6 are the surfaces. Everything after step 1 is a
rename of existing, working code except the progress endpoint + its card.

