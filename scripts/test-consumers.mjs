import assert from "node:assert/strict";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  assertExpectedInventory,
  assertHandoff,
  extractJsonObject,
  parseClaudeInventory,
} from "./consumer-contract.mjs";
import { prepareConsumerFixture } from "./consumer-evidence.mjs";
import { runConsumer } from "./consumer-process.mjs";

const sourceRoot = path.resolve(import.meta.dirname, "..");
const discoveryOnly = process.argv.includes("--discovery-only");
const naturalTriggers = process.argv.includes("--natural-triggers");
const keepTemp = process.argv.includes("--keep-temp");
const providerIndex = process.argv.indexOf("--provider");
const selectedProvider = providerIndex >= 0 ? process.argv[providerIndex + 1] : "all";
assert(
  ["all", "claude", "codex", "grok"].includes(selectedProvider),
  `unknown provider: ${selectedProvider}`,
);
assert(!(discoveryOnly && naturalTriggers), "--discovery-only and --natural-triggers cannot be combined");
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "sdlc-consumers-"));
const snapshotRoot = path.join(temporaryRoot, "plugin");
const fixtureRoot = path.join(temporaryRoot, "fixture");
const claudeHome = path.join(temporaryRoot, "claude");
const codexHome = path.join(temporaryRoot, "codex");
const grokHome = path.join(temporaryRoot, "grok");

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["outcome", "phase", "evidence", "open"],
  properties: {
    outcome: { type: "string" },
    phase: { type: "string" },
    evidence: { type: "string" },
    open: { type: "string" },
  },
};

let processIndex = 0;

function run(command, args, options = {}) {
  const transcriptPrefix = path.join(temporaryRoot, `process-${String(++processIndex).padStart(3, "0")}`);
  return runConsumer(command, args, {
    ...options,
    cwd: options.cwd ?? fixtureRoot,
    transcriptPrefix,
  });
}

async function countDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).length;
}

async function countFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(extension)).length;
}

