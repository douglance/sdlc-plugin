import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import { createConnection } from "node:net";
import path from "node:path";
import test from "node:test";
import { runConsumer } from "../scripts/consumer-process.mjs";

async function fixture(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), "consumer-process-proof-"));
  try { await fn(root); }
  finally { await rm(root, { recursive: true, force: true }); }
}

test("ambient context variables do not reach the consumer", async () => {
  const output = await runConsumer(process.execPath, ["-e", "console.log(JSON.stringify({injected:process.env.AUDIT_INJECTED ?? null,home:process.env.HOME,config:process.env.CODEX_HOME}))"], {
    baseEnv: { ...process.env, AUDIT_INJECTED: "fixture-only-secret" },
    env: { CODEX_HOME: "/fixture/config" },
  });
  const actual = JSON.parse(output);
  assert.equal(actual.injected, null);
  assert.equal(actual.home, process.env.HOME);
  assert.equal(actual.config, "/fixture/config");
});

test("ambient NODE_OPTIONS cannot alter the child startup", async () => {
  const output = await runConsumer(process.execPath, ["-e", "console.log(JSON.stringify({started:true}))"], {
    baseEnv: { ...process.env, NODE_OPTIONS: "--fixture-invalid-option" },
  });
  assert.deepEqual(JSON.parse(output), { started: true });
});

test("success retains exact stdout and stderr without relying on the final message", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "events");
    const output = await runConsumer(process.execPath, ["-e", 'process.stdout.write("{\\\"type\\\":\\\"tool_event\\\"}\\n");process.stderr.write("fixture diagnostic\\n");'], {
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
    await assert.rejects(async () => await runConsumer(process.execPath, ["-e", 'process.stdout.write("before failure\\n");process.stderr.write("fixture failure\\n");process.exit(13);'], {
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
    await assert.rejects(async () => await runConsumer(path.join(root, "absent-executable"), [], {
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
      await assert.rejects(async () => await runConsumer(process.execPath, child, { env }), /environment|override/i);
      await assert.rejects(readFile(marker), { code: "ENOENT" });
    }
  });
});

test("explicit startup hooks are rejected before spawning", async () => {
  await fixture(async (root) => {
    const marker = path.join(root, "must-not-run");
    const child = ["-e", "require('node:fs').writeFileSync(process.argv[1], 'ran')", marker];
    for (const env of [{ NODE_OPTIONS: "--trace-warnings" }, { PYTHONPATH: "/fixture" }, { DYLD_INSERT_LIBRARIES: "/fixture" }]) {
      await assert.rejects(async () => await runConsumer(process.execPath, child, { env }), /override/i);
      await assert.rejects(readFile(marker), { code: "ENOENT" });
    }
  });
});

test("max-buffer failures retain bulk transcripts with a bounded diagnostic", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "overflow");
    let failure;
    try {
      await runConsumer(process.execPath, ["-e", "process.stdout.write('x'.repeat(21 * 1024 * 1024))"], {
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
      await runConsumer(process.execPath, ["-e", "process.stdout.write('💡'.repeat(2000)+'stdout-end');process.stderr.write('💡'.repeat(2000)+'stderr-end');process.exit(17)", "a".repeat(20000)], {
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
    await assert.rejects(async () => await runConsumer(process.execPath, ["-e", "process.stdout.write('started');setTimeout(()=>{},5000)"], {
      transcriptPrefix: prefix,
      timeout: 250,
    }), /ETIMEDOUT/);
    assert.equal(await readFile(prefix + ".stdout", "utf8"), "started");
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.error, "ETIMEDOUT");
    assert.equal(receipt.signal, "SIGKILL");
    assert.equal(receipt.status, null);
  });
});

test("timeout terminates a child that ignores SIGTERM", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "ignores-term");
    const started = performance.now();
    await assert.rejects(async () => await runConsumer(process.execPath, ["-e",
      "process.on('SIGTERM',()=>{});process.stdout.write('ready');setTimeout(()=>process.exit(0),2000)"
    ], { transcriptPrefix: prefix, timeout: 250 }), /ETIMEDOUT/);
    const elapsedMs = performance.now() - started;
    assert.equal(await readFile(prefix + ".stdout", "utf8"), "ready");
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.error, "ETIMEDOUT");
    assert.equal(receipt.signal, "SIGKILL");
    assert.equal(receipt.status, null);
    assert(elapsedMs < 1500, "timeout must return before the fixture's natural exit");
  });
});

test("timeout closes a descendant listener before returning", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "descendant-timeout");
    await assert.rejects(async () => await runConsumer(process.execPath, ["-e", "const {spawn}=require('node:child_process');spawn(process.execPath,['-e',\"const net=require('node:net');const server=net.createServer(socket=>socket.end());server.listen(0,'127.0.0.1',()=>process.stdout.write('listener='+server.address().port+'\\\\n'));setTimeout(()=>server.close(()=>process.exit(0)),2000)\"],{stdio:['ignore','inherit','inherit']});setInterval(()=>{},1000);"], {
      transcriptPrefix: prefix, timeout: 500,
    }), /ETIMEDOUT/);
    const output = await readFile(prefix + ".stdout", "utf8");
    const port = Number(output.match(/^listener=(\d+)$/m)?.[1]);
    assert(port > 0, "the descendant must start its independent listener");
    const listening = await new Promise((resolve, reject) => {
      const socket = createConnection({ host: "127.0.0.1", port });
      socket.setTimeout(500, async () => { socket.destroy(); reject(new Error("listener probe timed out")); });
      socket.once("connect", async () => { socket.destroy(); resolve(true); });
      socket.once("error", (error) => {
        socket.destroy();
        if (error.code === "ECONNREFUSED") resolve(false);
        else reject(error);
      });
    });
    if (listening) await new Promise((resolve) => setTimeout(resolve, 2200));
    assert.equal(listening, false, "a timed-out consumer must leave no descendant listener");
  });
});

