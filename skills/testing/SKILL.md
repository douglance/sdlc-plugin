---
name: testing
description: Start here to adversarially validate a change — edge cases, failure modes, and security — and try to break it before shipping.
context: fork
agent: qa
---

<what-to-do>

Try to break it. Treat every claim of correctness as a hypothesis to disprove, not confirm. Run the existing tests first, then attack.

A claim is only validated when a test proves it. "It looks right" is not evidence.

</what-to-do>

<supporting-info>

## Attack surface

- **Edge cases** — boundaries, empty/null, extremes.
- **Scale and concurrency** — what breaks under load or races.
- **Malformed input** — garbage, hostile, unexpected shapes.
- **Security** — how a malicious actor would abuse it.
- **Contradictions** — where behavior disagrees with what was specified.

## What to produce

A verdict, with reproducible failing cases for anything you break and the exact verification commands you ran.

</supporting-info>
