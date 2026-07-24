import { copyFile, mkdir, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const sourceRoot = path.resolve(import.meta.dirname, "..");
const argumentIndex = process.argv.indexOf("--codex-home");
const codexHome = argumentIndex >= 0
  ? path.resolve(process.argv[argumentIndex + 1])
  : path.resolve(process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex"));
const sourceDirectory = path.join(sourceRoot, ".codex/agents");
const destinationDirectory = path.join(codexHome, "agents");

await mkdir(destinationDirectory, { recursive: true });
const agentFiles = (await readdir(sourceDirectory))
  .filter((name) => name.endsWith(".toml"))
  .sort();

for (const name of agentFiles) {
  await copyFile(path.join(sourceDirectory, name), path.join(destinationDirectory, name));
}

const result = {
  codexHome,
  destination: destinationDirectory,
  agents: agentFiles.length,
};

if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(result)}\n`);
} else {
  process.stdout.write(`Installed ${agentFiles.length} Codex agent profiles in ${destinationDirectory}\n`);
}
