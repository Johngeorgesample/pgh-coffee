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

function googleOwned(uuid) {
  return (
    `NOT EXISTS (SELECT 1 FROM shop_hours_meta m\n` +
    `    WHERE m.shop_uuid = ${sqlStr(uuid)} AND m.source <> 'google_places')`
  );
}

export function deleteGuard(uuid) {
  return `DELETE FROM shop_hours WHERE shop_uuid = ${sqlStr(uuid)}\n  AND ${googleOwned(uuid)};`;
}

export function insertHours(uuid, rows) {
  const vals = rows
    .map((row) => `  (${sqlStr(uuid)}::uuid, ${row.day}, ${sqlStr(row.opens)}::time, ${sqlStr(row.closes)}::time, ${row.spans})`)
    .join(",\n");
  return (
    `INSERT INTO shop_hours (shop_uuid, day_of_week, opens_at, closes_at, spans_midnight)\n` +
    `SELECT * FROM (VALUES\n${vals}\n) v WHERE ${googleOwned(uuid)};`
  );
}

export function metaUpsert(uuid, status, placeId, dist, hoursReplaced) {
  return (
    `INSERT INTO shop_hours_meta (shop_uuid, source, status, google_place_id, match_distance_m, fetched_at)\n` +
    `VALUES (${sqlStr(uuid)}, 'google_places', ${sqlStr(status)}, ${
      placeId ? sqlStr(placeId) : "NULL"
    }, ${dist != null ? dist : "NULL"}, now())\n` +
    `ON CONFLICT (shop_uuid) DO UPDATE SET\n` +
    `  status=EXCLUDED.status, google_place_id=EXCLUDED.google_place_id,\n` +
    `  match_distance_m=EXCLUDED.match_distance_m` +
    (hoursReplaced ? `, fetched_at=EXCLUDED.fetched_at` : "") +
    `\nWHERE shop_hours_meta.source='google_places';`
  );
}
