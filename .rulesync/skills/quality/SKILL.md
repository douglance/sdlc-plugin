---
name: quality
description: >-
  Use for independent verification, validation, inspection, and quality
  judgment beyond whether tests pass.
targets:
  - '*'
claudecode:
  context: fork
  agent: quality-engineer
---
<execution-contract>
This skill defines the quality phase. Use the `quality-engineer` agent when an independent gate can proceed in parallel; otherwise work locally. Produce a verification-and-validation verdict with release-blocking findings.
</execution-contract>

Use `lifecycle-documentation` only when the result needs a durable artifact or handoff.

<what-to-do>

Judge whether the change is *right*, not just whether it runs. Do verification (built right) and validation (right thing built), review the change against a checklist, and check the quality attributes that matter.

A green test suite is necessary, not sufficient. Tie every measurement to a decision.

</what-to-do>

<supporting-info>

## What to assure

- **Verification vs validation** — verification: tests pass, types check, static analysis clean. Validation: the change satisfies the spec and the user's need.
- **Review / inspection** — read the diff against a checklist: error handling, boundaries, security, spec contradictions, missing tests, maintainability. Catches what dynamic tests don't exercise.
- **Quality attributes** — the "-ilities" relevant to this change: performance, security, reliability, usability, maintainability. Measurable targets where they matter.

## What to produce

A quality verdict: pass/fail against explicit criteria, review findings by severity, the V&V status, and which quality attributes were checked.

</supporting-info>
