import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const hostVariables = [
  "PATH", "HOME", "USER", "LOGNAME", "LANG", "LC_ALL", "LC_CTYPE",
  "TMPDIR", "TERM", "COLORTERM", "SSL_CERT_FILE", "SSL_CERT_DIR",
];

const overrideVariables = new Set([
  ...hostVariables, "CLAUDE_CONFIG_DIR", "CODEX_HOME", "GROK_HOME",
]);

export function consumerEnvironment(base, overrides = {}) {
  if (overrides === null || typeof overrides !== "object" || Array.isArray(overrides)
      || ![Object.prototype, null].includes(Object.getPrototypeOf(overrides))) {
    throw new TypeError("consumer environment overrides must be a plain object");
  }
  for (const [name, value] of Object.entries(overrides)) {
    if (!overrideVariables.has(name)) {
      throw new TypeError(`unsupported consumer environment override: ${name}`);
    }
    if (typeof value !== "string") {
      throw new TypeError(`consumer environment override must be a string: ${name}`);
    }
  }
  if (Object.hasOwn(overrides, "HOME") && overrides.HOME !== base.HOME) {
    throw new Error("consumer fixtures must preserve the user's HOME");
  }
  const env = {};
  for (const name of hostVariables) {
    if (base[name] !== undefined) env[name] = base[name];
  }
  return { ...env, ...overrides };
}

function diagnosticExcerpt(text, budget = 1200) {
  const bytes = Buffer.from(text);
  if (bytes.length <= budget) return text;
  const half = Math.floor(budget / 2);
  return bytes.subarray(0, half).toString("utf8")
    + `\n[... ${bytes.length - 2 * half} bytes omitted ...]\n`
    + bytes.subarray(-half).toString("utf8");
}


export function validateConsumerSignal(signal) {
  if (signal == null) return undefined;
  if (!(signal instanceof AbortSignal)) throw new TypeError("consumer signal must be an AbortSignal");
  if (signal.aborted) throw Object.assign(new Error("consumer canceled"), { code: "ECANCELED" });
  return signal;
}

export function stopConsumer(child) {
  if (!child.pid) return;
  if (process.platform === "win32") {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const result = spawnSync(path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "taskkill.exe"),
      ["/pid", String(child.pid), "/t", "/f"], {
        stdio: "ignore", timeout: 1000, killSignal: "SIGKILL", windowsHide: true,
      });
    if (result.error || result.status !== 0) child.kill("SIGKILL");
    return;
  }
  try { process.kill(-child.pid, "SIGKILL"); }
  catch (error) { if (error.code !== "ESRCH") throw error; }
}

export async function runConsumer(command, args, options = {}) {
  const env = consumerEnvironment(options.baseEnv ?? process.env, options.env);
  const timeout = options.timeout ?? 120_000;
  if (typeof timeout !== "number") throw new TypeError("consumer timeout must be a number");
  if (!Number.isInteger(timeout) || timeout < 0 || timeout > 2147483647) {
    throw new RangeError("consumer timeout must be an integer from 0 to 2147483647 milliseconds");
  }
  const signal = validateConsumerSignal(options.signal);
  const started = performance.now();
  const child = spawn(command, args, {
    cwd: options.cwd, env,
    detached: process.platform !== "win32",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const buffers = { stdout: [], stderr: [] };
  const sizes = { stdout: 0, stderr: 0 };
  const maxBuffer = 20 * 1024 * 1024;
  let failure;
  let cleanupError;
  let cleanupStarted = false;
  let cleanupTimer;
  let resolveClosed;
  const closed = new Promise((resolve) => { resolveClosed = resolve; });
  const stop = () => {
    if (cleanupStarted) return;
    cleanupStarted = true;
    try { stopConsumer(child); }
    catch (error) { cleanupError = error; failure ??= error; }
    cleanupTimer = setTimeout(() => {
      cleanupError ??= Object.assign(new Error("consumer streams did not close after termination"),
        { code: "ECLEANUP" });
      failure ??= cleanupError;
      child.stdout?.destroy();
      child.stderr?.destroy();
      resolveClosed({ status: child.exitCode, signal: child.signalCode });
    }, 1000);
  };
  for (const stream of ["stdout", "stderr"]) {
    child[stream].on("data", (chunk) => {
      const room = maxBuffer - sizes[stream];
      if (room > 0) {
        const retained = chunk.subarray(0, room);
        buffers[stream].push(retained);
        sizes[stream] += retained.length;
      }
      if (chunk.length > room) {
        failure ??= Object.assign(new Error("consumer " + stream + " exceeded 20 MiB"),
          { code: "ENOBUFS" });
        stop();
      }
    });
  }
  child.once("error", (error) => { failure ??= error; stop(); });
  child.once("exit", stop);
  child.once("close", (status, signal) => resolveClosed({
    status: status >= 0 ? status : null, signal,
  }));
  const onCancel = () => {
    failure ??= Object.assign(new Error("consumer canceled"), { code: "ECANCELED" });
    stop();
  };
  signal?.addEventListener("abort", onCancel, { once: true });
  const timer = timeout === 0 ? undefined : setTimeout(() => {
    failure ??= Object.assign(new Error("consumer timed out"), { code: "ETIMEDOUT" });
    stop();
  }, timeout);
  const result = await closed;
  signal?.removeEventListener("abort", onCancel);
  clearTimeout(timer);
  clearTimeout(cleanupTimer);
  const stdout = Buffer.concat(buffers.stdout).toString("utf8");
  const stderr = Buffer.concat(buffers.stderr).toString("utf8");
  if (options.transcriptPrefix) {
    mkdirSync(path.dirname(options.transcriptPrefix), { recursive: true });
    writeFileSync(options.transcriptPrefix + ".stdout", stdout);
    writeFileSync(options.transcriptPrefix + ".stderr", stderr);
    writeFileSync(options.transcriptPrefix + ".receipt.json", JSON.stringify({
      command, args, cwd: options.cwd ?? process.cwd(),
      status: result.status, signal: result.signal, error: failure?.code ?? null,
      cleanupScope: process.platform === "win32" ? "windows-tree-best-effort" : "process-group",
      cleanupError: cleanupError?.code ?? null,
      durationMs: performance.now() - started,
    }, null, 2) + "\n");
  }
  if (failure || result.status !== 0) {
    throw new Error([
      diagnosticExcerpt(`${command} ${args.slice(0, 4).join(" ")} failed (${failure?.code ?? result.status ?? "unknown"}, signal ${result.signal ?? "none"})`, 500),
      stdout.trim() && `stdout:\n${diagnosticExcerpt(stdout.trim())}`,
      stderr.trim() && `stderr:\n${diagnosticExcerpt(stderr.trim())}`,
    ].filter(Boolean).join("\n"), { cause: failure });
  }
  return stdout;
}
