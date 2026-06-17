---
name: design
description: Start here to settle how a non-trivial change will be built — interfaces, contracts, file-level structure, and trade-offs.
context: fork
agent: architect
---

<what-to-do>

Make the work precise. Design the interfaces and contracts, name the exact files and signatures, and define the architecture and its trade-offs. Specify how each unit of work will be verified.

Favor stable boundaries and the simplest design that meets the requirements. Don't over-build — every element of the design must trace to a requirement.

</what-to-do>

<supporting-info>

## What a design contains

- **Interfaces and contracts** — the boundaries between parts and what crosses them.
- **Exact files and signatures** — name them; leave no ambiguity for whoever builds.
- **Trade-offs** — the alternatives you considered and why you chose this one.
- **Verification** — a test or typecheck command for each unit of work.

## Principles

Stable boundaries over clever internals. The simplest design that satisfies the requirements wins.

</supporting-info>
