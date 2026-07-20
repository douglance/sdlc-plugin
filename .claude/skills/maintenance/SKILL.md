---
name: maintenance
description: >-
  Start here to clean up the codebase — remove dead code, simplify, and reduce
  complexity without changing behavior.
context: fork
agent: maintainer
---
<execution-contract>
This phase is owned by `maintainer`. When the host exposes named agents and you are the parent/orchestrator, delegate this phase to `maintainer` and pass the prior artifact. If you are already that agent or delegation is unavailable, execute locally; never recursively delegate the same phase. Consume the working system and a bounded debt target, produce behavior-preserving simplification with before-and-after proof, return unsafe cuts, and hand off to `testing` or `quality` only when work remains. Format the result with `actionable-communication`.
</execution-contract>

Write and gate the phase artifact with `lifecycle-documentation`.

<what-to-do>

Make the code smaller. Remove dead code, cut duplication and needless indirection, and simplify — without changing behavior.

Prefer deletion over rewriting. Make the smallest diff. If a cut alters behavior, it's out of scope — revert it.

When complexity comes from a cluster of rules, exceptions, adapters, or workarounds, run `find-simplifying-insight` before doing local cleanup. Accept a deeper model change only when it preserves behavior, makes a novel prediction, and survives a decisive test.

</what-to-do>

<supporting-info>

## What to cut

- **Dead code** — unused functions, exports, branches, variables.
- **Duplication** — repeated logic that can collapse.
- **Needless indirection** — layers and abstractions that earn nothing: indirection that adds **coupling** without improving **cohesion** or hiding a decision.
- **Over-configuration** — options and flexibility nobody uses.

## The rule

Behavior must not change. Prove it with the verify command before and after. Report net lines removed and one line per file changed.

</supporting-info>
