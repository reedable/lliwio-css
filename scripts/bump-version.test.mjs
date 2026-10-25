import assert from "node:assert/strict";
import test from "node:test";
import { nextVersion } from "./bump-version.mjs";

test("version bumps start a development version", () => {
  assert.equal(nextVersion("0.1.0", "patch"), "0.1.1-dev");
  assert.equal(nextVersion("0.1.0", "minor"), "0.2.0-dev");
  assert.equal(nextVersion("0.1.0", "major"), "1.0.0-dev");
});

test("a development target can be retargeted", () => {
  assert.equal(nextVersion("0.1.1-dev", "patch"), "0.1.2-dev");
  assert.equal(nextVersion("0.1.1-dev", "minor"), "0.2.0-dev");
  assert.equal(nextVersion("0.1.1-dev", "major"), "1.0.0-dev");
});

test("release candidates start at one and increment", () => {
  assert.equal(nextVersion("0.1.1-dev", "rc"), "0.1.1-rc.1");
  assert.equal(nextVersion("0.1.1-rc.1", "rc"), "0.1.1-rc.2");
  assert.equal(nextVersion("0.1.1-rc.9", "rc"), "0.1.1-rc.10");
});

test("release removes either development suffix", () => {
  assert.equal(nextVersion("0.1.1-dev", "release"), "0.1.1");
  assert.equal(nextVersion("0.1.1-rc.2", "release"), "0.1.1");
});

test("rejects invalid lifecycle transitions", () => {
  assert.throws(() => nextVersion("0.1.0", "rc"), /final version/);
  assert.throws(() => nextVersion("0.1.0", "release"), /already a final/);
  assert.throws(() => nextVersion("0.1.1-rc.1", "patch"), /release candidate/);
});

test("rejects unsupported versions and commands", () => {
  assert.throws(
    () => nextVersion("0.1.1+alpha.abc", "patch"),
    /Expected version/,
  );
  assert.throws(() => nextVersion("0.1.1-beta.1", "rc"), /Expected version/);
  assert.throws(() => nextVersion("0.1.1", "beta"), /Expected one of/);
});
