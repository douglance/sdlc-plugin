# SDLC Plugin

A skill-centric software-delivery lifecycle. Each lifecycle phase is a skill that
routes to a specialized subagent; the Claude Code harness orchestrates the subagents.

The phases:

- **feasibility-analysis** → researcher
- **requirements-gathering** → product-owner
- **planning** → project-manager
- **design** → architect
- **implementation** → engineer
- **testing** → qa
- **maintenance** → maintainer
- **deployment** → release-engineer
- **documentation** → technical-writer

## Install contract

Drop this plugin into a Claude Code plugins directory and it works as-is. It is
self-contained: it depends only on the harness, not on any private machine config.

### Model-tier intent

Agents express **tier intent**, not model IDs. The harness resolves the intent to a
concrete model, so the plugin tracks model availability without edits:

- **Coordinator tier** — the driving/reasoning agents (`model: inherit`, inheriting
  the session's model).
- **Cheap / mechanical tier** — grunt work like cleanup and simplification
  (`maintainer`, also `model: inherit` with a tier-intent comment).

Never hard-code a model ID (no `model: sonnet`/`claude-*-...`). If you want to pin a
tier on your own machine, do it in your harness config, not in the plugin.
