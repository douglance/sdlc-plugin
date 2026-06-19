# SDLC Plugin

A skill-centric software-delivery lifecycle. Each lifecycle phase is a skill that
routes to a specialized subagent; the Claude Code harness orchestrates the subagents.

The phases:

- **feasibility-analysis** → researcher
- **requirements-gathering** → product-owner
- **planning** → project-manager
- **design** → architect
- **visual-design** → graphic-designer
- **implementation** → engineer
- **testing** → tester
- **quality** → quality-engineer
- **maintenance** → maintainer
- **deployment** → release-engineer
- **operations** → sre
- **documentation** → technical-writer

## Install

This repo doubles as a marketplace for **both** Claude Code and Codex CLI. The skills
live once, at `plugins/sdlc/skills/`; each toolchain's manifest points at them.

### Claude Code

```bash
claude plugin marketplace add douglance/sdlc-plugin
claude plugin install sdlc@sdlc-marketplace
```

Or load it for one session only: `claude --plugin-dir <repo-path>`.
Manage with `claude plugin list | disable sdlc | update sdlc`.

### Codex CLI

```bash
codex plugin marketplace add douglance/sdlc-plugin
codex plugin add sdlc@sdlc-marketplace
```

Manage with `codex plugin list | remove sdlc`.

Both forms also accept a local path instead of `douglance/sdlc-plugin`.

## What ports to Codex

The 26 lifecycle **skills** install and trigger by description on both toolchains.
The **agents** (`agents/*.md`) and the skill→subagent auto-routing (`context: fork` /
`agent:` frontmatter) are Claude Code features — Codex reads the skills as
description-triggered guidance, and spawns subagents only when explicitly asked.
