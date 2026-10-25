import assert from "node:assert/strict";
import test from "node:test";
import { releaseTagName, validateCleanStatus } from "./release-tag.mjs";

test("creates final and release-candidate tag names", () => {
  assert.equal(releaseTagName("0.1.0"), "v0.1.0");
  assert.equal(releaseTagName("0.1.0-rc.1"), "v0.1.0-rc.1");
  assert.equal(releaseTagName("0.1.0-rc.12"), "v0.1.0-rc.12");
});

test("rejects development and unsupported release versions", () => {
  assert.throws(
    () => releaseTagName("0.1.0-dev"),
    /Development version 0\.1\.0-dev cannot be tagged.*version:rc.*version:release/,
  );
  assert.throws(() => releaseTagName("0.1.0-rc.0"), /final or a numbered/);
  assert.throws(() => releaseTagName("0.1.0+alpha.abc"), /final or a numbered/);
  assert.throws(() => releaseTagName("0.1.0-beta.1"), /final or a numbered/);
});

test("requires a clean working tree", () => {
  assert.doesNotThrow(() => validateCleanStatus(""));
  assert.throws(
    () => validateCleanStatus(" M package.json\n"),
    /must be clean/,
  );
  assert.throws(() => validateCleanStatus("?? local.txt\n"), /must be clean/);
});
