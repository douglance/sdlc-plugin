---
name: planning
description: >-
  Start here to structure a non-trivial change into a high-level plan of
  milestones with dependencies, risks, and an explicit out-of-scope boundary.
---
<execution-contract>
This phase is owned by `project-manager`. When the host exposes named agents and you are the parent/orchestrator, delegate this phase to `project-manager` and pass the prior artifact. If you are already that agent or delegation is unavailable, execute locally; never recursively delegate the same phase. Consume the validated specification, produce milestones with dependencies, risks, and out-of-scope boundaries, return unresolved dependencies, and hand off to `design` only when work remains. Format the result with `actionable-communication`.
</execution-contract>

Write and gate the phase artifact with `lifecycle-documentation`.

<what-to-do>

Turn the goal into structure. Gather enough codebase context to understand the terrain, then break the work into a series of high-level milestones, each composed of commits. Ground the structure in cited prior art rather than generic architectural preference.

Stay high-level about future implementation details, but be exact about present evidence: cite the specific existing files and lines that justify each approach, dependency, risk, and estimate of scope. Ship the plan after the first draft; iterate during execution, not during planning.

When the proposed plan needs many compatibility rules, adapters, or exception paths, run `find-simplifying-insight` before accepting that complexity. Record the null hypothesis, the candidate simpler model, its novel prediction, and the cheapest decisive test.

</what-to-do>

<supporting-info>

## What a plan contains

- **Milestones** — ordered checkpoints, each composed of a series of atomic commits (vertical slices). No count cap — the plan is as many milestones as the work needs.
- **Dependencies** — what each milestone needs from the others.
- **Risks** — what could go wrong, what's hard to reverse.
- **Out-of-scope set** — an explicit `out_of_scope` list. This is a hard constraint, not a suggestion. You own it: every downstream milestone inherits it verbatim.
- **Evidence anchors** — every milestone names the existing code, test, contract, or primary source that supports its shape. Use exact `path:line` citations.
- **Prior-art comparison** — identify the nearest analogous implementation, what can be reused, and where this work differs. If none exists, include the search commands that established that absence.
- **Argument trace** — separate observed facts from inferences and recommendations. Risks and sequencing decisions must point back to their evidence.

## Evidence format

| Planning claim | Evidence | Implication for the plan | Confidence |
| --- | --- | --- | --- |
| This flow belongs behind the existing service boundary | `src/service.ts:18-51`, `tests/service.test.ts:9-34` | Extend the boundary in milestone 1; do not add a parallel service | High |

For external framework, standards, or research claims, cite a current primary source and include its version or publication date.

## Principles

Prefer the smallest plan that delivers the goal. Keep the commit small — one logical change — and let a milestone be however many commits it takes to reach its checkpoint.

</supporting-info>
