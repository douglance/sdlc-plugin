# SDLC Plugin

One maintainable source for software-delivery rules, skills, and specialist agent roles across
Claude Code, Codex CLI, and Grok CLI.

## How it works

Edit the neutral source under `.rulesync/`. Rulesync 14.0.1 generates the native layouts that each
provider expects:

```text
.rulesync/  canonical source
    |
    +--> .claude/  Claude skills and agents
    +--> .agents/  portable and Codex skills
    +--> .codex/   Codex agent profiles
    `--> .grok/    Grok skills and agents
```

The generated directories are projections, not separate implementations. Do not edit them by hand.

## Lifecycle

The lifecycle is an optional graph of phases, not a mandatory pipeline. Start at the smallest phase
that fits the work, follow the dependencies that apply, and skip phases that do not.

Each selected phase has one owning agent role and produces one primary artifact for its immediate
receiver.

| Phase skill | Owning role | Primary artifact |
| --- | --- | --- |
| `feasibility-analysis` | `researcher` | Options, constraints, and trade-offs |
| `requirements-gathering` | `product-owner` | Stress-tested scoped specification |
| `planning` | `project-manager` | Milestones, dependencies, risks, and scope |
| `design` | `architect` | Interfaces, decisions, and verification contracts |
| `visual-design` | `graphic-designer` | Approved targets and rendered evidence |
| `implementation` | `engineer` | Tested bounded changes |
| `testing` | `tester` | Adversarial verdict and reproducible cases |
| `quality` | `quality-engineer` | Verification and validation verdict |
| `deployment` | `release-engineer` | Deployed version, smoke evidence, and rollback path |
| `operations` | `sre` | SLOs, runbooks, incidents, and telemetry evidence |
| `documentation` | `technical-writer` | Documentation validated against shipped behavior |
| `maintenance` | `maintainer` | Behavior-preserving change and proof |

The remaining skills provide reusable methods such as test-driven development, security hardening,
API design, performance optimization, lifecycle documentation, and actionable communication.

## Provider support

The same 30 canonical skills and 12 canonical agent roles generate into each provider's native
surface.

| Capability | Claude Code | Codex CLI | Grok CLI |
| --- | --- | --- | --- |
| Shared rules | `CLAUDE.md` | `AGENTS.md` | `AGENTS.md` |
| Skills | `.claude/skills/` | `.agents/skills/` | `.grok/skills/` |
| Agent roles | `.claude/agents/` | `.codex/agents/` | `.grok/agents/` |
| Plugin metadata | `.claude-plugin/` | `.agents/.codex-plugin/` | Native directory discovery |

Provider metadata can differ. The semantic body of a generated skill or role must match its
canonical `.rulesync` source.

## Install

### Claude Code

```bash
claude plugin marketplace add douglance/sdlc-plugin
claude plugin install sdlc@sdlc-marketplace
```

### Codex CLI

```bash
codex plugin marketplace add douglance/sdlc-plugin
codex plugin add sdlc@sdlc-marketplace
```

Codex loads skills from `.agents/skills/`. Its agent profiles live in `.codex/agents/`.

### Grok CLI

Install the generated Claude-compatible package, which Grok supports natively:

```bash
grok plugin install /path/to/sdlc-plugin/.claude --trust
```

For project-local use, copy the generated `.grok/` directory into the target project.

## Develop

Install the pinned toolchain:

```bash
pnpm install
```

Regenerate all supported providers:

```bash
pnpm generate
```

Check for stale projections without changing files:

```bash
pnpm check
```

Run the complete semantic and parity suite:

```bash
pnpm validate
```

Run installation and model-backed handoff checks for Claude, Codex, and Grok:

```bash
pnpm test:consumers
```

The consumer checks create separate configuration homes and a fixture repository, install the
local snapshot through each host's real plugin interface, and verify 30 skills and 12 installed
agent profiles. Model-backed runs check the handoff's declared status and evidence wording. The temporary environment is
removed unless `--keep-temp` is selected. Use `pnpm test:consumers:discovery` when model-backed
execution is unavailable.

Consumer commands run asynchronously. On POSIX, each starts in its own process group; timeout,
output overflow, and root exit send SIGKILL to that group. The runner waits for pipe closure and
records ECLEANUP rather than success if cleanup does not finish within one second. Each captured
stream is capped at 20 MiB, with partial output retained on failure. Invalid timeout values are
rejected before launch; zero explicitly disables the command deadline.
The CLI forwards SIGINT and SIGTERM through an AbortSignal to the active command or Codex
preflight, records cancellation, and exits with 130 or 143. Direct callers can pass an
AbortSignal too; invalid or already canceled signals are rejected before launch.

Receipts record the actual root status, termination signal, cleanup scope, and cleanup error.
Windows uses best-effort taskkill while the root exists. Windows cleanup after root exit and
descendants that leave the owned POSIX group remain unproved. Forced caller SIGKILL cannot
run this cooperative cleanup.

Codex also queries its native app-server before generating. The preflight disables enabled skills
outside the temporary Codex home by exact `SKILL.md` path and verifies the catalog again. It checks
that apps, memory, hooks, remote plugin discovery, tool suggestions, authentication elicitation,
and multi-agent features are disabled, no MCP servers or inherited instruction sources are
reported, and the thread is read-only with child network access off. Generation receives the same
override arguments. The retained environment includes both preflight responses and process
receipts; saved configuration responses contain only feature states and MCP server names.

These checks establish the observed discovery and configuration boundaries, not every byte of the
model's effective context. They do not prove clean context for Claude or Grok, natural routing for
Codex or Grok, or comparative quality against another workflow.

Prove that Claude can route a request to the relevant installed skill without naming it:

```bash
pnpm test:consumers:natural
```

Codex plugins install the shared skills. Install the generated native agent profiles into the
active Codex home with:

```bash
pnpm install:codex-agents
```

The normal change loop is:

1. Edit `.rulesync/` or canonical root documentation.
2. Run `pnpm generate`.
3. Run `pnpm validate`.
4. Review the canonical and generated changes together.

Provider-specific generation commands are available for diagnosis:

```bash
pnpm generate:claude
pnpm generate:codex
pnpm generate:grok
```

## Canonical documentation

- [System ontology](ontology.md) explains the whole plugin in one page.
- [Lifecycle ontology](.rulesync/skills/sdlc-flow/references/core-ontology.md) contains detailed
  execution, artifact, evidence, and handoff relationships.
- [Glossary](GLOSSARY.md) defines project terms.
- [Unified Writing and Documentation Standard](.rulesync/skills/actionable-communication/references/unified-writing-documentation-standard.md)
  governs user-visible communication.

## Design constraints

- `.rulesync/` is the only canonical source for generated semantic bodies.
- Every phase has one owning role.
- Every actual handoff is point-to-point, even though the lifecycle graph can branch.
- Evidence must match the claim: executable tests for behavior, rendered inspection for visual
  composition, and appropriate review or measurement for other quality claims.
- Generated projections that are missing, stale, or semantically different fail validation.
- External standards are scoped references, not unsupported blanket conformance claims.

## Attribution

The actionable handoff discipline is adapted for SDLC work from
[`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd), used under its MIT license.
