import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const die = (msg) => {
  console.error(`\n  preflight: ${msg}\n`);
  process.exit(1);
};

const major = (v) => Number(v.trim().replace(/^v/, "").split(".")[0]);

const required = major(
  readFileSync(new URL("../.nvmrc", import.meta.url), "utf8")
);
if (major(process.version) < required) {
  die(`node ${required}+ required (.nvmrc), running ${process.version}. Run: nvm use`);
}

// Matched by path so a sibling project's dev server doesn't block this build.
if (process.argv[2] === "build") {
  const pids = execSync(
    `pgrep -f "${process.cwd()}/node_modules/.bin/next dev" || true`
  )
    .toString()
    .trim();
  if (pids) {
    die(`next dev is running (pid ${pids.split("\n").join(", ")}); the build would poison its .next. Stop it first.`);
  }
}
