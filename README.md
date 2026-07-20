# SDLC Plugin

A linear software-delivery lifecycle with specialized agents, reusable skills, and explicit artifact handoffs between phases. The phases intentionally overlap at their boundaries so context survives the transition.

## Lifecycle

| Phase skill | Agent | Produces |
| --- | --- | --- |
| `feasibility-analysis` | `researcher` | options, constraints, and trade-offs |
| `requirements-gathering` | `product-owner` | a falsified scoped specification |
| `planning` | `project-manager` | milestones, dependencies, risks, and out-of-scope boundaries |
| `design` | `architect` | interfaces, exact files, trade-offs, and verification contracts |
| `visual-design` | `graphic-designer` | user-facing design and rendered evidence |
| `implementation` | `engineer` | tested implementation |
| `testing` | `tester` | an adversarial verdict and reproducible defects |
| `quality` | `quality-engineer` | a verification-and-validation gate verdict |
| `deployment` | `release-engineer` | deployed version, smoke evidence, and rollback path |
| `operations` | `sre` | SLOs, runbooks, incidents, and lifecycle feedback |
| `documentation` | `technical-writer` | documentation verified against shipped behavior |
| `maintenance` | `maintainer` | behavior-preserving simplification |

The package contains 12 agents and 30 skills. `actionable-communication` makes phase reports and handoffs immediately actionable. `find-simplifying-insight` searches for a falsifiable simpler model when a system has accumulated compensating rules and exceptions.

Requirements, specifications, and plans must ground material arguments in concrete prior art: exact `path:line` repository citations, recorded searches when no analogue exists, and current primary sources for relevant external claims.

## One source, native outputs

The neutral source lives at `~/.agents/source/.rulesync/`. [Rulesync](https://github.com/dyoshikawa/rulesync) generates native provider layouts into this repository:

```text
~/.agents/source/.rulesync/
  subagents/  ------------------+--> .claude/agents/
                               +--> .codex/agents/
  skills/     ------------------+--> .claude/skills/
                               +--> .agents/skills/
```

Regenerate and verify from the source directory:

```bash
cd ~/.agents/source
pnpm install
pnpm generate
pnpm check
```

Do not hand-edit generated agent or skill files in this repository; edit the Rulesync source and regenerate.

## Install

### Claude Code

```bash
claude plugin marketplace add douglance/sdlc-plugin
claude plugin install sdlc@sdlc-marketplace
```

Claude Code loads the packaged skills and agents. Phase skills use native `context: fork` and `agent:` routing.

### Codex CLI

```bash
codex plugin marketplace add douglance/sdlc-plugin
codex plugin add sdlc@sdlc-marketplace
```

Codex plugins install the 30 skills. Installed Codex skills are explicitly invocable with `$` or `/skills`; Claude's `user-invocable` metadata is not part of the Codex skill format. Codex also supports first-class custom agents, but they are a separate user configuration surface; install the generated 12 agent TOMLs with:

```bash
cd ~/.agents/source
pnpm install:codex-agents
```

## Attribution

The actionable handoff discipline is adapted for SDLC work from [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd), used under its MIT license. It is scoped to phase reports and handoffs rather than imposed as a global personality.
