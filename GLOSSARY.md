# Glossary

Canonical definitions for the terms the SDLC plugin uses across skills and agents. Each term is
defined **once, here**; skills point to this file instead of restating definitions, so a meaning
changes in one place. For how the concepts relate, see
[ONTOLOGY.md](ONTOLOGY.md).

## Process & lifecycle

**Phase** — one stage of the software lifecycle, exposed as a skill: feasibility-analysis,
requirements-gathering, planning, design, implementation, testing, maintenance, deployment,
documentation.

**Artifact** (work product) — the output a phase produces and hands to the next: a spec, a plan, a
design, code, a test report, docs, a release.

**Scope** (in-scope / out-of-scope) — what a unit of work will and will not touch. The out-of-scope
set is carried verbatim into every dispatch as a hard constraint; the plugin records it in the
literal `out_of_scope` field (see Plugin conventions).

**Vertical slice** (tracer bullet — Hunt & Thomas) — one complete end-to-end path through every
layer (e.g. DB + API + UI for a single user action), built and verified before the next slice. The
opposite of horizontal slicing (all DB, then all API, then all UI). Canonical treatment lives in
the `incremental-implementation` skill.

**Atomic commit** — a commit containing exactly one logical change, independently revertable, with a
message describing why. Canonical guidance lives in `git-workflow-and-versioning`.

**Nonfunctional requirement** (quality-of-service) — a requirement on *how well* the system behaves
rather than what it does: performance, reliability, availability, security, usability, scalability.
Stated as a measurable target, it drives architecture and test design.

**Requirements traceability** — a stable ID on each requirement, referenced from design, tasks, and
tests, so the link from a requirement to the code and tests that satisfy it is greppable.

## Design quality

The established vocabulary for what makes a module well-formed. Use these rather than ad-hoc words
like "component," "service," or "boundary."

**Module** — anything with an interface and an implementation; scale-agnostic (a function, class, or
package).

**Interface** — everything a caller must know to use a module correctly: signature plus invariants,
ordering constraints, error modes, configuration, and performance characteristics.

**Implementation** — what is inside a module: its body of code, hidden from callers.

**Information hiding** — designing each module around a decision likely to change, and
hiding that decision behind its interface so change stays local.

**Encapsulation** — bundling data with the operations on it and exposing only the interface; the
mechanism that enforces information hiding.

**Abstraction** — exposing the essential behavior of a module while omitting incidental detail.

**Cohesion** — how single-purpose a module is. High cohesion (one
well-defined responsibility) is the goal.

**Coupling** — how dependent modules are on each other's internals. Low
coupling (modules interact only through stable interfaces) is the goal.

**Separation of concerns** — keeping distinct responsibilities in distinct modules so
each can be reasoned about and changed independently.

**Quality attribute** — a measurable property of the whole system (the "-ilities": performance,
reliability, security, maintainability, scalability). Nonfunctional requirements set its targets;
architecture is judged against it.

**Architecture view / viewpoint** — a description of the system from one angle (logical, runtime,
deployment); the viewpoint is the lens, the view is the result. No single diagram captures everything.

**Architecturally-significant decision** — a design choice that is hard to reverse or that drives a
quality attribute. These are the decisions worth recording as ADRs.

**User-centered design** — designing from the user's task, context, and success state rather than the
data model or the implementation.

**Accessibility** — the usability quality attribute for people with disabilities: sufficient
contrast, keyboard operability, focus order, labels/alt text, and reduced-motion support.

## Verification & testing

**Verification vs validation** — verification asks "did we build it right?" (matches the spec);
validation asks "did we build the right thing?" (meets the need).

**RED → GREEN → REFACTOR** — the test-driven cycle: write a failing test (RED), write the
minimum code to pass it (GREEN), then improve the code with tests still passing (REFACTOR).

**Regression test** — a test that pins behavior so a future change can't silently break it. For a
bug fix, write the regression test *first* so it reproduces the defect (fails before the fix, passes
after) — the canonical "reproduce, then fix" discipline.

**Negative testing** — testing aimed at *finding* defects with invalid, unexpected, or hostile
input (the unhappy paths), as opposed to confirming expected behavior.

**DAMP vs DRY** — in tests, prefer DAMP (Descriptive And Meaningful Phrases — readable, slightly
repetitive) over DRY (abstracted, terse). A failing test should be readable in isolation.

**Test levels** — unit (one module in isolation), integration (modules together across a seam),
system (the whole running system), acceptance (against the user's criteria). Match the level to the
defect class you're hunting.

**Specification-based (black-box) vs structure-based (white-box)** — black-box derives test cases
from the contract (equivalence partitions, boundary values, decision tables); white-box derives them
from the code to cover untested branches and paths.

**Fault-based testing (mutation)** — deliberately introduce a fault and confirm a test fails; a
surviving mutant reveals a missing or weak assertion.

**Test oracle** — how a test decides pass from fail (the expected result). Sources: the
specification, a golden/approved output, an invariant property, or a prior version.

**Review / inspection** — reading code or a design against a checklist to find defects, rather than
executing it. Catches what dynamic tests don't exercise.

## Operations

**Observability** — the ability to understand a running system's internal state from its outputs:
logs, metrics, and traces.

**Service-level objective (SLO)** — a measurable reliability target for a service (e.g. 99.9% of
requests under 300 ms), against which alerts and error budgets are set.

**Incident management** — detecting, triaging by impact, mitigating, resolving, and learning from a
production failure (the postmortem).

**Runbook** — a written, repeatable procedure for operating or recovering a service, so response
doesn't depend on one person's memory.

## Plugin conventions

Terminology specific to this plugin — **not** standard SDLC. Listed here so it is never mistaken for
canon.

**Fork context** — the plugin's execution mechanism. A phase skill declares `context: fork` and an
`agent:`, so invoking it runs that work in a fresh subagent with its own context window; the main
thread coordinates and the fork executes.

**`out_of_scope`** — the literal field the plugin uses to record the out-of-scope set (see Scope),
echoed into every dispatch as a hard prohibition.

**Falsification** — the plugin's house stance for `product-owner` and `tester`: treat every requirement
or claim of correctness as a hypothesis to *disprove*, not confirm.

**Always / Ask-First / Never** — the plugin's three-tier rule for risky actions. *Always*: safe, do
it. *Ask-First*: irreversible/high-blast-radius/destructive — confirm first. *Never*: prohibited.
Used by `security-and-hardening`.
