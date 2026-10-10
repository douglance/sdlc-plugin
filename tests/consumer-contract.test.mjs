import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  assertHandoff,
  consumerHandoffSchema,
  parseClaudeInventory,
  parseGrokInventory,
} from "../scripts/consumer-contract.mjs";

test("parses Claude component inventory", () => {
  const inventory = parseClaudeInventory(`
Component inventory
  Skills (30) actionable-communication, implementation
  Agents (12) architect, engineer
`);

  assert.deepEqual(inventory, { skills: 30, agents: 12 });
});

test("Claude marketplace packages the generated Claude projection", async () => {
  const marketplace = JSON.parse(await readFile(".claude-plugin/marketplace.json", "utf8"));
  const manifest = JSON.parse(await readFile(".claude/.claude-plugin/plugin.json", "utf8"));
  assert.equal(marketplace.plugins[0].source, "./.claude");
  assert.equal(manifest.name, "sdlc");
  assert.equal(manifest.skills, undefined);
  assert.equal(manifest.agents, undefined);
});

test("parses Grok JSON component inventory", () => {
  const inventory = parseGrokInventory(JSON.stringify({
    plugins: [{
      name: "sdlc",
      components: {
        skills: Array.from({ length: 30 }, (_, index) => `skill-${index}`),
        agents: Array.from({ length: 12 }, (_, index) => `agent-${index}`),
      },
    }],
  }));

  assert.deepEqual(inventory, { skills: 30, agents: 12 });
});

test("accepts an actionable lifecycle handoff", () => {
  assert.doesNotThrow(() => assertHandoff({
    outcome: "The consumer fixture is verified.",
    phase: "implementation - complete",
    evidence: "node --test passed.",
    open: "none",
  }));
});

test("accepts an em dash in the lifecycle phase", () => {
  assert.doesNotThrow(() => assertHandoff({
    outcome: "The consumer fixture is verified.",
    phase: "Implementation — complete",
    evidence: "node --test passed.",
    open: "none",
  }));
});

test("accepts the lifecycle phase supported by the evidence", () => {
  assert.doesNotThrow(() => assertHandoff({
    outcome: "The consumer fixture test suite passes.",
    phase: "Testing - complete",
    evidence: "node --test passed.",
    open: "none",
  }));
});

test("rejects a handoff without executable evidence", () => {
  assert.throws(() => assertHandoff({
    outcome: "The consumer fixture is verified.",
    phase: "implementation - complete",
    evidence: "Looks correct.",
    open: "none",
  }), /executable evidence/);
});

test("handoff schema declares status without forcing completion", () => {
  const phases = consumerHandoffSchema.properties.phase.enum;
  assert(phases.includes("implementation - complete"));
  assert(phases.includes("implementation - partial"));
  assert(phases.includes("implementation - blocked"));
  assert(!phases.includes("implementation"));
  assert(!phases.includes("complete"));
  assert.equal(consumerHandoffSchema.additionalProperties, false);
  assert.deepEqual(consumerHandoffSchema.required, ["outcome", "phase", "evidence", "open"]);
});

test("rejects executable evidence without a passing result", () => {
  for (const evidence of ["node --test failed.", "node --test completed.", "node --test: 0 passed, 4 failed."]) {
    assert.throws(() => assertHandoff({
      outcome: "Implementation complete.", phase: "implementation - complete", evidence, open: "None.",
    }), /executable evidence|failed checks/);
  }
});

test("rejects completed handoffs that report failed checks", () => {
  for (const evidence of [
    "node --test: 3 passed, 1 failed.",
    "node --test passed: 4; failed: 1.",
    "node --test failed 04; passed 3.",
    "node --test: 0 passed, 0 failed.",
  ]) {
    assert.throws(() => assertHandoff({
      outcome: "Implementation complete.", phase: "implementation - complete", evidence, open: "None.",
    }), /failed checks/);
  }
});

test("accepts passing executable evidence with explicit zero failures", () => {
  assert.doesNotThrow(() => assertHandoff({
    outcome: "Implementation complete.", phase: "implementation - complete",
    evidence: "node --test --test-reporter=tap: 4 tests passed, 0 failed.", open: "None.",
  }));
});
