import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.resolve(import.meta.dirname, "..");
const outputRoot = sourceRoot;
const sharedAgentsPath = path.join(sourceRoot, "AGENTS.md");
const claudeInstructionsPath = path.join(sourceRoot, "CLAUDE.md");

const phaseOwners = {
  "feasibility-analysis": "researcher",
  "requirements-gathering": "product-owner",
  planning: "project-manager",
  design: "architect",
  implementation: "engineer",
  testing: "tester",
  quality: "quality-engineer",
  deployment: "release-engineer",
  operations: "sre",
  documentation: "technical-writer",
  maintenance: "maintainer",
  "visual-design": "graphic-designer",
};

async function files(directory, extension) {
  return (await readdir(directory)).filter((name) => name.endsWith(extension));
}

async function directories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".reference") continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await markdownFiles(entryPath)));
    } else if (entry.name.endsWith(".md")) {
      result.push(entryPath);
    }
  }
  return result;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function markdownBody(text) {
  if (!text.startsWith("---\n")) return text;
  const closing = text.indexOf("\n---\n", 4);
  assert(closing >= 0, "markdown frontmatter is not closed");
  return text.slice(closing + 5);
}

function codexDeveloperInstructions(text) {
  const quote = "'".repeat(3);
  const marker = `developer_instructions = ${quote}\n`;
  const start = text.indexOf(marker);
  const end = text.lastIndexOf(`\n${quote}`);
  assert(start >= 0 && end > start, "Codex agent lacks developer_instructions");
  return text.slice(start + marker.length, end);
}

async function exists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

const optionalLifecycleHandoff = "Use `lifecycle-documentation` only when the output needs a durable phase artifact or handoff.";

for (const [phase, owner] of Object.entries(phaseOwners)) {
  const skillPath = path.join(sourceRoot, ".rulesync/skills", phase, "SKILL.md");
  const text = await readFile(skillPath, "utf8");
  assert(text.includes("This skill defines the"), `${phase} lacks its phase contract`);
  assert(text.includes(`\`${owner}\``), `${phase} does not identify ${owner}`);
  assert(!text.includes("delegate this phase"), `${phase} forces delegation`);
  assert(!text.includes("Write and gate the phase artifact"), `${phase} forces a lifecycle artifact`);
  assert(text.includes("Use `lifecycle-documentation` only when"), `${phase} lacks optional lifecycle guidance`);

  const ownerText = await readFile(path.join(sourceRoot, ".rulesync/subagents", `${owner}.md`), "utf8");
  assert(!ownerText.includes("- lifecycle-documentation"), `${owner} preloads lifecycle-documentation`);
  assert(!ownerText.includes("- actionable-communication"), `${owner} preloads actionable-communication`);
  const ownerBody = markdownBody(ownerText).trim();
  assert(ownerBody.includes(optionalLifecycleHandoff), `${owner} body lacks optional lifecycle guidance`);

  const claudeOwner = await readFile(path.join(outputRoot, ".claude/agents", `${owner}.md`), "utf8");
  const codexOwner = await readFile(path.join(outputRoot, ".codex/agents", `${owner}.toml`), "utf8");
  const grokOwner = await readFile(path.join(outputRoot, ".grok/agents", `${owner}.md`), "utf8");
  assert(markdownBody(claudeOwner).trim() === ownerBody, `Claude ${owner} body differs from the canonical source`);
  assert(codexDeveloperInstructions(codexOwner).trim() === ownerBody, `Codex ${owner} body differs from the canonical source`);
  assert(markdownBody(grokOwner).trim() === ownerBody, `Grok ${owner} body differs from the canonical source`);
}

for (const skill of ["requirements-gathering", "planning", "design", "spec-driven-development"]) {
  const text = await readFile(path.join(sourceRoot, ".rulesync/skills", skill, "SKILL.md"), "utf8");
  assert(text.includes("path:line"), `${skill} lacks exact repository citations`);
  assert(text.toLowerCase().includes("prior art"), `${skill} lacks a prior-art requirement`);
}

for (const skill of ["feasibility-analysis", "requirements-gathering", "planning", "design", "maintenance"]) {
  const text = await readFile(path.join(sourceRoot, ".rulesync/skills", skill, "SKILL.md"), "utf8");
  assert(text.includes("find-simplifying-insight"), `${skill} lacks the simplifying-insight decision rule`);
}