async function linkCredential(source, destination) {
  try {
    await symlink(source, destination);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function handoffFromEnvelope(output) {
  const envelope = extractJsonObject(output);
  if (envelope.structured_output) return envelope.structured_output;
  if (envelope.result && typeof envelope.result === "object") return envelope.result;
  if (typeof envelope.result === "string") return extractJsonObject(envelope.result);
  if (typeof envelope.text === "string") return extractJsonObject(envelope.text);
  return envelope;
}

async function prepare() {
  await cp(sourceRoot, snapshotRoot, {
    recursive: true,
    filter(source) {
      const relative = path.relative(sourceRoot, source);
      if (!relative) return true;
      const firstSegment = relative.split(path.sep)[0];
      return ![".git", "node_modules"].includes(firstSegment);
    },
  });
  await mkdir(fixtureRoot, { recursive: true });
  await prepareConsumerFixture(fixtureRoot);
  await mkdir(claudeHome, { recursive: true });
  await mkdir(codexHome, { recursive: true });
  await mkdir(grokHome, { recursive: true });
}

async function proveClaude() {
  const env = { CLAUDE_CONFIG_DIR: claudeHome };
  run("claude", ["plugin", "marketplace", "add", snapshotRoot, "--scope", "user"], { env });
  run("claude", ["plugin", "install", "sdlc@sdlc-marketplace", "--scope", "user"], { env });
  const details = run("claude", ["plugin", "details", "sdlc@sdlc-marketplace"], { env });
  assertExpectedInventory("Claude", parseClaudeInventory(details));

  if (naturalTriggers) {
    const output = run("claude", [
      "--print",
      "--permission-mode", "dontAsk",
      "--model", "haiku",
      "--max-turns", "6",
      "--setting-sources", "local",
      "--strict-mcp-config",
      "--mcp-config", JSON.stringify({ mcpServers: {} }),
      "--plugin-dir", path.join(snapshotRoot, ".claude"),
      "--output-format", "stream-json",
      "--verbose",
      "A deployment failed because the live health check returned HTTP 503. Produce the smallest actionable incident handoff with cause, evidence, remedy, and one next owner. Use only the facts supplied.",
    ], { env, timeout: 90_000 });
    await writeFile(path.join(temporaryRoot, "claude-natural.jsonl"), output);
    const events = output.trim().split("\n").map((line) => JSON.parse(line));
    const selectedActionableCommunication = events.some((event) =>
      event.type === "assistant"
      && event.message?.content?.some((item) =>
        item.type === "tool_use"
        && item.name === "Skill"
        && item.input?.skill === "sdlc:actionable-communication"
      )
    );
    assert(selectedActionableCommunication, "Claude did not naturally select actionable-communication");
    const result = events.findLast((event) => event.type === "result")?.result ?? "";
    assert(/\b503\b/.test(result), "Claude's natural-trigger result omitted the supplied incident evidence");
  } else if (!discoveryOnly) {
    const output = run("claude", [
      "--print",
      "--permission-mode", "dontAsk",
      "--model", "haiku",
      "--max-turns", "10",
      "--setting-sources", "local",
      "--strict-mcp-config",
      "--mcp-config", JSON.stringify({ mcpServers: {} }),
      "--plugin-dir", path.join(snapshotRoot, ".claude"),
      "--output-format", "json",
      "--json-schema", JSON.stringify(schema),
      "/sdlc:actionable-communication Read TASK.md, sum.mjs, and EVIDENCE.md and report whether the scoped implementation is complete. Return only the requested structured result.",
    ], { env, timeout: 90_000 });
    await writeFile(path.join(temporaryRoot, "claude-handoff.json"), output);
    assertHandoff(handoffFromEnvelope(output));
  }

  return `Claude: 30 skills, 12 agents${
    discoveryOnly ? "" : naturalTriggers ? ", natural skill selection" : ", actionable handoff"
  }`;
}

async function proveCodex() {
  const env = { CODEX_HOME: codexHome };
  run("codex", ["plugin", "marketplace", "add", snapshotRoot, "--json"], { env });
  const installation = extractJsonObject(
    run("codex", ["plugin", "add", "sdlc@sdlc-marketplace", "--json"], { env }),
  );
  const listing = extractJsonObject(
    run("codex", ["plugin", "list", "--marketplace", "sdlc-marketplace", "--json"], { env }),
  );
  assert.equal(listing.installed?.[0]?.installed, true, "Codex does not report sdlc as installed");
  assert.equal(
    await countDirectories(path.join(installation.installedPath, "skills")),
    30,
    "Codex installed skill count differs from 30",
  );
  const agentInstall = extractJsonObject(run("node", [
    path.join(snapshotRoot, "scripts/install-codex-agents.mjs"),
    "--codex-home", codexHome,
    "--json",
  ], { env }));
  assert.equal(agentInstall.agents, 12, "Codex agent installer did not install 12 profiles");
  assert.equal(
    await countFiles(path.join(codexHome, "agents"), ".toml"),
    12,
    "Codex isolated home does not contain 12 agent profiles",
  );

  if (!discoveryOnly) {
    await linkCredential(path.join(os.homedir(), ".codex/auth.json"), path.join(codexHome, "auth.json"));
    const schemaPath = path.join(temporaryRoot, "handoff.schema.json");
    const outputPath = path.join(temporaryRoot, "codex-handoff.json");
    await writeFile(schemaPath, `${JSON.stringify(schema, null, 2)}\n`);
    run("codex", [
      "exec",
      "--ephemeral",
      "--skip-git-repo-check",
      "--sandbox", "read-only",
      "--json",
      "--output-schema", schemaPath,
      "--output-last-message", outputPath,
      "-C", fixtureRoot,
      naturalTriggers ? "Read TASK.md, sum.mjs, and EVIDENCE.md and report whether the scoped implementation is complete. Return only the requested structured result." : "$sdlc:actionable-communication Read TASK.md, sum.mjs, and EVIDENCE.md and report whether the scoped implementation is complete. Return only the requested structured result.",
    ], { env, timeout: 180_000 });
    assertHandoff(extractJsonObject(await readFile(outputPath, "utf8")));
  }

  return `Codex: 30 skills, 12 native agent profiles${discoveryOnly ? "" : naturalTriggers ? ", organic handoff (routing unverified)" : ", actionable handoff"}`;
}

async function proveGrok() {
  const env = { GROK_HOME: grokHome };
  run("grok", ["plugin", "install", path.join(snapshotRoot, ".claude"), "--trust"], { env });
  const plugins = JSON.parse(run("grok", ["plugin", "list", "--json"], { env }));
  const installed = plugins.find((plugin) => plugin.name === "sdlc");
  assert(installed, "Grok does not report sdlc as installed");
  assertExpectedInventory("Grok", {
    skills: await countDirectories(path.join(installed.path, "skills")),
    agents: await countFiles(path.join(installed.path, "agents"), ".md"),
  });
  run("grok", ["plugin", "details", "sdlc"], { env });

  if (!discoveryOnly) {
    await linkCredential(path.join(os.homedir(), ".grok/auth.json"), path.join(grokHome, "auth.json"));
    const output = run("grok", [
      "--single", naturalTriggers ? "Read TASK.md, sum.mjs, and EVIDENCE.md and report whether the scoped implementation is complete. Return only the requested structured result." : "Use the installed sdlc actionable-communication skill. Read TASK.md, sum.mjs, and EVIDENCE.md and report whether the scoped implementation is complete. Return only the requested structured result.",
      "--cwd", fixtureRoot,
      "--sandbox", "read-only",
      "--no-memory",
      "--no-subagents",
      "--max-turns", "4",
      "--output-format", "json",
      "--json-schema", JSON.stringify(schema),
    ], { env, timeout: 180_000 });
    await writeFile(path.join(temporaryRoot, "grok-handoff.json"), output);
    assertHandoff(handoffFromEnvelope(output));
  }

  return `Grok: 30 skills, 12 agents${discoveryOnly ? "" : ", actionable handoff"}`;
}

try {
  await prepare();
  const results = [];
  if (selectedProvider === "all" || selectedProvider === "claude") results.push(await proveClaude());
  if (selectedProvider === "all" || selectedProvider === "codex") results.push(await proveCodex());
  if (selectedProvider === "all" || selectedProvider === "grok") results.push(await proveGrok());
  process.stdout.write(`${results.join("\n")}\n`);
  process.stdout.write(`Consumer proof passed in isolated homes${discoveryOnly ? " (discovery only)" : ""}.\n`);
} finally {
  if (keepTemp) {
    process.stdout.write(`Kept consumer test environment at ${temporaryRoot}\n`);
  } else {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}
