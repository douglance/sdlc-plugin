import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function body(text) {
  const closing = text.indexOf("\n---\n", 4);
  return closing >= 0 ? text.slice(closing + 5) : text;
}

function description(text) {
  const frontmatter = text.slice(4, text.indexOf("\n---\n", 4));
  const lines = frontmatter.split("\n");
  const start = lines.findIndex((line) => line.startsWith("description:"));
  assert(start >= 0, "skill lacks a description");
  const first = lines[start].slice("description:".length).trim();
  if (first && first !== ">-") return first;
  const folded = [];
  for (const line of lines.slice(start + 1)) {
    if (/^[a-zA-Z][\w-]*:/.test(line)) break;
    folded.push(line.trim());
  }
  return folded.join(" ").replace(/\s+/g, " ").trim();
}

test("always-on rule stays lightweight and defers specialized guidance", async () => {
  const text = body(await readFile(path.join(root, ".rulesync/rules/global-agents.md"), "utf8"));
  const wordCount = text.trim().split(/\s+/).length;
  assert(wordCount <= 180, `always-on rule has ${wordCount} words; expected at most 180`);
  assert.match(text, /Load a skill only when/i);
  for (const phrase of [
    "every user-visible response",
    "After every change",
    "Do not stop until",
    "non-negotiable",
  ]) {
    assert(!text.includes(phrase), `always-on rule contains broad mandate: ${phrase}`);
  }
});

test("skill descriptions are narrow interfaces rather than universal mandates", async () => {
  const skillsRoot = path.join(root, ".rulesync/skills");
  const names = await readdir(skillsRoot);
  const descriptions = [];
  for (const name of names) {
    const text = await readFile(path.join(skillsRoot, name, "SKILL.md"), "utf8");
    const value = description(text);
    assert(value.length <= 220, `${name} description has ${value.length} characters`);
    descriptions.push(value);
  }
  const combined = descriptions.join("\n");
  assert(combined.length <= 4_800, `skill descriptions total ${combined.length} characters`);
  for (const phrase of ["any code change", "any feature", "any logic", "any behavior"]) {
    assert(!combined.toLowerCase().includes(phrase), `skill descriptions contain broad trigger: ${phrase}`);
  }
});

test("UWDS and lifecycle artifacts use progressive disclosure", async () => {
  const actionable = await readFile(
    path.join(root, ".rulesync/skills/actionable-communication/SKILL.md"),
    "utf8",
  );
  assert(!actionable.includes("before writing any user-visible response"));
  assert(!actionable.includes("Use for ordinary conversation"));
  assert.match(actionable, /Load the UWDS reference when/i);

  for (const phase of [
    "feasibility-analysis",
    "requirements-gathering",
    "planning",
    "design",
    "visual-design",
    "implementation",
    "testing",
    "quality",
    "deployment",
    "operations",
    "documentation",
    "maintenance",
  ]) {
    const text = await readFile(path.join(root, ".rulesync/skills", phase, "SKILL.md"), "utf8");
    assert(!text.includes("delegate this phase"), `${phase} forces delegation`);
    assert(!text.includes("Write and gate the phase artifact"), `${phase} forces an artifact`);
  }
});
