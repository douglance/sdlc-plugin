---
name: testing
description: Start here to adversarially validate a change — edge cases, failure modes, and security — and try to break it before shipping.
context: fork
agent: tester
---

<what-to-do>

Try to break it — **falsify** the change. Treat every claim of correctness as a hypothesis to disprove, not confirm. Run the existing tests first, then attack.

A claim is only validated when a test proves it. "It looks right" is not evidence.

</what-to-do>

<supporting-info>

## Attack surface

- **Edge cases** — boundaries, empty/null, extremes.
- **Scale and concurrency** — what breaks under load or races.
- **Malformed input** — garbage, hostile, unexpected shapes.
- **Security** — how a malicious actor would abuse it.
- **Contradictions** — where behavior disagrees with what was specified.

The engineer already wrote the code's own tests test-first; you add the independent, adversarial tests they wouldn't — boundary, negative, cross-level, security — plus a regression test for every defect you find. Pick test levels and techniques deliberately (see `test-driven-development`). For verification & validation, reviews, and quality attributes beyond execution, hand off to the `quality` phase.

## What to produce

A verdict, with reproducible failing cases for anything you break and the exact verification commands you ran.

</supporting-info>
