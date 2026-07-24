---
name: sdlc-flow
description: >-
  Use when a request spans multiple lifecycle phases or the correct next phase
  is unclear.
targets:
  - '*'
---
# SDLC Flow

The plugin is an optional graph of **phases**. Each phase is a skill that routes to one agent role
and emits an **artifact** for its immediate receiver. This skill explains where to start, which
dependencies apply, and how the phases connect.

Read [references/core-ontology.md](references/core-ontology.md) when reasoning about system entities, relationships, cardinalities, lifecycle edges, authority, traceability, evidence, or provider projections. The ontology controls relationships; project glossaries control term definitions.

## Host routing contract

When the host exposes the named phase agents and you are the parent/orchestrator, delegate the
selected phase to its named owner and pass the complete prior artifact. When already executing as
that owner, or when named-agent delegation is unavailable, run the phase locally. Never delegate
the same phase recursively. The artifact contract is portable; automatic delegation is a host
capability, not something Rulesync can synthesize.

## Lifecycle artifact contract

Use `lifecycle-documentation` for every phase output and input gate. Select the smallest applicable
IEEE/ISO information item, write it in STE-derived controlled English, preserve stable IDs, and end
with the required handoff block. A receiving phase must reject an incomplete artifact instead of
guessing what the producing phase meant.

## The default path: idea → shipped

Select only the phases the work needs. Run selected phases in dependency order; each handoff passes
one accepted artifact to one immediate receiver.

1. **`feasibility-analysis`** (→ researcher) — scout an unfamiliar problem space. Start here when
   the approach is unknown. Produces options, constraints, and trade-offs.
2. **`requirements-gathering`** (→ product-owner) — turn a vague or high-blast-radius request into
   a stress-tested specification. Start here when *what* to build is unclear.
3. **`planning`** (→ project-manager) — break the spec into a plan of milestones with dependencies, risks,
   and an explicit out-of-scope set. Produces a plan.
4. **`design`** (→ architect) — settle interfaces, contracts, exact files, and trade-offs.
   Produces a technical design. For user-facing work, pair with **`visual-design`** (→ graphic-designer)
   for layout, composition, states, and accessibility.
5. **`implementation`** (→ engineer) — build it test-first in vertical slices. Produces tested,
   bounded changes. Commit those changes when the task includes commit authority.
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
- **Visual verification** — for any UI change, the `graphic-designer` inspects the rendered result.
  Screenshots provide evidence for visual claims; executable tests provide evidence for behavior.
- **Actionable handoffs** — use `actionable-communication` so every phase leads with its artifact or
  blocker, gives compact evidence, and names the next phase only when work remains.
- **Lifecycle documents** — use `lifecycle-documentation` to select the correct SRS, plan, design,
  configuration, test, quality, V&V, user, review, audit, release, or operations artifact and apply
  the same controlled-English and traceability rules at every phase boundary.
- **Simplifying insight** — use `find-simplifying-insight` when rules and exceptions proliferate and
  the underlying model may be wrong. Require a novel prediction and falsification test; do not force
  a paradigm shift when the current model survives.

## On-ramps

Situations that enter the lifecycle at the smallest applicable phase:

- **A bug or unexpected behavior** → `debugging-and-error-recovery` (root-cause it), then
  `implementation` to fix it test-first (write a regression test first).
- **A performance problem** → `performance-optimization` (measure → fix → guard).
- **A security concern** → `security-and-hardening`.
- **A UI / visual change** → `visual-design` (design and verify the rendered result).
- **Authoring a new frontend surface** (landing page, app UI, design system, restyle) → `frontend-design` (committed art direction, signature element, token-driven system), then `visual-design` to verify.
- **Messy but working code** → `maintenance`.

## Standalone / user-invoked

Reach for these methods directly, outside the phase graph:

- **`interrogate`** — relentless interrogation to stress-test any plan, design, spec, or approach (the base
  interrogation the requirements phase builds on).
- **`interrogate-with-docs`** — same interrogation, but challenges the plan against the project's documented
  domain model and updates `CONTEXT.md` / ADRs inline.
- **`deslop`** — strip AI-generated slop from a recent change.
