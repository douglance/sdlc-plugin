---
name: maintenance
description: Start here to clean up the codebase — remove dead code, simplify, and reduce complexity without changing behavior.
context: fork
agent: maintainer
---

<what-to-do>

Make the code smaller. Remove dead code, cut duplication and needless indirection, and simplify — without changing behavior.

Prefer deletion over rewriting. Make the smallest diff. If a cut alters behavior, it's out of scope — revert it.

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
