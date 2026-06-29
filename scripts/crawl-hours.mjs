// Hours-of-operation crawl for pgh.coffee.
// Reads shops from Supabase (anon, public SELECT), resolves each against Google
// Places API (New), parses regular weekly hours, and emits a reviewable SQL file.
// Does NOT touch the database. See docs/hours-backfill-plan.md.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

// Repo root, derived from this script's location (scripts/ -> repo root).
const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = `${ROOT}/migrations/hours-backfill.sql`;

// ---- env -------------------------------------------------------------------
function loadEnv() {
  const txt = readFileSync(`${ROOT}/.env.local`, "utf8");
  const env = {};
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}
const env = loadEnv();
const KEY = env.GOOGLE_MAPS_API_KEY;
const SUPABASE_URL = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!KEY) throw new Error("GOOGLE_MAPS_API_KEY missing from .env.local");

// ---- helpers ---------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function haversineM(a, b) {
  const R = 6371000, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// normalized token set: lowercase, strip punctuation, drop generic coffee words
const STOP = new Set(["coffee", "cafe", "café", "co", "tea", "the", "and", "pgh"]);
function normTokens(name) {
  return new Set(
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t && !STOP.has(t))
  );
}
function nameMatch(a, b) {
  const A = normTokens(a), B = normTokens(b);
  if (!A.size || !B.size) return false;
  for (const t of A) if (B.has(t)) return true; // token overlap
  const sa = [...A].join(""), sb = [...B].join("");
  return sa.includes(sb) || sb.includes(sa); // substring either direction
}

const pad = (n) => String(n).padStart(2, "0");
const hhmm = (h, m) => `${pad(h ?? 0)}:${pad(m ?? 0)}`;

// ---- Google calls ----------------------------------------------------------
async function searchText(shop) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.location,places.businessStatus",
    },
    body: JSON.stringify({
      textQuery: `${shop.name}, ${shop.address}`,
      locationBias: {
        circle: {
          center: { latitude: shop.latitude, longitude: shop.longitude },
          radius: 500.0,
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`searchText ${res.status}: ${await res.text()}`);
  return (await res.json()).places || [];
}

async function placeDetails(placeId) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": KEY,
        "X-Goog-FieldMask": "id,displayName,regularOpeningHours,businessStatus",
      },
    }
  );
  if (!res.ok) throw new Error(`details ${res.status}: ${await res.text()}`);
  return res.json();
}

// ---- hours parsing ---------------------------------------------------------
// Returns { rows: [{day,opens,closes,spans}], status }
function parseHours(details) {
  const roh = details.regularOpeningHours;
  if (!roh || !Array.isArray(roh.periods) || roh.periods.length === 0) {
    return { rows: [], status: "no_hours" };
  }
  // 24/7: single period, open day0 00:00, no close.
  if (roh.periods.length === 1) {
    const p = roh.periods[0];
    if (p.open && !p.close && (p.open.hour ?? 0) === 0 && (p.open.minute ?? 0) === 0) {
      const rows = [];
      for (let d = 0; d < 7; d++)
        rows.push({ day: d, opens: "00:00", closes: "23:59", spans: false });
      return { rows, status: "ok" };
    }
  }
  const rows = [];
  for (const p of roh.periods) {
    if (!p.open || !p.close) continue; // skip malformed (already handled 24/7)
    const day = p.open.day;
    const opens = hhmm(p.open.hour, p.open.minute);
    const closes = hhmm(p.close.hour, p.close.minute);
    const spans = p.close.day !== p.open.day;
    rows.push({ day, opens, closes, spans });
  }
  if (rows.length === 0) return { rows: [], status: "no_hours" };
  return { rows, status: "ok" };
}

// ---- confidence gate -------------------------------------------------------
// candidates: [{id, name, loc:{lat,lng}, businessStatus}]
function resolve(shop, candidates) {
  const here = { lat: shop.latitude, lng: shop.longitude };
  const scored = candidates
    .filter((c) => c.location)
    .map((c) => ({
      ...c,
      dist: haversineM(here, { lat: c.location.latitude, lng: c.location.longitude }),
      nm: nameMatch(shop.name, c.displayName?.text || ""),
    }))
    .sort((a, b) => a.dist - b.dist);

  if (scored.length === 0) return { status: "not_found", chosen: null };

  // acceptable: <=50m, or <=150m with a name match
  const acceptable = scored.filter((c) => c.dist <= 50 || (c.dist <= 150 && c.nm));
  if (acceptable.length) return { status: "accept", chosen: acceptable[0] };

  const within250 = scored.filter((c) => c.dist <= 250);
  if (within250.length) return { status: "low_confidence", chosen: within250[0] };

  return { status: "not_found", chosen: scored[0] };
}