assert((await files(path.join(sourceRoot, ".rulesync/subagents"), ".md")).length === 12, "source must contain 12 agents");
const lifecycleDocumentation = await readFile(path.join(sourceRoot, ".rulesync/skills/lifecycle-documentation/SKILL.md"), "utf8");
const lifecycleStandards = await readFile(path.join(sourceRoot, ".rulesync/skills/lifecycle-documentation/references/standards-and-style.md"), "utf8");
for (const contract of ["Controlled-English profile", "Required handoff block", "Handoff gate"]) {
  assert(lifecycleDocumentation.includes(contract), `lifecycle-documentation lacks ${contract}`);
}
const compactLifecycleDocumentation = lifecycleDocumentation.replace(/\s+/g, " ");
assert(compactLifecycleDocumentation.includes("Do not combine artifacts owned by different phases"), "lifecycle documentation can collapse phase boundaries");
assert(compactLifecycleDocumentation.includes("point-to-point ownership"), "lifecycle documentation does not preserve point-to-point handoffs");
for (const standard of ["12207:2026", "15289:2019", "29148:2018", "16326:2019", "730-2026", "1016-2009", "828-2012", "29119-3:2021", "1012-2024", "26514:2021", "1028-2008"]) {
  assert(lifecycleStandards.includes(standard), `lifecycle documentation lacks ${standard}`);
}
assert(lifecycleStandards.includes("STE-derived controlled English"), "lifecycle documentation overstates STE conformance");

const actionableCommunication = await readFile(path.join(sourceRoot, ".rulesync/skills/actionable-communication/SKILL.md"), "utf8");
const uwdsPath = path.join(".rulesync/skills/actionable-communication/references/unified-writing-documentation-standard.md");
const uwds = await readFile(path.join(sourceRoot, uwdsPath), "utf8");
assert(actionableCommunication.includes("references/unified-writing-documentation-standard.md"), "actionable communication does not load UWDS");
assert(actionableCommunication.includes("Load the UWDS reference when"), "actionable communication lacks progressive UWDS loading");
assert(!actionableCommunication.includes("before writing any user-visible response"), "actionable communication loads UWDS universally");
for (const section of [
  "## 1. Purpose and scope",
  "## 2. Conformance, authority, and precedence",
  "## 9. Requirements and specifications",
  "## 12. Accessibility and cognitive usability",
  "## 18. Content profiles",
  "## 19. Quality assurance and conformance testing",
  "## 20. Standard templates",
  "## Appendix A. Source integration map",
]) {
  assert(uwds.includes(section), `UWDS lacks ${section}`);
}
for (const authority of [
  "Law, regulation, contract, and binding policy",
  "Safety and domain-specific normative standard",
  "Project terminology registry and product specification",
  "Audience and platform conventions",
  "General house style and dictionary",
]) {
  assert(uwds.includes(authority), `UWDS precedence lacks ${authority}`);
}
for (const anchor of [
  "ISO 24495-1:2023",
  "ASD-STE100 Issue 9",
  "ISO/TS 24620-1:2015",
  "ISO 704:2022",
  "Google Developer Documentation Style Guide",
  "Microsoft Writing Style Guide",
  "RFC 2119",
  "IEC/IEEE 82079-1:2019",
  "ISO/IEC/IEEE 26514:2021",
  "OASIS DITA 1.3",
  "WCAG 2.2",
  "W3C cognitive accessibility guidance",
  "W3C clear-content patterns",
  "AP Stylebook",
  "The Chicago Manual of Style",
  "APA Style",
  "MLA Handbook",
  "AMA Manual of Style",
  "Plain Writing Act",
  "Section 508 Standards",
  "Job Accommodation Network ADHD guidance",
  "ADA accommodation process",
  "ANSI Z535.6",
  "S1000D",
  "ISO 8601",
  "International System of Units",
]) {
  assert(uwds.includes(anchor), `UWDS lacks ${anchor}`);
}
const uwdsRuleIds = [...uwds.matchAll(/UWDS-[A-Z0-9]+-[0-9]{3}/g)].map(([ruleId]) => ruleId);
assert(uwdsRuleIds.length >= 60, `UWDS has only ${uwdsRuleIds.length} normative rules`);
assert(new Set(uwdsRuleIds).size === uwdsRuleIds.length, "UWDS contains duplicate normative rule IDs");
assert(uwds.includes("Assistants MUST apply UWDS when the governing communication profile or task explicitly selects it"), "UWDS lacks scoped assistant guidance");
assert(uwds.includes("| Consequential assistant communication |"), "UWDS lacks its consequential-communication profile");
assert(!uwds.includes("Apply to every user-visible response"), "UWDS applies itself universally");
assert(uwds.includes("does not reproduce proprietary publications"), "UWDS lacks its licensed-source boundary");
assert(uwds.includes("Do not claim that content conforms to"), "UWDS lacks a conformance guard");

