import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { recordFixtureEvidence } from "../scripts/consumer-evidence.mjs";

async function fixture(t, implementation) {
  const root = await mkdtemp(path.join(os.tmpdir(), "consumer-evidence-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  if (implementation !== undefined) {
    await writeFile(path.join(root, "sum.mjs"), implementation);
    await writeFile(path.join(root, "sum.test.mjs"),
      'import assert from "node:assert/strict"; import test from "node:test"; import { sum } from "./sum.mjs";\n' +
      'test("adds two numbers", () => assert.equal(sum(19, 23), 42));\n');
    assert.equal(await readFile(path.join(root, "sum.mjs"), "utf8"), implementation);
  }
  return root;
}

test("consumer evidence records a real passing fixture", async (t) => {
  const root = await fixture(t, "export const sum = (a, b) => a + b;\n");
  const receipt = await recordFixtureEvidence(root);
  assert.equal(receipt.passed, 1);
  const evidence = await readFile(path.join(root, "EVIDENCE.md"), "utf8");
  assert.match(evidence, /node --test --test-reporter=tap/);
  assert.match(evidence, /# pass 1/);
  assert.match(evidence, /# fail 0/);
});

test("broken implementation produces no successful evidence", async (t) => {
  const root = await fixture(t, "export const sum = (a, b) => a - b;\n");
  await assert.rejects(recordFixtureEvidence(root), /Command failed/);
  await assert.rejects(access(path.join(root, "EVIDENCE.md")), { code: "ENOENT" });
});


test("consumer fixture supplies bounded scope and actual acceptance evidence", async (t) => {
  const root = await fixture(t);
  const { prepareConsumerFixture } = await import("../scripts/consumer-evidence.mjs");
  const receipt = await prepareConsumerFixture(root);
  assert.equal(receipt.passed, 4);
  const task = await readFile(path.join(root, "TASK.md"), "utf8");
  assert.match(task, /sum\(19, 23\) = 42/);
  assert.match(task, /sum\(-3, 5\) = 2/);
  assert.match(task, /sum\(1\.25, 2\.75\) = 4/);
  assert.match(task, /sum\(0, 0\) = 0/);
  assert.match(task, /No deployment/);
  const evidence = await readFile(path.join(root, "EVIDENCE.md"), "utf8");
  assert.match(evidence, /# pass 4/);
  assert.match(evidence, /# fail 0/);
});

test("an empty test suite produces no successful evidence", async (t) => {
  const root = await fixture(t);
  await assert.rejects(recordFixtureEvidence(root), /no passing tests/);
  await assert.rejects(access(path.join(root, "EVIDENCE.md")), { code: "ENOENT" });
});