// ---- main ------------------------------------------------------------------
async function fetchShops() {
  const url =
    `${SUPABASE_URL}/rest/v1/shops` +
    `?select=uuid,name,neighborhood,address,latitude,longitude` +
    `&order=neighborhood,name`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
  });
  if (!res.ok) throw new Error(`shops fetch ${res.status}: ${await res.text()}`);
  return res.json();
}

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

async function main() {
  const shops = await fetchShops();
  console.error(`Fetched ${shops.length} shops`);

  const results = [];
  for (let i = 0; i < shops.length; i++) {
    const shop = shops[i];
    const r = {
      shop,
      status: "error",
      placeId: null,
      dist: null,
      matchName: null,
      rows: [],
    };
    try {
      const candidates = await searchText(shop);
      const { status, chosen } = resolve(shop, candidates);
      if (chosen) {
        r.placeId = chosen.id;
        r.dist = Math.round(chosen.dist);
        r.matchName = chosen.displayName?.text || null;
      }
      if (status === "not_found") {
        r.status = "not_found";
      } else if (status === "low_confidence") {
        r.status = "low_confidence";
      } else {
        // accepted
        if (chosen.businessStatus && chosen.businessStatus !== "OPERATIONAL") {
          r.status = "not_operational";
        } else {
          const details = await placeDetails(chosen.id);
          if (details.businessStatus && details.businessStatus !== "OPERATIONAL") {
            r.status = "not_operational";
          } else {
            const parsed = parseHours(details);
            r.status = parsed.status;
            r.rows = parsed.rows;
          }
          await sleep(60);
        }
      }
    } catch (e) {
      r.status = "error";
      r.error = String(e.message || e);
    }
    results.push(r);
    console.error(
      `[${i + 1}/${shops.length}] ${shop.name} / ${shop.neighborhood} -> ${r.status}` +
        (r.dist != null ? ` (${r.dist}m, "${r.matchName}")` : "") +
        (r.rows.length ? ` ${r.rows.length} rows` : "")
    );
    await sleep(40);
  }

  writeFileSync(OUT, renderSql(results));
  console.error(`\nWrote ${OUT}`);
  // summary
  const byStatus = {};
  for (const r of results) byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  console.error("STATUS SUMMARY:", JSON.stringify(byStatus));
  writeFileSync(
    OUT.replace(/\.sql$/, "-results.json"),
    JSON.stringify(results, null, 2)
  );
}

function renderSql(results) {
  const L = [];
  L.push("-- Hours-of-operation backfill for pgh.coffee");
  L.push("--");
  L.push("-- Generated for human review. Apply by hand (no migration framework in this repo).");
  L.push("-- Sourced from Google Places API (New). Google-sourced hours are a 30-day-max");
  L.push("-- refreshable cache (Maps Platform terms); the 14-day refresh + compliance sweep");
  L.push("-- keep them within policy. Only the Place ID is retained indefinitely.");
  L.push("-- Day-of-week: 0=Sunday .. 6=Saturday. Times are local (America/New_York).");
  L.push("--");
  L.push(`-- Generated ${new Date().toISOString()}`);
  L.push("");
  L.push("-- ============================================================================");
  L.push("-- MIGRATION  (creates both tables + RLS; safe to run ahead of the data below)");
  L.push("-- ============================================================================");
  L.push(MIGRATION);
  L.push("");
  L.push("-- ============================================================================");
  L.push("-- HOURS  (one block per accepted shop; DELETE+INSERT is idempotent & re-runnable)");
  L.push("-- ============================================================================");
  L.push("");

  for (const r of results) {
    const s = r.shop;
    const tag = `${s.name} / ${s.neighborhood}`;
    if (r.status === "ok" || r.status === "no_hours") {
      L.push(`-- ${tag}  (place_id ${r.placeId}, ${r.dist}m -> "${r.matchName}")`);
      L.push(deleteGuard(s.uuid));
      if (r.rows.length) {
        const vals = r.rows
          .map(
            (row) =>
              `  (${sqlStr(s.uuid)}, ${row.day}, ${sqlStr(row.opens)}, ${sqlStr(
                row.closes
              )}, ${row.spans})`
          )
          .join(",\n");
        L.push(
          "INSERT INTO shop_hours (shop_uuid, day_of_week, opens_at, closes_at, spans_midnight) VALUES"
        );
        L.push(vals + ";");
      }
      L.push(metaUpsert(s.uuid, r.status, r.placeId, r.dist));
      L.push("");
    } else {
      // low_confidence / not_found / not_operational / error: meta only, no hours
      L.push(`-- ${tag}  [${r.status}]` + (r.dist != null ? ` (nearest ${r.dist}m -> "${r.matchName}")` : "") + (r.error ? ` err: ${r.error.slice(0, 120)}` : ""));
      L.push(metaUpsert(s.uuid, r.status, r.placeId, r.dist));
      L.push("");
    }
  }

  L.push(VERIFICATION);
  L.push("");
  L.push("-- ============================================================================");
  L.push("-- NEEDS MANUAL REVIEW");
  L.push("-- ============================================================================");
  for (const r of results) {
    if (["low_confidence", "not_found", "error"].includes(r.status)) {
      L.push(
        `--   ${r.shop.name} / ${r.shop.neighborhood}: ${r.status}` +
          (r.dist != null ? ` (nearest ${r.dist}m -> "${r.matchName}")` : "") +
          (r.error ? ` ${r.error.slice(0, 120)}` : "")
      );
    }
  }
  L.push("");
  return L.join("\n");
}

