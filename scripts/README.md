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
   - `migrations/hours-backfill.sql` — the schema
     (`CREATE TABLE IF NOT EXISTS`), a staleness warning, per-shop
     `DELETE`+`INSERT` blocks (idempotent), verification queries, and a "NEEDS
     MANUAL REVIEW" list.
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
- **Generating the file changes nothing, and nothing refreshes hours on a
  schedule.** Hours stay as old as they were until someone runs the SQL, and
  Google's terms cap the cache at 30 days. The file raises a `WARNING` if the
  hours it is replacing are already past that (visible in `psql`; the Supabase
  SQL editor drops it, so run the compliance query under `VERIFICATION` there).
- `fetched_at` only advances when a shop's hours were actually replaced. A shop
  that errored or stopped matching keeps its old hours and its old `fetched_at`,
  so it still shows up as stale.
- The file is a snapshot of the shop list at crawl time. A shop deleted since
  the crawl is skipped, and one whose hours became `manual`/`shop_submitted` is
  left alone — but re-crawl anyway, a new shop's hours won't be in the file.
