export function stripLeadingSqlComment(sql) {
  const lines = sql.split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].trim() === "" || lines[i].trim().startsWith("--"))) i++;
  const ddl = lines.slice(i).join("\n").trim();
  if (!ddl) throw new Error("No DDL found after stripping the leading comment header");
  return ddl;
}

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

function shopExists(uuid) {
  return `EXISTS (SELECT 1 FROM shops WHERE uuid = ${sqlStr(uuid)})`;
}

function googleOwned(uuid) {
  return (
    `NOT EXISTS (SELECT 1 FROM shop_hours_meta m\n` +
    `    WHERE m.shop_uuid = ${sqlStr(uuid)} AND m.source <> 'google_places')`
  );
}

function deleteHours(uuid) {
  return `DELETE FROM shop_hours WHERE shop_uuid = ${sqlStr(uuid)}\n  AND ${googleOwned(uuid)};`;
}

function hoursRow(uuid, row) {
  return `  (${sqlStr(uuid)}::uuid, ${row.day}, ${sqlStr(row.opens)}::time, ${sqlStr(row.closes)}::time, ${row.spans})`;
}

function insertHours(uuid, rows) {
  return (
    `INSERT INTO shop_hours (shop_uuid, day_of_week, opens_at, closes_at, spans_midnight)\n` +
    `SELECT * FROM (VALUES\n` +
    `${rows.map((row) => hoursRow(uuid, row)).join(",\n")}\n` +
    `) v WHERE ${shopExists(uuid)}\n  AND ${googleOwned(uuid)};`
  );
}

function metaUpsert(r, hoursReplaced) {
  return (
    `INSERT INTO shop_hours_meta (shop_uuid, source, status, google_place_id, match_distance_m, fetched_at)\n` +
    `SELECT ${sqlStr(r.shop.uuid)}, 'google_places', ${sqlStr(r.status)}, ${
      r.placeId ? sqlStr(r.placeId) : "NULL"
    }, ${r.dist != null ? r.dist : "NULL"}, now()\n` +
    `WHERE ${shopExists(r.shop.uuid)}\n` +
    `ON CONFLICT (shop_uuid) DO UPDATE SET\n` +
    `  status=EXCLUDED.status, google_place_id=EXCLUDED.google_place_id,\n` +
    `  match_distance_m=EXCLUDED.match_distance_m` +
    (hoursReplaced ? `, fetched_at=EXCLUDED.fetched_at` : "") +
    `\nWHERE shop_hours_meta.source='google_places';`
  );
}

function nearest(r) {
  return r.dist != null ? ` (nearest ${r.dist}m -> "${r.matchName}")` : "";
}

function shopBlock(r) {
  const tag = `${r.shop.name} / ${r.shop.neighborhood}`;
  if (r.status !== "ok" && r.status !== "no_hours") {
    const err = r.error ? ` err: ${r.error.slice(0, 120)}` : "";
    return [`-- ${tag}  [${r.status}]${nearest(r)}${err}`, metaUpsert(r, false), ""];
  }
  return [
    `-- ${tag}  (place_id ${r.placeId}, ${r.dist}m -> "${r.matchName}")`,
    deleteHours(r.shop.uuid),
    ...(r.rows.length ? [insertHours(r.shop.uuid, r.rows)] : []),
    metaUpsert(r, true),
    "",
  ];
}

const STALE_GOOGLE_HOURS = `FROM shop_hours h JOIN shop_hours_meta m ON m.shop_uuid=h.shop_uuid
  WHERE m.source='google_places' AND m.fetched_at < now() - interval '30 days'`;

const STALENESS_CHECK = `DO $$
DECLARE stale int;
BEGIN
  SELECT count(DISTINCT h.shop_uuid) INTO stale ${STALE_GOOGLE_HOURS};
  IF stale > 0 THEN
    RAISE WARNING '% shops have Google hours past the 30-day cache limit before this apply', stale;
  END IF;
END $$;`;

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
-- -- compliance: shops still serving google_places hours older than 30 days (should be 0)
-- SELECT count(DISTINCT h.shop_uuid) ${STALE_GOOGLE_HOURS.replace("\n", "\n--")};`;

const RULE = "-- ============================================================================";

function section(title) {
  return [RULE, `-- ${title}`, RULE];
}

function manualReviewLine(r) {
  const err = r.error ? ` ${r.error.slice(0, 120)}` : "";
  return `--   ${r.shop.name} / ${r.shop.neighborhood}: ${r.status}${nearest(r)}${err}`;
}

export function renderSql(results, migration) {
  return [
    "-- Hours-of-operation backfill for pgh.coffee",
    "--",
    "-- Generated for human review. Apply by hand (no migration framework in this repo).",
    "-- Sourced from Google Places API (New). Google-sourced hours are a 30-day-max",
    "-- refreshable cache (Maps Platform terms): nothing refreshes them automatically,",
    "-- so re-crawl and apply at least that often. Only the Place ID is retained indefinitely.",
    "-- Day-of-week: 0=Sunday .. 6=Saturday. Times are local (America/New_York).",
    "--",
    `-- Generated ${new Date().toISOString()}`,
    "",
    ...section("MIGRATION  (creates both tables + RLS; safe to run ahead of the data below)"),
    migration,
    "",
    ...section("STALENESS  (warns if the hours being replaced are past the 30-day limit)"),
    STALENESS_CHECK,
    "",
    ...section("HOURS  (one block per accepted shop; DELETE+INSERT is idempotent & re-runnable)"),
    "",
    ...results.flatMap(shopBlock),
    VERIFICATION,
    "",
    ...section("NEEDS MANUAL REVIEW"),
    ...results
      .filter((r) => ["low_confidence", "not_found", "error"].includes(r.status))
      .map(manualReviewLine),
    "",
  ].join("\n");
}
