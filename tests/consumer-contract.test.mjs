import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  assertHandoff,
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
