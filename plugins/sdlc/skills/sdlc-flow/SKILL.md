---
name: sdlc-flow
description: The map of the SDLC lifecycle — which phase skill to reach for and what comes next. Use when starting work and unsure where to begin, going from an idea to shipped code, or deciding which phase fits the situation.
---

# SDLC Flow

The plugin is a pipeline of **phases**, each a skill that forks to one agent and emits an
**artifact** the next phase consumes. This skill is the map: where to start, what follows, and how
the pieces connect. For term definitions see [`../../GLOSSARY.md`](../../GLOSSARY.md); for how the
concepts relate see [`../../ONTOLOGY.md`](../../ONTOLOGY.md).

## The main flow: idea → shipped

Run these in order; each one's output is the next one's input. Skip any phase the work doesn't need.

1. **`feasibility-analysis`** (→ researcher) — scout an unfamiliar problem space. Start here when
   the approach is unknown. Produces options, constraints, and trade-offs.
2. **`requirements-gathering`** (→ product-owner) — turn a vague or high-blast-radius request into
   a falsified spec. Start here when *what* to build is unclear. Produces a scoped spec.
3. **`planning`** (→ project-manager) — break the spec into a phased plan with dependencies, risks,
   and an explicit out-of-scope set. Produces a plan.
4. **`design`** (→ architect) — settle interfaces, contracts, exact files, and trade-offs.
   Produces a technical design. For user-facing work, pair with **`visual-design`** (→ graphic-designer)
   for layout, composition, states, and accessibility.
5. **`implementation`** (→ engineer) — build it test-first in vertical slices. Produces tested,
   committed code.
6. **`testing`** (→ tester) — adversarially falsify the change by executing it across edge cases,
   scale, and security. Produces a verdict with reproducible failing cases.
7. **`quality`** (→ quality-engineer) — assure the change beyond execution: verification & validation,
   review/inspection, and the quality attributes. Produces a quality verdict.

## Operate & evolve (the loop)

Shipping isn't the end — the lifecycle is a loop. What you learn in production re-enters at
`debugging-and-error-recovery` or `requirements-gathering`.

- **`deployment`** (→ release-engineer) — ship safely with rollout, smoke check, and rollback.
- **`operations`** (→ sre) — run the live service: observability/SLOs, incident
  response, runbooks, and continuity. Routes learnings back into the loop.
- **`documentation`** (→ technical-writer) — document what actually shipped.
- **`maintenance`** (→ maintainer) — fix, simplify, and reduce debt without changing behavior.

## Cross-cutting concerns

Some concerns run *through* the phases, not as a single step — build them in, don't inspect them in
at the end:

- **Quality** — the engineer writes the code's tests test-first; the `tester` adds adversarial
  tests; the `quality-engineer` assures V&V, reviews, and quality attributes.
- **Security** — threats in requirements, least-privilege in design, `security-and-hardening` in
  construction, attacked in testing. Not a final checklist.
- **Traceability** — give each requirement a stable ID and carry it into design, tasks, and tests
  so the link stays greppable.
- **Visual verification** — for any UI change, the `graphic-designer` LOOKs at the rendered result;
  the screenshot is the test.

## On-ramps

Situations that start mid-pipeline rather than at the top:

- **A bug or unexpected behavior** → `debugging-and-error-recovery` (root-cause it), then
  `implementation` to fix it test-first (write a regression test first).
- **A performance problem** → `performance-optimization` (measure → fix → guard).
- **A security concern** → `security-and-hardening`.
- **A UI / visual change** → `visual-design` (design and verify the rendered result).
- **Messy but working code** → `maintenance`.

## Standalone / user-invoked

Reach for these directly, off the pipeline:

- **`interrogate`** — relentless interrogation to stress-test any plan, design, spec, or approach (the base
  interrogation the requirements phase builds on).
- **`interrogate-with-docs`** — same interrogation, but challenges the plan against the project's documented
  domain model and updates `CONTEXT.md` / ADRs inline.
- **`deslop`** — strip AI-generated slop from a recent change.
