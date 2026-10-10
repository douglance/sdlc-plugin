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

test("invalid environment overrides are rejected before a child can run", async () => {
  await fixture(async (root) => {
    const marker = path.join(root, "must-not-run");
    const child = ["-e", "require('node:fs').writeFileSync(process.argv[1], 'ran')", marker];
    for (const env of ["BAD", null, [], 17, { CODEX_HOME: undefined }, { HOME: undefined }]) {
      assert.throws(() => runConsumer(process.execPath, child, { env }), /environment|override/i);
      await assert.rejects(readFile(marker), { code: "ENOENT" });
    }
  });
});

test("explicit startup hooks are rejected before spawning", async () => {
  await fixture(async (root) => {
    const marker = path.join(root, "must-not-run");
    const child = ["-e", "require('node:fs').writeFileSync(process.argv[1], 'ran')", marker];
    for (const env of [{ NODE_OPTIONS: "--trace-warnings" }, { PYTHONPATH: "/fixture" }, { DYLD_INSERT_LIBRARIES: "/fixture" }]) {
      assert.throws(() => runConsumer(process.execPath, child, { env }), /override/i);
      await assert.rejects(readFile(marker), { code: "ENOENT" });
    }
  });
});

test("max-buffer failures retain bulk transcripts with a bounded diagnostic", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "overflow");
    let failure;
    try {
      runConsumer(process.execPath, ["-e", "process.stdout.write('x'.repeat(21 * 1024 * 1024))"], {
        transcriptPrefix: prefix,
      });
    } catch (error) { failure = error; }
    assert(failure, "overflow must fail");
    assert.match(failure.message, /ENOBUFS/);
    assert(Buffer.byteLength(failure.message) < 4096, "failure diagnostics must stay under 4 KiB");
    assert((await readFile(prefix + ".stdout")).length >= 20 * 1024 * 1024);
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.error, "ENOBUFS");
    assert.equal(receipt.status, null);
  });
});

test("Unicode streams and long argv keep failure diagnostics bounded", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "unicode");
    let failure;
    try {
      runConsumer(process.execPath, ["-e", "process.stdout.write('💡'.repeat(2000)+'stdout-end');process.stderr.write('💡'.repeat(2000)+'stderr-end');process.exit(17)", "a".repeat(20000)], {
        transcriptPrefix: prefix,
      });
    } catch (error) { failure = error; }
    assert(failure);
    assert(Buffer.byteLength(failure.message) < 4096);
    assert.match(failure.message, /stdout-end/);
    assert.match(failure.message, /stderr-end/);
    assert.match(failure.message, /bytes omitted/);
    assert.equal(await readFile(prefix + ".stdout", "utf8"), "💡".repeat(2000) + "stdout-end");
    assert.equal(await readFile(prefix + ".stderr", "utf8"), "💡".repeat(2000) + "stderr-end");
    assert.equal(JSON.parse(await readFile(prefix + ".receipt.json", "utf8")).status, 17);
  });
});

test("timeout retains partial output and its actual termination receipt", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "timeout");
    assert.throws(() => runConsumer(process.execPath, ["-e", "process.stdout.write('started');setTimeout(()=>{},5000)"], {
      transcriptPrefix: prefix,
      timeout: 250,
    }), /ETIMEDOUT/);
    assert.equal(await readFile(prefix + ".stdout", "utf8"), "started");
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.error, "ETIMEDOUT");
    assert.equal(receipt.signal, "SIGTERM");
    assert.equal(receipt.status, null);
  });
});
