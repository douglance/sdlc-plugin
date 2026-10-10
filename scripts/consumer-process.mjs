import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const hostVariables = [
  "PATH", "HOME", "USER", "LOGNAME", "LANG", "LC_ALL", "LC_CTYPE",
  "TMPDIR", "TERM", "COLORTERM", "SSL_CERT_FILE", "SSL_CERT_DIR",
];

export function consumerEnvironment(base, overrides = {}) {
  const env = {};
  for (const name of hostVariables) {
    if (base[name] !== undefined) env[name] = base[name];
  }
  if (overrides.HOME !== undefined && overrides.HOME !== base.HOME) {
    throw new Error("consumer fixtures must preserve the user's HOME");
  }
  return { ...env, ...overrides };
}

export function runConsumer(command, args, options = {}) {
  const started = performance.now();
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: consumerEnvironment(options.baseEnv ?? process.env, options.env),
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    timeout: options.timeout ?? 120_000,
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
      `${command} ${args.slice(0, 4).join(" ")} failed (${result.error?.code ?? result.status ?? "unknown"}, signal ${result.signal ?? "none"})`,
      stdout.trim() && `stdout:\n${stdout.trim()}`,
      stderr.trim() && `stderr:\n${stderr.trim()}`,
    ].filter(Boolean).join("\n"), { cause: result.error });
  }
  return stdout;
}
