---
name: implementation
description: >-
  Use when requirements are clear and code must be added, changed, or fixed
  against an observable success criterion.
context: fork
agent: engineer
---
<execution-contract>
This skill defines the implementation phase. Use the `engineer` agent when a bounded implementation can proceed independently; otherwise work locally. Produce tested changes in coherent slices and report material deviations.
</execution-contract>

Use `lifecycle-documentation` only when the result needs a durable artifact or handoff.

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
