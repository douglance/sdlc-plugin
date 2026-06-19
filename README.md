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

This repo is both a plugin and a single-plugin marketplace (`.claude-plugin/marketplace.json`),
so it installs without a remote. Run from anywhere:

```bash
# Register this directory as a marketplace, then install the plugin (persists across sessions)
claude plugin marketplace add /Users/douglance/.claude/sdlc-plugin
claude plugin install sdlc@sdlc-marketplace
```

Or load it for the current session only, no install:

```bash
claude --plugin-dir /Users/douglance/.claude/sdlc-plugin
```

Manage it with `claude plugin list`, `claude plugin disable sdlc`, `claude plugin update sdlc`.

It is self-contained: it depends only on the harness, not on any private machine config.
