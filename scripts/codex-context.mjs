import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { consumerEnvironment, stopConsumer, validateConsumerSignal } from "./consumer-process.mjs";

export const isolatedCodexFeatures = [
  "apps", "memories", "hooks", "multi_agent", "multi_agent_v2",
  "remote_plugin", "tool_suggest", "auth_elicitation",
];

function inside(file, directory) {
  const relative = path.relative(directory, file);
  return relative !== ".." && !relative.startsWith(".." + path.sep) && !path.isAbsolute(relative);
}

function selectControls(response) {
  const config = response?.config;
  assert(config && typeof config === "object" && !Array.isArray(config),
    "Codex config/read returned malformed response");
  return {
    features: Object.fromEntries(isolatedCodexFeatures
      .filter((name) => config.features?.[name] === null || typeof config.features?.[name] === "boolean")
      .map((name) => [name, config.features[name]])),
    mcpServerNames: Object.keys(config.mcp_servers ?? {}).sort(),
  };
}

function catalog(context) {
  assert.equal(context.skills.data.length, 1, "Codex must return one fixture catalog");
  const entry = context.skills.data[0];
  assert.equal(entry.cwd, context.cwd, "Codex catalog cwd differs from fixture");
  assert.deepEqual(entry.errors, [], "Codex discovery reported errors");
  for (const skill of entry.skills) {
    assert.equal(typeof skill.path, "string", "Codex skill path is missing");
    assert(path.isAbsolute(skill.path), "Codex skill paths must be absolute");
    assert.equal(typeof skill.enabled, "boolean", "Codex skill enabled state is missing");
  }
  return entry.skills;
}

export function codexIsolationArgs(context) {
  const outsiders = catalog(context).filter((skill) =>
    skill.enabled && !inside(skill.path, context.initialize.codexHome));
  const config = "skills.config=[" + outsiders.map((skill) =>
    "{path=" + JSON.stringify(skill.path) + ",enabled=false}").join(",") + "]";
  return [...isolatedCodexFeatures.flatMap((feature) => ["--disable", feature]), "-c", config];
}

export function assertCodexIsolation(context, expectedSkills = 30) {
  const enabled = catalog(context).filter((skill) => skill.enabled);
  assert(enabled.every((skill) => inside(skill.path, context.initialize.codexHome)),
    "Codex still enables skills outside its temporary home");
  assert.equal(enabled.filter((skill) => skill.pluginId === "sdlc@sdlc-marketplace").length,
    expectedSkills, "Codex candidate skill count differs from the installed snapshot");
  for (const feature of isolatedCodexFeatures) {
    assert.equal(context.controls.features[feature], false, "Codex feature remains active: " + feature);
  }
  assert.deepEqual(context.controls.mcpServerNames, [], "Codex still configures MCP servers");
  assert.deepEqual(context.thread.instructionSources, [], "Codex loaded outside instruction sources");
  assert.equal(context.thread.cwd, context.cwd, "Codex thread cwd differs from fixture");
  assert.equal(context.thread.approvalPolicy, "never", "Codex thread may request approval");
  assert.deepEqual(context.thread.sandbox, { type: "readOnly", networkAccess: false },
    "Codex preflight must be read-only without child network access");
  assert.deepEqual(context.requestMethods,
    ["initialize", "initialized", "skills/list", "config/read", "thread/start"]);
  assert.equal(context.server.status, 0, "Codex app-server did not close cleanly");
  return { enabledSkills: enabled.length, candidateSkills: expectedSkills,
    model: context.thread.model, modelProvider: context.thread.modelProvider };
}

