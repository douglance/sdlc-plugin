---
name: planning
description: Start here to structure a non-trivial change into a high-level, phased plan with dependencies, risks, and an explicit scope fence.
context: fork
agent: project-manager
---

<what-to-do>

Turn the goal into structure. Gather enough codebase context to understand the terrain, then break the work into a small number of high-level phases.

Stay high-level — leave exact files, signatures, and verify commands out. Ship the plan after the first draft; iterate during execution, not during planning.

</what-to-do>

<supporting-info>

## What a plan contains

- **Phases** — a handful of ordered steps (aim for ≤5), each a meaningful unit of work.
- **Dependencies** — what each phase needs from the others.
- **Risks** — what could go wrong, what's hard to reverse.
- **Scope fence** — an explicit `out_of_scope` list. This is a hard boundary, not a suggestion. You own it: every downstream phase inherits it verbatim.

## Principles

Prefer the smallest plan that delivers the goal. If the work needs more than ~5 phases, it's two plans, not one.

</supporting-info>
