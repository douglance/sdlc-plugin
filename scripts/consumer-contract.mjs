import assert from "node:assert/strict";

const expectedInventory = { skills: 30, agents: 12 };

export function parseClaudeInventory(output) {
  const skills = output.match(/\bSkills \((\d+)\)/)?.[1];
  const agents = output.match(/\bAgents \((\d+)\)/)?.[1];
  assert(skills, "Claude inventory does not report a skill count");
  assert(agents, "Claude inventory does not report an agent count");
  return { skills: Number(skills), agents: Number(agents) };
}

function componentCount(value) {
  if (Array.isArray(value)) return value.length;
  if (typeof value === "number") return value;
  if (value && typeof value === "object") return Object.keys(value).length;
  return 0;
}

export function parseGrokInventory(output) {
  const payload = JSON.parse(output);
  const plugins = Array.isArray(payload) ? payload : payload.plugins;
  assert(Array.isArray(plugins), "Grok inventory does not contain a plugin list");
  const plugin = plugins.find((entry) => entry.name === "sdlc" || entry.plugin?.name === "sdlc");
  assert(plugin, "Grok inventory does not contain the sdlc plugin");
  const components = plugin.components ?? plugin.plugin?.components ?? plugin;
  return {
    skills: componentCount(components.skills),
    agents: componentCount(components.agents),
  };
}

export function assertExpectedInventory(provider, inventory) {
  assert.deepEqual(
    inventory,
    expectedInventory,
    `${provider} inventory is ${inventory.skills} skills and ${inventory.agents} agents; expected 30 and 12`,
  );
}

export function assertHandoff(handoff) {
  assert.equal(typeof handoff, "object", "consumer output is not an object");
  for (const field of ["outcome", "phase", "evidence", "open"]) {
    assert.equal(
      typeof handoff[field],
      "string",
      `consumer handoff lacks string field ${field}: ${JSON.stringify(handoff)}`,
    );
    assert(handoff[field].trim(), `consumer handoff field is empty: ${field}`);
  }
  assert(
    /^(?:feasibility|requirements|planning|design|visual design|implementation|testing|quality|deployment|operations|documentation|maintenance)\s*(?:-|–|—|:)\s*complete$/i.test(handoff.phase.trim()),
    `consumer handoff does not report a completed lifecycle phase: ${JSON.stringify(handoff)}`,
  );
  assert(
    /\b(node|npm|pnpm|bun|deno|pytest|cargo|go test|swift test|xcodebuild)\b.*\b(test|passed|ok|success)/i.test(handoff.evidence),
    "consumer handoff does not contain executable evidence",
  );
}

export function extractJsonObject(output) {
  const trimmed = output.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    assert(start >= 0 && end > start, "consumer output does not contain a JSON object");
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}