function deleteGuard(uuid) {
  return (
    `DELETE FROM shop_hours WHERE shop_uuid = ${sqlStr(uuid)}\n` +
    `  AND NOT EXISTS (SELECT 1 FROM shop_hours_meta m\n` +
    `    WHERE m.shop_uuid = ${sqlStr(uuid)} AND m.source <> 'google_places');`
  );
}

function metaUpsert(uuid, status, placeId, dist) {
  return (
    `INSERT INTO shop_hours_meta (shop_uuid, source, status, google_place_id, match_distance_m, fetched_at)\n` +
    `VALUES (${sqlStr(uuid)}, 'google_places', ${sqlStr(status)}, ${
      placeId ? sqlStr(placeId) : "NULL"
    }, ${dist != null ? dist : "NULL"}, now())\n` +
    `ON CONFLICT (shop_uuid) DO UPDATE SET\n` +
    `  status=EXCLUDED.status, google_place_id=EXCLUDED.google_place_id,\n` +
    `  match_distance_m=EXCLUDED.match_distance_m, fetched_at=EXCLUDED.fetched_at\n` +
    `WHERE shop_hours_meta.source='google_places';`
  );
}

const MIGRATION = `
CREATE TABLE IF NOT EXISTS shop_hours (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_uuid      uuid NOT NULL REFERENCES shops(uuid) ON DELETE CASCADE,
  day_of_week    smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at       time NOT NULL,
  closes_at      time NOT NULL,
  spans_midnight boolean NOT NULL DEFAULT false,
  UNIQUE (shop_uuid, day_of_week, opens_at)
);
CREATE INDEX IF NOT EXISTS idx_shop_hours_shop ON shop_hours(shop_uuid);
ALTER TABLE shop_hours ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Enable read access for all users" ON shop_hours FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS shop_hours_meta (
  shop_uuid        uuid PRIMARY KEY REFERENCES shops(uuid) ON DELETE CASCADE,
  source           text NOT NULL DEFAULT 'google_places'
                     CHECK (source IN ('google_places','manual','shop_submitted')),
  status           text NOT NULL
                     CHECK (status IN ('ok','no_hours','not_found','low_confidence','not_operational','error')),
  google_place_id  text,
  match_distance_m double precision,
  fetched_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE shop_hours_meta ENABLE ROW LEVEL SECURITY;
-- No policies: admin/service-role only (not readable/writable by anon).`;

const VERIFICATION = `-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- SELECT status, count(*) FROM shop_hours_meta GROUP BY status ORDER BY status;
--
-- -- shops with no schedule rows (expected for no_hours/not_found/low_confidence/not_operational)
-- SELECT s.name, s.neighborhood, m.status
-- FROM shops s LEFT JOIN shop_hours_meta m ON m.shop_uuid=s.uuid
-- WHERE NOT EXISTS (SELECT 1 FROM shop_hours h WHERE h.shop_uuid=s.uuid)
-- ORDER BY m.status NULLS FIRST, s.name;
--
-- -- manual review queue
-- SELECT s.name, s.neighborhood, m.status, m.match_distance_m
-- FROM shop_hours_meta m JOIN shops s ON s.uuid=m.shop_uuid
-- WHERE m.status IN ('low_confidence','not_found','error') ORDER BY m.status, s.name;
--
-- -- close-before-open sanity (allowed only when spans_midnight)
-- SELECT s.name, h.day_of_week, h.opens_at, h.closes_at
-- FROM shop_hours h JOIN shops s ON s.uuid=h.shop_uuid
-- WHERE h.closes_at <= h.opens_at AND NOT h.spans_midnight;
--
-- -- compliance: no google_places hours older than 30 days should exist post-sweep
-- SELECT count(*) FROM shop_hours h JOIN shop_hours_meta m ON m.shop_uuid=h.shop_uuid
-- WHERE m.source='google_places' AND m.fetched_at < now() - interval '30 days';`;

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
