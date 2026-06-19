---
name: requirements-gathering
description: Start here to turn a vague, ambiguous, or high-blast-radius request into a clear, falsified spec through relentless questioning.
context: fork
agent: product-owner
---

<what-to-do>

Run the relentless interrogation from the `interrogate` skill against the requirements until the work is unambiguous — one question at a time, a recommended answer for each, exploring the codebase instead of asking when you can.

One twist: you can't reach the user — so address your questions to the main thread. Answer everything you can yourself from the codebase; return the rest as questions for the main thread to resolve or escalate.

</what-to-do>

<supporting-info>

## How to interrogate

- **Falsify every requirement** — probe reversibility, edge cases, scale, security, and internal contradictions. Try to break the requirement, not confirm it.
- **Separate functional from nonfunctional** — for each capability, pin the quality-of-service targets (latency, throughput, availability, security) and make them measurable, not adjectives.
- **Explore before asking** — if a question can be answered by reading the codebase, read it instead of asking.
- **Sharpen fuzzy language** — when a term is vague or overloaded, propose a precise canonical term.
- **Record decisions** — capture resolved terms and decisions in CONTEXT.md / ADRs as they crystallise.

## What to produce

The unresolved questions, each with your recommended answer, plus a draft spec: the problem; scope (in and out); the requirements — **functional** (what it does) and **nonfunctional / quality-of-service** (performance, reliability, security, usability), each measurable and given a stable **ID** so design, tasks, and tests can trace back to it (see [`../../GLOSSARY.md`](../../GLOSSARY.md)); and risks.

</supporting-info>
