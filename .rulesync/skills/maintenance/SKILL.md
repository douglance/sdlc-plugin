---
name: maintenance
description: >-
  Use to remove dead code, duplication, indirection, or unnecessary complexity
  while preserving behavior.
targets:
  - '*'
claudecode:
  context: fork
  agent: maintainer
---
<execution-contract>
This skill defines the maintenance phase. Use the `maintainer` agent when a bounded cleanup can proceed independently; otherwise work locally. Produce behavior-preserving simplification with before-and-after evidence.
</execution-contract>

Use `lifecycle-documentation` only when the result needs a durable artifact or handoff.

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
