---
name: quality
description: Start here to assure a change is good — verification & validation, review/inspection, and the quality attributes (performance, security, reliability, usability) — beyond whether tests pass.
context: fork
agent: quality-engineer
---

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

A quality verdict: pass/fail against explicit criteria, review findings by severity, the V&V status, and which quality attributes were checked. Definitions: [`../../GLOSSARY.md`](../../GLOSSARY.md).

</supporting-info>
