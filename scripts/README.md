# scripts

## crawl-hours.mjs

Bootstraps / refreshes shop opening hours from the Google Places API (New) and
writes a reviewable SQL file. It is **read-only against the database** — it only
emits SQL for you to review and apply by hand.

### Run

```bash
node scripts/crawl-hours.mjs
```

### Prerequisites (all read from `.env.local`)

- `GOOGLE_MAPS_API_KEY` — a key with **Places API (New)** enabled.
- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) and `SUPABASE_ANON_KEY`
  (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — used to pull the current shop list
  (public `SELECT` on `shops`).

### What it does

1. Fetches all shops from Supabase.
2. For each shop: Text Search → picks the **nearest name-matching** candidate
   (not Google's relevance-ranked first result — that breaks duplicate-named
   chains) → confidence gate → Place Details → parses regular weekly hours.
3. Writes:
   - `migrations/hours-backfill.sql` — per-shop `DELETE`+`INSERT` blocks
     (idempotent), the schema (`CREATE TABLE IF NOT EXISTS`), verification
     queries, and a "NEEDS MANUAL REVIEW" list.
   - `migrations/hours-backfill-results.json` — raw per-shop results.

Both outputs are **gitignored**. Google Places hours are 30-day-max cached
content under the Maps Platform terms and must not be committed; re-run this
script to regenerate them. The committed schema lives in
`migrations/hours-schema.sql`.

### Notes

- Day-of-week is `0=Sunday .. 6=Saturday` (matches the Places API and
  `Date.getDay()`); times are local Pittsburgh wall-clock.
- Shops whose `shop_hours_meta.source` is `manual`/`shop_submitted` are
  protected by SQL guards in the generated blocks and never overwritten.
- Review the match distances and the manual-review list before applying.
