// Pulled out of crawl-hours.mjs so it's testable without pulling in that
// script's env/network side effects.
export function stripLeadingSqlComment(sql) {
  const lines = sql.split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].trim() === "" || lines[i].trim().startsWith("--"))) i++;
  const ddl = lines.slice(i).join("\n").trim();
  // A schema file that's all comments (or empty) means something's wrong with
  // it — better to fail loudly here than silently embed no DDL at all.
  if (!ddl) throw new Error("No DDL found after stripping the leading comment header");
  return ddl;
}
