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
   Produces a technical design. For user-facing work, pair with **`visual-design`** (→ visual-designer)
   for layout, composition, states, and accessibility.
5. **`implementation`** (→ engineer) — build it test-first in vertical slices. Produces tested,
   committed code.
6. **`testing`** (→ tester) — adversarially falsify the change by executing it across edge cases,
   scale, and security. Produces a verdict with reproducible failing cases.
7. **`quality`** (→ quality-engineer) — assure the change beyond execution: verification & validation,
   review/inspection, and the quality attributes. Produces a quality verdict.

Then branch to whichever terminal phases apply:

- **`deployment`** (→ release-engineer) — ship safely with rollout, smoke check, and rollback.
- **`documentation`** (→ technical-writer) — document what actually shipped.
- **`maintenance`** (→ maintainer) — remove dead code and simplify without changing behavior.

## On-ramps

Situations that start mid-pipeline rather than at the top:

- **A bug or unexpected behavior** → `debugging-and-error-recovery` (root-cause it), then
  `implementation` to fix it test-first (write a regression test first).
- **A performance problem** → `performance-optimization` (measure → fix → guard).
- **A security concern** → `security-and-hardening`.
- **Messy but working code** → `maintenance`.

## Standalone / user-invoked

Reach for these directly, off the pipeline:

- **`grill`** — relentless interview to stress-test any plan or design (the base interview the
  requirements phase builds on).
- **`grill-with-docs`** — same interview, but challenges the plan against the project's documented
  domain model and updates `CONTEXT.md` / ADRs inline.
- **`deslop`** — strip AI-generated slop from a recent change.

## Context hygiene

- Keep the early phases (requirements → planning → design) in **one context window** so each builds
  on the same thinking.
- Each phase declares **`context: fork`**, so it executes in a fresh **fork context** — the main
  thread coordinates and never implements.
- Start a **fresh context per implementation unit**: independent slices don't need each other's
  history, and a clean window reasons more sharply.
