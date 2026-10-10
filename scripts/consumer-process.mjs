import { spawnSync } from "node:child_process";
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

export function runConsumer(command, args, options = {}) {
  const started = performance.now();
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: consumerEnvironment(options.baseEnv ?? process.env, options.env),
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    timeout: options.timeout ?? 120_000,
    killSignal: "SIGKILL",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  if (options.transcriptPrefix) {
    mkdirSync(path.dirname(options.transcriptPrefix), { recursive: true });
    writeFileSync(options.transcriptPrefix + ".stdout", stdout);
    writeFileSync(options.transcriptPrefix + ".stderr", stderr);
    writeFileSync(options.transcriptPrefix + ".receipt.json", JSON.stringify({
      command,
      args,
      cwd: options.cwd ?? process.cwd(),
      status: result.status,
      signal: result.signal,
      error: result.error?.code ?? null,
      durationMs: performance.now() - started,
    }, null, 2) + "\n");
  }
  if (result.error || result.status !== 0) {
    throw new Error([
      diagnosticExcerpt(`${command} ${args.slice(0, 4).join(" ")} failed (${result.error?.code ?? result.status ?? "unknown"}, signal ${result.signal ?? "none"})`, 500),
      stdout.trim() && `stdout:\n${diagnosticExcerpt(stdout.trim())}`,
      stderr.trim() && `stderr:\n${diagnosticExcerpt(stderr.trim())}`,
    ].filter(Boolean).join("\n"), { cause: result.error });
  }
  return stdout;
}
