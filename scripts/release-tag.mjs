// Validates a committed release version and creates its local annotated tag.
// It never commits or pushes.

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RELEASE_DOC = "README.md#tagging-a-release";

export function releaseTagName(version) {
  if (/^\d+\.\d+\.\d+-dev$/.test(version)) {
    throw new Error(
      `Development version ${version} cannot be tagged as a release. Prepare an RC with npm run version:rc or a final release with npm run version:release. See ${RELEASE_DOC}.`,
    );
  }
  if (!/^\d+\.\d+\.\d+(?:-rc\.[1-9]\d*)?$/.test(version)) {
    throw new Error(
      `Release version must be final or a numbered release candidate; got ${JSON.stringify(version)}. See ${RELEASE_DOC}.`,
    );
  }
  return `v${version}`;
}

export function validateCleanStatus(status) {
  if (status !== "") {
    throw new Error(
      `Working tree must be clean before tagging a release. See ${RELEASE_DOC}.`,
    );
  }
}

function main() {
  const status = execFileSync("git", ["status", "--porcelain=v1"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  validateCleanStatus(status);

  const version = JSON.parse(
    readFileSync(resolve(ROOT, "package.json"), "utf8"),
  ).version;
  const tag = releaseTagName(version);
  const existing = spawnSync(
    "git",
    ["rev-parse", "--verify", "--quiet", `refs/tags/${tag}`],
    { cwd: ROOT, stdio: "ignore" },
  );
  if (existing.error) throw existing.error;
  if (existing.status === 0) {
    throw new Error(`Tag ${tag} already exists. See ${RELEASE_DOC}.`);
  }
  if (existing.status !== 1) {
    throw new Error(`Could not determine whether tag ${tag} already exists.`);
  }

  execFileSync("git", ["tag", "-a", tag, "-m", `lliwio-css ${tag}`], {
    cwd: ROOT,
    stdio: "inherit",
  });
  const branch = execFileSync("git", ["branch", "--show-current"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  console.log(`Created local release tag ${tag}.`);
  console.log(
    `Push it with: git push github ${branch || "<branch>"} --follow-tags`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
