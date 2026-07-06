# Task: Identify roasters for shops missing a `roaster_id` — PASS 1 of 2 (READ-ONLY)

## Where this sits
This is **pass 1 of a two-pass pipeline**:
- **Pass 1 (this task):** research who roasts for each shop and emit a **structured findings document**. Facts only — no actions, no SQL to apply.
- **Pass 2 (a later, separate agent):** consumes pass 1's document and shapes it into a runbook (`UPDATE` statements, `/add-roaster` invocations). **Not your concern.**

Your deliverable is one structured markdown document. That is the entire output.

## ⛔ Hard constraints — do not violate
- **Make NO database writes.** No `UPDATE`, no `INSERT`, no new `roaster` records, nothing.
- The `add-roaster` skill writes to the DB — **do not invoke it.** If a roaster needs creating, only *record that fact* in the document.
- **Do not emit UPDATE SQL or runbook steps.** That's pass 2's job. Output data, not actions.
- Reads only: `SELECT` queries and web research are the only actions you take.

## Context
- Supabase project: `uljutxoijtvtcxvatqso` (`pghcoffee`). Use `mcp__supabase__execute_sql` for reads.
- 98 of 173 shops have `roaster_id IS NULL`. The legacy `roaster` text column is **empty** for all of them — no existing data to mine; every shop needs research.
- ~30 roasters already exist in the `roaster` table. Strongly prefer matching these over proposing new ones.
- Relevant columns:
  - `shops`: `uuid` (the join key — carry it verbatim on every row), `name`, `neighborhood`, `website`, `company_id`, `roaster_id` (FK → `roaster.id`).
  - `roaster`: `id`, `name`, `slug`, `is_local`, `company_id`.
  - `shops` has **no** `instagram` column — only `website`.

---

## Step 0 — Deterministic SQL pre-pass (no web research)
Run these first; they resolve the easy cases for free.

**(a) company_id link → existing roaster** (auto bucket A, confidence=high, source="company_id link"):
```sql
SELECT s.uuid, s.name AS shop, s.neighborhood, r.id AS roaster_id, r.name AS roaster
FROM shops s
JOIN roaster r ON r.company_id = s.company_id
WHERE s.roaster_id IS NULL AND s.company_id IS NOT NULL;
```
(Currently matches Commonplace Coffee/Shadyside and The Coffee Tree Roasters/O'Hara.)

**(b) shop name matches a roaster name → likely self-roasting café** (bucket A, flag "self-roaster, confirm"):
```sql
SELECT s.uuid, s.name AS shop, s.neighborhood, r.id AS roaster_id, r.name AS roaster
FROM shops s
JOIN roaster r ON r.name ILIKE s.name OR s.name ILIKE '%' || r.name || '%'
WHERE s.roaster_id IS NULL;
```

Remove all shops resolved in step 0 from the research worklist.

## Step 1 — Build the worklist
```sql
SELECT uuid, name, neighborhood, website
FROM shops WHERE roaster_id IS NULL ORDER BY name;
```
```sql
SELECT id, name, slug FROM roaster ORDER BY name;  -- the match-against set
```

## Step 2 — Chunk the research
Split the remaining shops into **batches of ~15–20** and dispatch a **sub-agent per batch**. Give every sub-agent:
- its slice of the worklist,
- the **full existing roaster list** (id, name, slug),
- the evidence standard, bucket definitions, and output schema below.

Each sub-agent returns its rows in the exact schema. The orchestrator merges them (step 4).

## Step 3 — Per-shop research (sub-agent instructions)
- `WebSearch`, e.g. `"{shop name}" Pittsburgh {neighborhood} coffee roaster`.
- Source trust order: (1) shop's own website / "our coffee" page (`WebFetch`); (2) shop's Instagram / recent posts; (3) local press / interviews.

**Matching to existing roasters — semantic, not string-equality:** normalize case, drop suffixes like "Coffee"/"Roasters"/"Co.", treat obvious variants as the same roaster (e.g. "Commonplace" = "Commonplace Coffee", "La Prima" = "La Prima Espresso"). If a match is plausible but not certain, classify **A and flag it** ("likely = X, confirm") rather than proposing a new roaster.

**Evidence standard:** no confidence floor, but if evidence does **not** come directly from the shop (press, directories, third parties), it must be **recent — within the last few years**. Stale third-party claims don't count → mark unresolved. Never assign on a pure guess; every proposed match needs a cited source URL **and** a source date.

**Multiple/rotating roasters:** record all of them, but designate one **primary/house roaster** (the one a single `roaster_id` would represent). If there's genuinely no primary — true equal rotation — mark **bucket C** (a single FK can't honestly represent it; that's the user's call).

**Closed / not applicable:** if research strongly indicates the shop is permanently closed, or isn't a café serving brewed coffee (tea house, grocery, roaster-only retail), record bucket **N** with the source instead of guessing a roaster.

## Step 3.5 — Bucket definitions
- **A** — matches an existing roaster (incl. flagged-likely). Carry the `roaster.id`.
- **B** — roaster is real but not yet in the `roaster` table. Record name only; do NOT create it. Tag self-roasters (shop roasts its own, not yet a roaster record) distinctly.
- **C** — inconclusive, or evidence too old, or true no-primary rotation.
- **N** — appears closed / not applicable (data-quality flag).

## Step 4 — Merge pass (orchestrator)
After all batches return:
1. **Re-check every bucket-B name against the full existing roaster table** — a single batch with partial context is likelier to miss a match than the orchestrator seeing everything. Promote any new match to A.
2. **Consolidate bucket B by normalized roaster name** so each proposed-new roaster appears **once**, with all the shops it serves listed under it (avoids "Black & Gold" vs "Black and Gold" duplicates).
3. Assemble the final document.

## Output document — fixed schema (the pass-2 contract)
One table, one row per shop, these columns exactly (keep `uuid` verbatim — pass 2 joins on it):

`uuid | shop | neighborhood | proposed roaster(s) | primary roaster | bucket (A/B/C/N) | source URL | source date | confidence (high/med/low) | notes`

Then group the rows by bucket (A, B, C, N) for readability. For bucket B, also include the consolidated "proposed new roasters → shops served" grouping from step 4.2.

Do **not** add UPDATE SQL or `/add-roaster` steps — that is pass 2.

Save the document to `docs/roaster-backfill-findings.md` in the repo and report its path.
