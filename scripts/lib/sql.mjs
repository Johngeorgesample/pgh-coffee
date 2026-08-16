export function stripLeadingSqlComment(sql) {
  const lines = sql.split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].trim() === "" || lines[i].trim().startsWith("--"))) i++;
  const ddl = lines.slice(i).join("\n").trim();
  if (!ddl) throw new Error("No DDL found after stripping the leading comment header");
  return ddl;
}
