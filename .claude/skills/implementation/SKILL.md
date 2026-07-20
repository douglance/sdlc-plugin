---
name: implementation
description: >-
  Start here to build code against a clear success criterion — test-first,
  incremental, one work unit per fork.
context: fork
agent: engineer
---
<execution-contract>
This phase is owned by `engineer`. When the host exposes named agents and you are the parent/orchestrator, delegate this phase to `engineer` and pass the prior artifact. If you are already that agent or delegation is unavailable, execute locally; never recursively delegate the same phase. Consume the design and plan, produce tested implementation in bounded slices, return unresolved defects or deviations, and hand off to `testing` only when work remains. Format the result with `actionable-communication`.
</execution-contract>

Write and gate the phase artifact with `lifecycle-documentation`.

<what-to-do>

Build it, test-first. Write the failing test that defines the behavior, then write the code that makes it pass. Deliver one step at a time, keeping the tree green at every step.

Make the smallest diff that meets the requirement. Touch only what the task demands, and respect the `out_of_scope` fence.

</what-to-do>

<supporting-info>

## The loop

1. Write a failing test that captures the next slice of behavior.
2. Make it pass with the simplest code that works.
3. Run the verify command. Green → next slice. Red → fix before moving on.

## Principles

- Incremental over big-bang — small, verified steps.
- Smallest diff that solves the problem; no refactoring of unbroken code.
- Match the surrounding code's style and idioms.
- The code's own tests are yours — write them test-first. The `tester` adds adversarial tests later, never instead of these.

</supporting-info>
