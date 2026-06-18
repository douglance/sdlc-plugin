---
name: design
description: Start here to settle how a non-trivial change will be built — interfaces, contracts, file-level structure, and trade-offs.
context: fork
agent: architect
---

<what-to-do>

Make the work precise. Design the interfaces and contracts, name the exact files and signatures, and define the architecture and its trade-offs. Specify how each unit of work will be verified.

Favor stable interfaces and the simplest design that meets the requirements. Don't over-build — every element of the design must trace to a requirement.

</what-to-do>

<supporting-info>

## What a design contains

- **Interfaces and contracts** — the boundaries between parts and what crosses them.
- **Exact files and signatures** — name them; leave no ambiguity for whoever builds.
- **Trade-offs** — the alternatives you considered and why you chose this one.
- **Verification** — a test or typecheck command for each unit of work.

## Principles

Design for **high cohesion** (each module does one thing) and **low coupling** (modules depend on each other's interfaces, never their internals). Apply **information hiding** — put each likely-to-change decision behind an interface — so change stays local. Stable interfaces over clever internals; the simplest design that satisfies the requirements wins. Definitions: [`../../GLOSSARY.md`](../../GLOSSARY.md).

## Architectural design

For system-wide structure — not just one module — make the architecture explicit:

- **Stakeholders & concerns** — who the design must satisfy (users, operators, security) and what each needs.
- **Views** — describe the system from the angles that matter: logical (modules and responsibilities), runtime (processes and data flow), deployment (where it runs). A diagram or a few lines each.
- **Architecturally-significant decisions** — the choices hard to reverse or that drive a quality attribute (performance, security, scalability). Record each as an ADR (see `documentation-and-adrs`).
- **Tradeoff analysis** — for each significant decision, list the options and score them against the quality attributes that matter, then pick with rationale rather than by default.

</supporting-info>
