// Advances lliwio-css through its development and release lifecycle.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_JSON = resolve(ROOT, "package.json");
const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)(?:-(dev|rc\.(\d+)))?$/;
const COMMANDS = ["patch", "minor", "major", "rc", "release"];

export function nextVersion(current, command) {
  const match = VERSION_PATTERN.exec(current);
  if (!match) {
    throw new Error(
      `Expected version major.minor.patch, major.minor.patch-dev, or major.minor.patch-rc.N; got ${JSON.stringify(current)}`,
    );
  }
  if (!COMMANDS.includes(command)) {
    throw new Error(
      `Expected one of ${COMMANDS.join(", ")}; got ${command === undefined ? "nothing" : JSON.stringify(command)}`,
    );
  }

  let [, major, minor, patch, stage, rcNumber] = match;
  let parts = [major, minor, patch].map(Number);

  if (["major", "minor", "patch"].includes(command)) {
    if (stage?.startsWith("rc.")) {
      throw new Error(`Cannot ${command}-bump release candidate ${current}`);
    }
    if (command === "major") parts = [parts[0] + 1, 0, 0];
    else if (command === "minor") parts = [parts[0], parts[1] + 1, 0];
    else parts[2] += 1;
    return `${parts.join(".")}-dev`;
  }

  const base = parts.join(".");
  if (command === "rc") {
    if (stage === "dev") return `${base}-rc.1`;
    if (stage?.startsWith("rc.")) {
      return `${base}-rc.${Number(rcNumber) + 1}`;
    }
    throw new Error(
      `Cannot create a release candidate from final version ${current}`,
    );
  }

  if (stage === "dev" || stage?.startsWith("rc.")) return base;
  throw new Error(`Version ${current} is already a final release`);
}

function main() {
  const command = process.argv[2];
  const packageText = readFileSync(PACKAGE_JSON, "utf8");
  const packageJson = JSON.parse(packageText);
  const current = packageJson.version;
  const next = nextVersion(current, command);

  packageJson.version = next;
  writeFileSync(PACKAGE_JSON, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(`lliwio-css version: ${current} -> ${next} (${command})`);
  console.log("Updated package.json. Review and commit the change.");
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