for (const providerPath of [
  path.join(outputRoot, ".claude/skills/actionable-communication/references/unified-writing-documentation-standard.md"),
  path.join(outputRoot, ".agents/skills/actionable-communication/references/unified-writing-documentation-standard.md"),
  path.join(outputRoot, ".grok/skills/actionable-communication/references/unified-writing-documentation-standard.md"),
]) {
  assert(await readFile(providerPath, "utf8") === uwds, `${providerPath} differs from canonical UWDS`);
}

const sdlcFlow = await readFile(path.join(sourceRoot, ".rulesync/skills/sdlc-flow/SKILL.md"), "utf8");
const ontologyPath = path.join(".rulesync/skills/sdlc-flow/references/core-ontology.md");
const ontology = await readFile(path.join(sourceRoot, ontologyPath), "utf8");
const rootOntology = await readFile(path.join(sourceRoot, "ontology.md"), "utf8");
for (const section of [
  "## System map",
  "## Core concepts",
  "## Canonical sources",
  "## Provider projections",
  "## Invariants",
]) {
  assert(rootOntology.includes(section), `root ontology lacks ${section}`);
}
for (const sourceDomain of [
  ".rulesync/rules/",
  ".rulesync/subagents/",
  ".rulesync/skills/",
  "rulesync.jsonc",
  "scripts/validate.mjs",
]) {
  assert(rootOntology.includes(sourceDomain), `root ontology lacks ${sourceDomain}`);
}
for (const providerPath of [".claude/", ".agents/", ".codex/", ".grok/"]) {
  assert(rootOntology.includes(providerPath), `root ontology lacks ${providerPath}`);
}
assert(rootOntology.includes("Twelve agent role definitions"), "root ontology lacks the agent-role count");
assert(rootOntology.includes("Thirty phase and method skills"), "root ontology lacks the skill count");
assert(rootOntology.includes("detailed"), "root ontology does not bound the lifecycle ontology");
assert(sdlcFlow.includes("references/core-ontology.md"), "sdlc-flow does not load the core ontology");
for (const section of [
  "## 1. Core classes",
  "## 2. Core relationships",
  "## 3. Authority and communication model",
  "## 5. Lifecycle phase ontology",
  "## 8. Evidence and knowledge model",
  "## 10. Source and projection model",
  "## 11. Core invariants",
]) {
  assert(ontology.includes(section), `core ontology lacks ${section}`);
}
for (const phaseOwner of [
  "| `feasibility-analysis` | `researcher` |",
  "| `requirements-gathering` | `product-owner` |",
  "| `planning` | `project-manager` |",
  "| `design` | `architect` |",
  "| `visual-design` | `graphic-designer` |",
  "| `implementation` | `engineer` |",
  "| `testing` | `tester` |",
  "| `quality` | `quality-engineer` |",
  "| `deployment` | `release-engineer` |",
  "| `operations` | `sre` |",
  "| `documentation` | `technical-writer` |",
  "| `maintenance` | `maintainer` |",
]) {
  assert(ontology.includes(phaseOwner), `core ontology lacks phase-owner mapping ${phaseOwner}`);
}
const ontologyInvariantIds = [...ontology.matchAll(/ONT-INV-[0-9]{3}/g)].map(([id]) => id);
assert(ontologyInvariantIds.length === 12, `core ontology has ${ontologyInvariantIds.length} invariants instead of 12`);
assert(new Set(ontologyInvariantIds).size === ontologyInvariantIds.length, "core ontology contains duplicate invariant IDs");
assert(ontology.includes("UWDS applies silently"), "core ontology permits standards meta-commentary by default");
for (const providerPath of [
  path.join(outputRoot, ".claude/skills/sdlc-flow/references/core-ontology.md"),
  path.join(outputRoot, ".agents/skills/sdlc-flow/references/core-ontology.md"),
  path.join(outputRoot, ".grok/skills/sdlc-flow/references/core-ontology.md"),
]) {
  assert(await readFile(providerPath, "utf8") === ontology, `${providerPath} differs from the canonical core ontology`);
}

