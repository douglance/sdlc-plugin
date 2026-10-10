import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { runConsumer } from "../scripts/consumer-process.mjs";

async function fixture(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), "consumer-process-proof-"));
  try { await fn(root); }
  finally { await rm(root, { recursive: true, force: true }); }
}

test("ambient context variables do not reach the consumer", () => {
  const output = runConsumer(process.execPath, ["-e", "console.log(JSON.stringify({injected:process.env.AUDIT_INJECTED ?? null,home:process.env.HOME,config:process.env.CODEX_HOME}))"], {
    baseEnv: { ...process.env, AUDIT_INJECTED: "fixture-only-secret" },
    env: { CODEX_HOME: "/fixture/config" },
  });
  const actual = JSON.parse(output);
  assert.equal(actual.injected, null);
  assert.equal(actual.home, process.env.HOME);
  assert.equal(actual.config, "/fixture/config");
});

test("ambient NODE_OPTIONS cannot alter the child startup", () => {
  const output = runConsumer(process.execPath, ["-e", "console.log(JSON.stringify({started:true}))"], {
    baseEnv: { ...process.env, NODE_OPTIONS: "--fixture-invalid-option" },
  });
  assert.deepEqual(JSON.parse(output), { started: true });
});

test("success retains exact stdout and stderr without relying on the final message", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "events");
    const output = runConsumer(process.execPath, ["-e", 'process.stdout.write("{\\\"type\\\":\\\"tool_event\\\"}\\n");process.stderr.write("fixture diagnostic\\n");'], {
      transcriptPrefix: prefix,
    });
    assert.equal(output, '{"type":"tool_event"}\n');
    assert.equal(await readFile(prefix + ".stdout", "utf8"), '{"type":"tool_event"}\n');
    assert.equal(await readFile(prefix + ".stderr", "utf8"), "fixture diagnostic\n");
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.status, 0);
    assert.equal(receipt.signal, null);
    assert.equal(receipt.error, null);
    assert(!("env" in receipt), "environment values must not be recorded");
  });
});

test("failed process retains both streams and its real status before throwing", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "failed");
    assert.throws(() => runConsumer(process.execPath, ["-e", 'process.stdout.write("before failure\\n");process.stderr.write("fixture failure\\n");process.exit(13);'], {
      transcriptPrefix: prefix,
    }), /failed/);
    assert.equal(await readFile(prefix + ".stdout", "utf8"), "before failure\n");
    assert.equal(await readFile(prefix + ".stderr", "utf8"), "fixture failure\n");
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.status, 13);
  });
});

test("spawn failure retains an error receipt rather than success", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "missing");
    assert.throws(() => runConsumer(path.join(root, "absent-executable"), [], {
      transcriptPrefix: prefix,
    }), /failed/);
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.status, null);
    assert.equal(receipt.error, "ENOENT");
  });
});
