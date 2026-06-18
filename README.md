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

## Install contract

Drop this plugin into a Claude Code plugins directory and it works as-is. It is
self-contained: it depends only on the harness, not on any private machine config.
