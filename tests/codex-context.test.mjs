import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, realpath, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { assertCodexIsolation, codexIsolationArgs, probeCodexContext } from "../scripts/codex-context.mjs";

function context() {
  return {
    cwd: "/project",
    initialize: { codexHome: "/private/home" },
    skills: { data: [{ cwd: "/project", errors: [], skills: [
      { path: "/private/home/plugins/first/SKILL.md", enabled: true, pluginId: "sdlc@sdlc-marketplace" },
      { path: "/private/home/skills/.system/SKILL.md", enabled: true },
    ] }] },
    controls: { features: { apps: false, memories: false, hooks: false, multi_agent: false,
      multi_agent_v2: false, remote_plugin: false, tool_suggest: false, auth_elicitation: false },
      mcpServerNames: [] },
    thread: { cwd: "/project", instructionSources: [], approvalPolicy: "never",
      sandbox: { type: "readOnly", networkAccess: false }, model: "fixture", modelProvider: "fixture" },
    requestMethods: ["initialize", "initialized", "skills/list", "config/read", "thread/start"],
    server: { status: 0, signal: null },
  };
}

test("isolation arguments disable exact outside file paths and preserve inside skills", () => {
  const value = context();
  value.skills.data[0].skills.push({ path: "/private/home-other/SKILL.md", enabled: true });
  assert.deepEqual(codexIsolationArgs(value), [
    "--disable", "apps", "--disable", "memories", "--disable", "hooks",
    "--disable", "multi_agent", "--disable", "multi_agent_v2", "--disable", "remote_plugin",
    "--disable", "tool_suggest", "--disable", "auth_elicitation",
    "-c", 'skills.config=[{path="/private/home-other/SKILL.md",enabled=false}]',
  ]);
});

test("isolation rejects enabled outsiders before generation", () => {
  const value = context();
  value.skills.data[0].skills.push({ path: "/private/home-other/SKILL.md", enabled: true });
  assert.throws(() => assertCodexIsolation(value, 1), /outside/);
});

test("isolation rejects active runtime controls and configured MCP servers", () => {
  for (const feature of ["apps", "memories", "hooks", "multi_agent", "multi_agent_v2", "remote_plugin", "tool_suggest", "auth_elicitation"]) {
    const value = context();
    value.controls.features[feature] = true;
    assert.throws(() => assertCodexIsolation(value, 1), /feature remains active/);
  }
  const value = context();
  value.controls.mcpServerNames = ["outside"];
  assert.throws(() => assertCodexIsolation(value, 1), /MCP/);
});

test("isolation rejects instruction inheritance, missing skills, and a writable thread", () => {
  const inherited = context();
  inherited.thread.instructionSources = ["/outside/AGENTS.md"];
  assert.throws(() => assertCodexIsolation(inherited, 1), /instruction sources/);
  const missing = context();
  missing.skills.data[0].skills[0].enabled = false;
  assert.throws(() => assertCodexIsolation(missing, 1), /candidate skill count/);
  const writable = context();
  writable.thread.sandbox = { type: "workspaceWrite", networkAccess: false };
  assert.throws(() => assertCodexIsolation(writable, 1), /read-only/);
});

test("isolation accepts a clean catalog with literal expected count", () => {
  assert.deepEqual(assertCodexIsolation(context(), 1), {
    enabledSkills: 2, candidateSkills: 1, model: "fixture", modelProvider: "fixture",
  });
});

async function runFixture(mode, check) {
  const root = await mkdtemp(path.join(os.tmpdir(), "codex-context-"));
  try {
    const home = path.join(root, "home");
    const cwd = path.join(root, "project");
    await mkdir(home);
    await mkdir(cwd);
    const prefix = path.join(root, "wire");
    await check({ codexHome: home, cwd, transcriptPrefix: prefix, timeout: 1000,
      executable: process.execPath,
      serverArgs: [path.join(import.meta.dirname, "fixtures/codex-context-server.mjs"),
        await realpath(home), await realpath(cwd), mode] }, prefix);
  } finally { await rm(root, { recursive: true, force: true }); }
}

test("native preflight requests are ordered, captured, and contain no model turn", async () => {
  await runFixture("clean", async (options, prefix) => {
    const actual = await probeCodexContext(options);
    assert.deepEqual(assertCodexIsolation(actual, 2), {
      enabledSkills: 3, candidateSkills: 2, model: "fixture", modelProvider: "fixture",
    });
    assert(!JSON.stringify(actual).includes("must-not-appear"));
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.status, 0);
    assert.equal(receipt.error, null);
    assert.deepEqual(receipt.requestMethods, ["initialize", "initialized", "skills/list", "config/read", "thread/start"]);
    assert((await readFile(prefix + ".stdout", "utf8")).includes('"id":4'));
    assert(!(await readFile(prefix + ".stdout", "utf8")).includes("must-not-appear"), "saved config responses must exclude credential fields");
  });
});

test("malformed protocol and early process exit preserve failure receipts", async () => {
  for (const mode of ["malformed", "early"]) {
    await runFixture(mode, async (options, prefix) => {
      await assert.rejects(probeCodexContext(options), mode === "malformed" ? /JSON/ : /closed/);
      const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
      assert(receipt.error);
      if (mode === "early") {
        assert.equal(receipt.status, 7);
        assert.equal(await readFile(prefix + ".stderr", "utf8"), "fixture early exit");
      } else {
        assert.equal(await readFile(prefix + ".stdout", "utf8"), "not-json\n");
      }
    });
  }
});

test("native preflight timeout retains diagnostics and actual termination", async () => {
  await runFixture("delay", async (options, prefix) => {
    await assert.rejects(probeCodexContext(options), /timed out/);
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.status, null);
    assert.equal(receipt.signal, "SIGTERM");
    assert.equal(await readFile(prefix + ".stderr", "utf8"), "fixture waiting");
  });
});

test("preflight passes global overrides before the program", async () => {
  await runFixture("clean", async (options) => {
    const actual = await probeCodexContext({ ...options, extraArgs: ["--no-warnings"] });
    assert.deepEqual(actual.initialize.launchExecArgv, ["--no-warnings"]);
  });
});

test("configuration errors exclude credential text from diagnostics and saved captures", async () => {
  await runFixture("config-error", async (options, prefix) => {
    await assert.rejects(probeCodexContext(options), (error) => {
      assert(!error.message.includes("must-not-appear"));
      return error.message.includes("config/read failed");
    });
    for (const suffix of [".stdout", ".stderr", ".receipt.json"]) {
      assert(!(await readFile(prefix + suffix, "utf8")).includes("must-not-appear"));
    }
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.status, 0);
    assert(!receipt.requestMethods.includes("thread/start"));
  });
});

test("malformed configuration replies exclude raw payloads from diagnostics and saved captures", async () => {
  await runFixture("config-malformed", async (options, prefix) => {
    await assert.rejects(probeCodexContext(options), (error) => {
      assert(!error.message.includes("must-not-appear"));
      return error.message.includes("config/read returned malformed response");
    });
    for (const suffix of [".stdout", ".stderr", ".receipt.json"]) {
      assert(!(await readFile(prefix + suffix, "utf8")).includes("must-not-appear"));
    }
    const receipt = JSON.parse(await readFile(prefix + ".receipt.json", "utf8"));
    assert.equal(receipt.status, 0);
    assert(!receipt.requestMethods.includes("thread/start"));
  });
});