export async function probeCodexContext({
  codexHome, cwd, extraArgs = [], transcriptPrefix, timeout = 30_000,
  executable = "codex", serverArgs = ["app-server", "--stdio"], signal,
}) {
  signal = validateConsumerSignal(signal);
  const home = await realpath(codexHome);
  const directory = await realpath(cwd);
  validateConsumerSignal(signal);
  const commandArgs = [...extraArgs, ...serverArgs];
  const controller = new AbortController();
  const child = spawn(executable, commandArgs, {
    cwd: directory, env: consumerEnvironment(process.env, { CODEX_HOME: home }),
    stdio: ["pipe", "pipe", "pipe"], signal: controller.signal, killSignal: "SIGKILL",
    detached: process.platform !== "win32",
  });
  let stdout = "";
  let stdoutBytes = 0;
  let stderr = "";
  let failure;
  let cleanupError;
  const pending = new Map();
  const requestMethods = [];
  const fail = (error) => {
    failure ??= error;
    for (const waiter of pending.values()) waiter.reject(failure);
    pending.clear();
  };
  const terminate = () => {
    try { stopConsumer(child); }
    catch (error) { cleanupError ??= error; fail(error); }
    controller.abort();
  };
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdoutBytes += Buffer.byteLength(chunk);
    if (stdoutBytes > 20 * 1024 * 1024) {
      fail(new Error("Codex context stdout exceeded 20 MiB"));
      terminate();
    }
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
    if (Buffer.byteLength(stderr) > 20 * 1024 * 1024) {
      fail(new Error("Codex context stderr exceeded 20 MiB"));
      terminate();
    }
  });
  child.once("exit", () => {
    try { stopConsumer(child); }
    catch (error) { cleanupError ??= error; fail(error); }
  });
  child.on("error", fail);
  child.stdin.on("error", fail);
  const lines = readline.createInterface({ input: child.stdout });
  lines.on("line", (line) => {
    const awaitingConfig = pending.has(3);
    try {
      const message = JSON.parse(line);
      let recorded = message;
      if (message.id === 3) {
        recorded = message.error
          ? { id: 3, error: { code: Number.isFinite(message.error.code) ? message.error.code : null }, configRedacted: true }
          : { id: 3, result: { controls: selectControls(message.result), configRedacted: true } };
      } else if (awaitingConfig) {
        recorded = { id: message.id ?? null, configRedacted: true };
      }
      stdout += JSON.stringify(recorded) + "\n";
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) {
        const diagnostic = message.id === 3
          ? "Codex protocol error: config/read failed (code " + recorded.error.code + ")"
          : "Codex protocol error: " + JSON.stringify(message.error).slice(0, 1200);
        waiter.reject(new Error(diagnostic));
      } else waiter.resolve(message.result);
    } catch (error) {
      if (awaitingConfig) {
        stdout += JSON.stringify({ id: 3, configRedacted: true, error: "malformed response" }) + "\n";
        fail(new Error("Codex config/read returned malformed response (JSON)"));
      } else {
        stdout += line + "\n";
        fail(error);
      }
      child.stdin.end();
    }
  });
  const closed = new Promise((resolve) => child.once("close", (status, signal) => {
    fail(new Error("Codex app-server closed before its pending response"));
    resolve({ status, signal });
  }));
  const onCancel = () => {
    fail(Object.assign(new Error("Codex context canceled"), { code: "ECANCELED" }));
    terminate();
  };
  signal?.addEventListener("abort", onCancel, { once: true });
  const timer = setTimeout(() => {
    fail(new Error("Codex context timed out"));
    terminate();
  }, timeout);
  const send = (id, method, params) => {
    if (failure) return Promise.reject(failure);
    requestMethods.push(method);
    if (id === undefined) {
      child.stdin.write(JSON.stringify({ method, ...(params ? { params } : {}) }) + "\n");
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      child.stdin.write(JSON.stringify({ id, method, params }) + "\n");
    });
  };
  let result;
  let operationError;
  try {
    const initialize = await send(1, "initialize", {
      clientInfo: { name: "sdlc-consumer", version: "1" },
      capabilities: { explicitGatewayOauth: true },
    });
    assert.equal(initialize.codexHome, home, "Codex selected a different home");
    await send(undefined, "initialized");
    const skills = await send(2, "skills/list", { cwds: [directory], forceReload: true });
    const config = await send(3, "config/read", { cwd: directory, includeLayers: false });
    const thread = await send(4, "thread/start", {
      cwd: directory, ephemeral: true, approvalPolicy: "never", sandbox: "read-only",
    });
    result = {
      cwd: directory, initialize, skills, requestMethods,
      controls: selectControls(config),
      thread: Object.fromEntries(["instructionSources", "cwd", "approvalPolicy", "model", "modelProvider", "sandbox"]
        .map((key) => [key, thread[key]])),
    };
  } catch (error) { operationError = error; }
  finally {
    child.stdin.end();
    const server = await closed;
    clearTimeout(timer);
    signal?.removeEventListener("abort", onCancel);
    lines.close();
    if (transcriptPrefix) {
      await mkdir(path.dirname(transcriptPrefix), { recursive: true });
      await writeFile(transcriptPrefix + ".stdout", stdout);
      await writeFile(transcriptPrefix + ".stderr", stderr);
      await writeFile(transcriptPrefix + ".receipt.json", JSON.stringify({
        command: executable, args: commandArgs, cwd: directory,
        ...server, error: operationError?.message ?? null, requestMethods,
        cleanupError: cleanupError?.code ?? null,
      }, null, 2) + "\n");
    }
    if (result) result.server = server;
    if (server.status !== 0 && !operationError) {
      operationError = new Error("Codex app-server failed (" + server.status + ", " + server.signal + "): " + stderr.slice(-1200));
    }
  }
  if (operationError) throw operationError;
  return result;
}
