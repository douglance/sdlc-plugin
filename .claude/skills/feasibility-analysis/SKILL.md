---
name: feasibility-analysis
description: >-
  Start here to scout an unfamiliar problem space — research existing solutions,
  patterns, anti-patterns, constraints, and technical feasibility before
  committing to an approach.
context: fork
agent: researcher
---
<execution-contract>
This phase is owned by `researcher`. When the host exposes named agents and you are the parent/orchestrator, delegate this phase to `researcher` and pass the prior artifact. If you are already that agent or delegation is unavailable, execute locally; never recursively delegate the same phase. Consume the idea or problem statement, produce a sourced landscape of options and constraints, return unresolved unknowns, and hand off to `requirements-gathering` only when work remains. Format the result with `actionable-communication`.
</execution-contract>

<what-to-do>

Scout the problem space and map the landscape. Find what already exists, how others solve this, and what could make it hard or impossible. Explore wide before going deep — survey many options, don't tunnel on the first.

Use the codebase, Context7, and web search together. Every claim you make must trace to a source.

When rules, exceptions, adapters, or compensating processes appear to protect a questionable model, run `find-simplifying-insight`. Keep the current model as the null hypothesis and require a falsifiable prediction before recommending a paradigm shift.

</what-to-do>

<supporting-info>

## What to investigate

- **Existing solutions** — libraries, tools, and prior art in this codebase and the wider ecosystem.
- **Patterns and anti-patterns** — how this problem is solved well, and the ways it's solved badly.
- **Constraints** — technical limits, performance bounds, compatibility, security, licensing.
- **Trade-offs** — for each viable option, what you gain and what you give up.

## Depth

Default to WIDE reconnaissance — breadth over depth. Go DEEP on a specific option only when asked. If you've spent more time than the question warrants, stop and report what you have.

## What to produce

A scout report: the landscape, viable options with their trade-offs, the key constraints, open questions, and red flags. Mark your confidence and cite the source for every finding. Say what you couldn't determine rather than guessing.

</supporting-info>
