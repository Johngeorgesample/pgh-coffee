# Papercuts

Small frictions hit while working in this repo. Append-only.

- **2026-07-23** — Verifying SSR output with `grep -c` on Next.js HTML → counted 1 because the whole page is one line; `grep -o | wc -l` needed for per-match counts. _Generic grep gotcha, but bit here because Next emits single-line HTML._
- **2026-07-23** — Widened `ShopListEntry` in `app/utils/seo.ts` → `tests/unit/seo.test.ts` fixtures broke because they hand-build entry objects instead of using a factory. _A `makeShopListEntry()` helper in the test would absorb future field additions._
