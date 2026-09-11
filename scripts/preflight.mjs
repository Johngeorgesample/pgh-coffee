import { spawnSync } from "node:child_process";
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
// pgrep takes a regex, so the path has to be escaped; it is passed as an argv
// entry rather than a shell string, which also keeps pgrep from matching the
// lookup itself. A missing pgrep leaves a non-zero status and the build runs.
if (process.argv[2] === "build") {
  const pattern =
    `${process.cwd()}/node_modules/.bin/next dev`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const { status, stdout } = spawnSync("pgrep", ["-f", pattern], { encoding: "utf8" });
  if (status === 0) {
    const pids = stdout.trim().split("\n").join(", ");
    die(`next dev is running (pid ${pids}); the build would poison its .next. Stop it first.`);
  }
}
