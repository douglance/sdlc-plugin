---
name: planning
description: Start here to structure a non-trivial change into a high-level plan of milestones with dependencies, risks, and an explicit out-of-scope boundary.
context: fork
agent: project-manager
---

<what-to-do>

Turn the goal into structure. Gather enough codebase context to understand the terrain, then break the work into a series of high-level milestones, each composed of commits.

Stay high-level — leave exact files, signatures, and verify commands out. Ship the plan after the first draft; iterate during execution, not during planning.

</what-to-do>

<supporting-info>

## What a plan contains

- **Milestones** — ordered checkpoints, each composed of a series of atomic commits (vertical slices). No count cap — the plan is as many milestones as the work needs.
- **Dependencies** — what each milestone needs from the others.
- **Risks** — what could go wrong, what's hard to reverse.
- **Out-of-scope set** — an explicit `out_of_scope` list. This is a hard constraint, not a suggestion. You own it: every downstream milestone inherits it verbatim.

## Principles

Prefer the smallest plan that delivers the goal. Keep the commit small — one logical change — and let a milestone be however many commits it takes to reach its checkpoint.

</supporting-info>
