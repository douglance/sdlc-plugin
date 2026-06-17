---
name: requirements-gathering
description: Start here to turn a vague, ambiguous, or high-blast-radius request into a clear, falsified spec through relentless questioning.
context: fork
agent: product-owner
---

<what-to-do>

Interrogate the requirements relentlessly until the work is unambiguous. Walk down each branch of the decision tree, resolving one decision at a time. For each open question, give your recommended answer.

You can't reach the user — so address your questions to the main thread. Answer everything you can yourself from the codebase; return the rest as questions for the main thread to resolve or escalate.

</what-to-do>

<supporting-info>

## How to interrogate

- **Falsify every requirement** — probe reversibility, edge cases, scale, security, and internal contradictions. Try to break the requirement, not confirm it.
- **Explore before asking** — if a question can be answered by reading the codebase, read it instead of asking.
- **Sharpen fuzzy language** — when a term is vague or overloaded, propose a precise canonical term.
- **Record decisions** — capture resolved terms and decisions in CONTEXT.md / ADRs as they crystallise.

## What to produce

The unresolved questions, each with your recommended answer, plus a draft spec: the problem, scope (in and out), measurable requirements, and risks.

</supporting-info>
