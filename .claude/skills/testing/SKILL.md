---
name: testing
description: >-
  Use after implementation to probe edge cases, failure modes, malformed input,
  scale, security, and contradictions.
context: fork
agent: tester
---
<execution-contract>
This skill defines the testing phase. Use the `tester` agent when bounded adversarial validation can proceed independently; otherwise work locally. Produce reproducible cases and a clear verdict.
</execution-contract>

Use `lifecycle-documentation` only when the result needs a durable artifact or handoff.

<what-to-do>

Try to break it — **falsify** the change. Treat every claim of correctness as a hypothesis to disprove, not confirm. Run the existing tests first, then attack.

A behavioral claim is validated only when an executable test supports it. Visual, accessibility,
process, and quality claims require evidence appropriate to those claims.

</what-to-do>

<supporting-info>

## Attack surface

- **Edge cases** — boundaries, empty/null, extremes.
- **Scale and concurrency** — what breaks under load or races.
- **Malformed input** — garbage, hostile, unexpected shapes.
- **Security** — how a malicious actor would abuse it (dynamic security testing; hardening review belongs to the `quality` phase).
- **Contradictions** — where behavior disagrees with what was specified.

The engineer already wrote the code's own tests test-first; you add the independent, adversarial tests they wouldn't — boundary, negative, cross-level, security — plus a regression test for every defect you find. Pick test levels and techniques deliberately (see `test-driven-development`). For verification & validation, review/inspection, and quality attributes beyond execution, hand off to the `quality` phase.

## What to produce

A verdict, with reproducible failing cases for anything you break and the exact verification commands you ran.

</supporting-info>
