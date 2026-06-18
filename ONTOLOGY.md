# Ontology

How the plugin's concepts relate. [GLOSSARY.md](GLOSSARY.md) defines *what each term means*; this
file states *how the terms connect*. Relationships only — no definitions repeated here.

## The execution model (plugin convention)

- A **phase** runs in a **fork context** with exactly one **agent**.
- An **agent** preloads one or more **reference skills** (its `skills:` frontmatter).
- A **phase** emits an **artifact**, and that artifact is the next phase's input.
- The **main thread** coordinates phases and never implements; each fork context does the work of
  one phase and returns its artifact.
- The **out-of-scope** set travels with the artifact into each fork and constrains what that fork
  may touch.

## The lifecycle pipeline

```
feasibility-analysis → requirements-gathering → planning → design → visual-design
   → implementation → testing → quality → deployment → operations → maintenance
   ↺  production learnings (incidents, telemetry, new needs) re-enter at
      requirements-gathering or debugging-and-error-recovery
```

- Each arrow is an **artifact** handoff: feasibility report → spec → plan → design → UI → code →
  test report → quality verdict → release → runbooks/telemetry → maintenance changes.
- The plugin's **falsification** posture applies at two points: requirements-gathering tries to
  disprove the spec by interrogation (product-owner); testing tries to disprove the built change by
  execution (tester). Same posture, different method and artifact.
- Deployment, operations, documentation, and maintenance act on shipped code; operations and
  maintenance feed learnings back to requirements.

## The design relationships (canonical)

- A **module** presents an **interface** and hides an **implementation** behind it; that hiding is
  **information hiding**, enforced by **encapsulation** and clarified by **abstraction**.
- **Cohesion** is measured within a module (how single-purpose it is); **coupling** is measured
  between modules (how much they depend on each other's internals). The design goal is high cohesion
  and low coupling, which **separation of concerns** produces.
- Callers and tests reach a module only through its interface.

## The verification relationships

- **RED → GREEN → REFACTOR** is the engine of implementation; a **regression test** written *first*
  is that same engine pointed at a bug (the failing test reproduces the defect before the fix).
- **Negative testing** is the adversarial half of verification (find defects); validation
  is the confirming half (meet the need). The plugin's **falsification** posture is the defect half
  made the default stance.
- **DAMP vs DRY** governs the shape of the tests written inside these cycles.

## The unit relationships

- **Vertical slices** are the unit the lifecycle advances by; an **atomic commit** is the unit a
  slice is recorded in.
- **Always / Ask-First / Never** classifies every risky action; the **out-of-scope** set is the
  *Never* tier made concrete for one unit of work.
