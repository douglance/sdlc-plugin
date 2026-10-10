import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export async function prepareConsumerFixture(directory) {
  await writeFile(path.join(directory, "package.json"), '{"private":true,"type":"module"}\n');
  await writeFile(path.join(directory, "TASK.md"),
    "# Task\n\nImplement one exported sum(a, b) function using JavaScript addition for numeric arguments.\n" +
    "Scope is this fixture only. No deployment, persistence, or integration work is requested.\n\n" +
    "Acceptance checks:\n- R1: sum(19, 23) = 42\n- R2: sum(-3, 5) = 2\n" +
    "- R3: sum(1.25, 2.75) = 4\n- R4: sum(0, 0) = 0\n\n" +
    "Implementation completion requires inspecting sum.mjs and verifying that all four checks passed in the captured test receipt.\n");
  await writeFile(path.join(directory, "sum.mjs"), "export const sum = (a, b) => a + b;\n");
  await writeFile(path.join(directory, "sum.test.mjs"),
    'import assert from "node:assert/strict"; import test from "node:test"; import { sum } from "./sum.mjs";\n' +
    'test("R1 positive integers", () => assert.equal(sum(19, 23), 42));\n' +
    'test("R2 negative operand", () => assert.equal(sum(-3, 5), 2));\n' +
    'test("R3 decimal operands", () => assert.equal(sum(1.25, 2.75), 4));\n' +
    'test("R4 zero operands", () => assert.equal(sum(0, 0), 0));\n');
  return recordFixtureEvidence(directory);
}

export async function recordFixtureEvidence(directory) {
  const command = "node --test --test-reporter=tap";
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const output = execFileSync(process.execPath, ["--test", "--test-reporter=tap"], {
    cwd: directory,
    env,
    encoding: "utf8",
    timeout: 10_000,
    maxBuffer: 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const passed = Number(output.match(/^# pass (\d+)$/m)?.[1] ?? 0);
  assert(passed > 0 && /^# fail 0$/m.test(output), "consumer fixture has no passing tests");
  await writeFile(path.join(directory, "EVIDENCE.md"),
    "# Consumer evidence\n\nVerified command: `" + command +
    "`\n\n```text\n" + output + "\n```\n");
  return { command, passed };
}