for (const mode of ["success", "overflow"]) {
  test(mode + " closes a descendant listener before returning", async () => {
    await fixture(async (root) => {
      const prefix = path.join(root, "descendant-" + mode);
      const grandchild = "const net=require('node:net');const server=net.createServer(socket=>socket.end());server.listen(0,'127.0.0.1',()=>process.send({port:server.address().port}));setTimeout(()=>server.close(()=>process.exit(0)),2000)";
      const command = "const {spawn}=require('node:child_process');const child=spawn(process.execPath,['-e',"
        + JSON.stringify(grandchild)
        + "],{stdio:['ignore','inherit','inherit','ipc']});child.on('message',({port})=>{process.stdout.write('listener='+port+'\\n',()=>{"
        + (mode === "success" ? "process.exit(0)" : "process.stdout.write('x'.repeat(21*1024*1024))")
        + "})});";
      let error;
      let output;
      try { output = await runConsumer(process.execPath, ["-e", command], {
        transcriptPrefix: prefix, timeout: 500,
      }); } catch (failure) { error = failure; }
      const transcript = await readFile(prefix + ".stdout", "utf8");
      const port = Number(transcript.match(/^listener=(\d+)$/m)?.[1]);
      assert(port > 0, "the descendant must start its independent listener");
      const listening = await new Promise((resolve, reject) => {
        const socket = createConnection({ host: "127.0.0.1", port });
        socket.setTimeout(500, async () => { socket.destroy(); reject(new Error("listener probe timed out")); });
        socket.once("connect", async () => { socket.destroy(); resolve(true); });
        socket.once("error", (failure) => {
          socket.destroy();
          if (failure.code === "ECONNREFUSED") resolve(false);
          else reject(failure);
        });
      });
      if (listening) await new Promise((resolve) => setTimeout(resolve, 2200));
      assert.equal(listening, false, "a completed consumer must leave no descendant listener");
      if (mode === "success") {
        assert.equal(error, undefined);
        assert.equal(output, "listener=" + port + "\n");
      } else {
        assert.match(error?.message ?? "", /ENOBUFS/);
      }
    });
  });
}

test("invalid timeout values are rejected before launch", async () => {
  await fixture(async (root) => {
    const marker = path.join(root, "invalid-timeout-must-not-run");
    const prefix = path.join(root, "invalid-timeout");
    for (const timeout of ["invalid", true, -1, NaN, Infinity, 1.5, 2147483648]) {
      await assert.rejects(() => runConsumer(process.execPath,
        ["-e", "require('node:fs').writeFileSync(process.argv[1], 'ran')", marker],
        { timeout, transcriptPrefix: prefix }), (error) => error instanceof TypeError || error instanceof RangeError);
      await assert.rejects(readFile(marker), { code: "ENOENT" });
      await assert.rejects(readFile(prefix + ".receipt.json"), { code: "ENOENT" });
    }
  });
});

test("zero timeout preserves explicitly unbounded execution", async () => {
  const output = await runConsumer(process.execPath,
    ["-e", "setTimeout(()=>process.stdout.write('zero-timeout'),30)"], { timeout: 0 });
  assert.equal(output, "zero-timeout");
});

test("cancellation terminates an active consumer and retains its receipt", async () => {
  await fixture(async (root) => {
    const prefix = path.join(root, "canceled");
    const controller = new AbortController();
    const started = performance.now();
    const timer = setTimeout(() => controller.abort("must-not-appear"), 250);
    try {
      await assert.rejects(runConsumer(process.execPath,
        ["-e", "process.on('SIGTERM',()=>{});process.stdout.write('ready');setTimeout(()=>process.exit(0),2000)"],
        { signal: controller.signal, timeout: 3000, transcriptPrefix: prefix }), /ECANCELED/);
    } finally { clearTimeout(timer); }
    assert(performance.now() - started < 1500);
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.error, "ECANCELED");
    assert.equal(receipt.signal, "SIGKILL");
    assert.equal(receipt.status, null);
    for (const suffix of [".stdout", ".stderr", ".receipt.json"]) {
      assert(!(await readFile(prefix + suffix, "utf8")).includes("must-not-appear"));
    }
  });
});

test("canceled and invalid signals reject before child launch", async () => {
  await fixture(async (root) => {
    const marker = path.join(root, "canceled-must-not-run");
    const prefix = path.join(root, "before-cancel");
    for (const signal of [AbortSignal.abort("must-not-appear"), "invalid"]) {
      await assert.rejects(runConsumer(process.execPath,
        ["-e", "require('node:fs').writeFileSync(process.argv[1], 'ran')", marker],
        { signal, transcriptPrefix: prefix }),
        (error) => signal === "invalid" ? error instanceof TypeError : error.code === "ECANCELED");
      await assert.rejects(readFile(marker), { code: "ENOENT" });
      await assert.rejects(readFile(prefix + ".receipt.json"), { code: "ENOENT" });
    }
  });
});