const planningBreakdown = await readFile(path.join(sourceRoot, ".rulesync/skills/planning-and-task-breakdown/SKILL.md"), "utf8");
for (const contract of [
  "Milestone: a checkpoint outcome",
  "Task: an implementable vertical slice with acceptance criteria",
  "Commit: an atomic, revertable logical change",
  "A milestone contains one or more ordered tasks",
  "A task contains one or more ordered commits",
]) {
  assert(planningBreakdown.includes(contract), `planning hierarchy lacks ${contract}`);
}
assert(planningBreakdown.includes("**Commits:**"), "task template lacks its commit list");
assert(!planningBreakdown.includes("a milestone = the commits that reach one checkpoint"), "planning still bypasses tasks between milestones and commits");

const projectManager = await readFile(path.join(sourceRoot, ".rulesync/subagents/project-manager.md"), "utf8");
assert(!projectManager.includes("Every milestone MUST have a verify command and file list"), "project-manager still contradicts its design handoff");
assert(projectManager.includes("The architect turns those into exact future file lists, signatures, and verification commands"), "project-manager does not assign exactness to design");
assert(projectManager.includes("current-state `path:line` evidence remains mandatory"), "project-manager confuses evidence paths with future file lists");

const security = await readFile(path.join(sourceRoot, ".rulesync/skills/security-and-hardening/SKILL.md"), "utf8");
assert(security.includes("a non-admin request is denied (403), an admin request succeeds, and the action's side effect is observed"), "admin authorization remains self-attested");

const tdd = await readFile(path.join(sourceRoot, ".rulesync/skills/test-driven-development/SKILL.md"), "utf8");
for (const contract of ["class TaskService", "status: 'not-implemented'", "expected \"pending\", received \"not-implemented\""]) {
  assert(tdd.includes(contract), `strong RED example lacks ${contract}`);
}

for (const skill of ["interrogate", "interrogate-with-docs"]) {
  const sourceSkill = await readFile(path.join(sourceRoot, ".rulesync/skills", skill, "SKILL.md"), "utf8");
  const claudeSkill = await readFile(path.join(outputRoot, ".claude/skills", skill, "SKILL.md"), "utf8");
  const codexSkill = await readFile(path.join(outputRoot, ".agents/skills", skill, "SKILL.md"), "utf8");
  const grokSkill = await readFile(path.join(outputRoot, ".grok/skills", skill, "SKILL.md"), "utf8");
  assert(sourceSkill.includes("\nuser-invocable: true\n"), `${skill} does not declare cross-host invocation intent`);
  assert(claudeSkill.includes("\nuser-invocable: true\n"), `Claude ${skill} is not user invocable`);
  assert(!codexSkill.includes("user-invocable"), `Codex ${skill} contains unsupported Claude invocation metadata`);
  assert(!grokSkill.includes("user-invocable"), `Grok ${skill} contains unsupported Claude invocation metadata`);
}

for (const skill of ["actionable-communication", "find-simplifying-insight"]) {
  const sourceSidecar = path.join(sourceRoot, ".rulesync/skills", skill, "agents/openai.yaml");
  const claudeSidecar = path.join(outputRoot, ".claude/skills", skill, "agents/openai.yaml");
  const codexSidecar = path.join(outputRoot, ".agents/skills", skill, "agents/openai.yaml");
  assert(!(await exists(sourceSidecar)), `${skill} keeps Codex metadata as a raw source sidecar`);
  assert(!(await exists(claudeSidecar)), `${skill} leaks Codex metadata into Claude output`);
  assert(await exists(codexSidecar), `${skill} lacks its generated Codex sidecar`);
}

assert((await directories(path.join(sourceRoot, ".rulesync/skills"))).length === 30, "source must contain 30 skills");
assert((await files(path.join(outputRoot, ".claude/agents"), ".md")).length === 12, "Claude output must contain 12 agents");
assert((await files(path.join(outputRoot, ".codex/agents"), ".toml")).length === 12, "Codex output must contain 12 agents");
assert((await files(path.join(outputRoot, ".grok/agents"), ".md")).length === 12, "Grok output must contain 12 agents");
assert((await directories(path.join(outputRoot, ".claude/skills"))).length === 30, "Claude output must contain 30 skills");
assert((await directories(path.join(outputRoot, ".agents/skills"))).length === 30, "Codex output must contain 30 skills");
assert((await directories(path.join(outputRoot, ".grok/skills"))).length === 30, "Grok output must contain 30 skills");

for (const skill of await directories(path.join(sourceRoot, ".rulesync/skills"))) {
  const sourceSkill = await readFile(path.join(sourceRoot, ".rulesync/skills", skill, "SKILL.md"), "utf8");
  const claudeSkill = await readFile(path.join(outputRoot, ".claude/skills", skill, "SKILL.md"), "utf8");
  const codexSkill = await readFile(path.join(outputRoot, ".agents/skills", skill, "SKILL.md"), "utf8");
  const grokSkill = await readFile(path.join(outputRoot, ".grok/skills", skill, "SKILL.md"), "utf8");
  const sourceBody = markdownBody(sourceSkill).trim();
  assert(markdownBody(claudeSkill).trim() === sourceBody, `Claude ${skill} body differs from the canonical source`);
  assert(markdownBody(codexSkill).trim() === sourceBody, `Codex ${skill} body differs from the canonical source`);
  assert(markdownBody(grokSkill).trim() === sourceBody, `Grok ${skill} body differs from the canonical source`);
}

const sourcePackage = JSON.parse(await readFile(path.join(sourceRoot, "package.json"), "utf8"));
const claudeManifest = JSON.parse(await readFile(path.join(outputRoot, ".claude-plugin/plugin.json"), "utf8"));
const codexManifest = JSON.parse(await readFile(path.join(outputRoot, ".agents/.codex-plugin/plugin.json"), "utf8"));
assert(sourcePackage.version === claudeManifest.version, "source and Claude versions differ");
assert(sourcePackage.version === codexManifest.version, "source and Codex versions differ");

const readme = await readFile(path.join(outputRoot, "README.md"), "utf8");
assert(!readme.includes("29 skills"), "README retains the stale 29-skill count");
assert(readme.includes("30 canonical skills"), "README must report the canonical skill count");
assert(readme.includes("Claude Code, Codex CLI, and Grok CLI"), "README must name the supported providers");

const rulesyncConfig = await readFile(path.join(sourceRoot, "rulesync.jsonc"), "utf8");
assert(rulesyncConfig.includes('"delete": true'), "Rulesync must delete stale generated projections");
for (const target of ["claudecode", "codexcli", "grokcli"]) {
  assert(rulesyncConfig.includes(`"${target}": ["rules", "subagents", "skills"]`), `Rulesync config lacks ${target}`);
}

const canonicalSharedRule = markdownBody(await readFile(path.join(sourceRoot, ".rulesync/rules/global-agents.md"), "utf8")).trim();
const sharedAgents = (await readFile(sharedAgentsPath, "utf8")).trim();
const claudeInstructions = (await readFile(claudeInstructionsPath, "utf8")).trim();
for (const [name, instructions] of [["AGENTS.md", sharedAgents], ["CLAUDE.md", claudeInstructions]]) {
  assert(instructions.includes("## Work"), `${name} lacks work guidance`);
  assert(instructions.includes("smallest correct change"), `${name} lacks the focused-change rule`);
  assert(instructions.includes("Load a skill only when"), `${name} lacks progressive skill loading`);
  assert(instructions.includes("Skip both for greenfield or trivial work"), `${name} lacks the context-loading boundary`);
  assert(instructions.includes("## Communication"), `${name} lacks communication guidance`);
  assert(instructions.includes("plain, literal, audience-specific US English"), `${name} lacks the language baseline`);
  assert(instructions.includes("Limit immediate action lists to five"), `${name} lacks the immediate-action limit`);
  assert(instructions.includes("consequential handoffs"), `${name} lacks the actionable-communication boundary`);
  assert(!instructions.includes("every user-visible response"), `${name} loads detailed communication guidance universally`);
  assert(instructions === canonicalSharedRule, `${name} differs from the canonical shared rule`);
}

const prohibitedLanguage = [
  "linear software-delivery lifecycle",
  "all verification is code tests",
  "screenshot is the test",
  "falsified spec",
  "falsified scoped",
  "committed code",
  "5–10 min",
  "codex-global/.rulesync",
  "/users/douglance/.agents/source",
];
for (const markdownPath of await markdownFiles(sourceRoot)) {
  if (
    markdownPath.includes(`${path.sep}.claude${path.sep}`) ||
    markdownPath.includes(`${path.sep}.agents${path.sep}`) ||
    markdownPath.includes(`${path.sep}.codex${path.sep}`) ||
    markdownPath.includes(`${path.sep}.grok${path.sep}`)
  ) {
    continue;
  }
  const text = (await readFile(markdownPath, "utf8")).toLowerCase();
  for (const phrase of prohibitedLanguage) {
    assert(!text.includes(phrase), `${path.relative(sourceRoot, markdownPath)} contains prohibited language: ${phrase}`);
  }
}

console.log(`Validated SDLC ${sourcePackage.version}: one source, 12 agents, 30 skills, and Claude/Codex/Grok parity.`);
