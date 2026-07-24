---
name: requirements-gathering
description: >-
  Use when a request is ambiguous, high-blast-radius, difficult to reverse, or
  missing a material product decision.
---
<execution-contract>
This skill defines the requirements phase. Use the `product-owner` agent when a bounded requirements inquiry can proceed independently; otherwise work locally. Produce a scoped specification and surface only material unresolved decisions.
</execution-contract>

Use `lifecycle-documentation` only when the result needs a durable artifact or handoff.

<what-to-do>

Run the relentless interrogation from the `interrogate` skill against the requirements until the work is unambiguous — one question at a time, a recommended answer for each, exploring the codebase instead of asking when you can.

One twist: you can't reach the user — so address your questions to the main thread. Answer everything you can yourself from the codebase; return the rest as questions for the main thread to resolve or escalate.

When requirements accumulate exceptions or depend on a contested mental model, run `find-simplifying-insight` before freezing the specification. A simpler model is acceptable only when it preserves observed facts and survives a stated falsification test.

</what-to-do>

<supporting-info>

## How to interrogate

- **Falsify every requirement** — probe reversibility, edge cases, scale, security, and internal contradictions. Try to break the requirement, not confirm it.
- **Separate functional from nonfunctional** — for each capability, pin the quality-of-service targets (latency, throughput, availability, security) and make them measurable, not adjectives.
- **Explore before asking** — if a question can be answered by reading the codebase, read it instead of asking.
- **Cite repository evidence** — support every claim about current behavior, conventions, constraints, or feasibility with exact `path:line` references. Do not cite a whole file when specific lines establish the point.
- **Find concrete prior art** — for each substantial requirement, identify the closest existing implementation and cite the relevant lines. State what transfers, what does not, and why. If no analogue exists, show the searches or commands used and state that the requirement is precedent-free.
- **Distinguish reasoning layers** — label observations, inferences, and recommendations. An inference must name the evidence it depends on; a recommendation must state the trade-off it resolves.
- **Use external prior art selectively** — when an argument depends on framework behavior, standards, research, or ecosystem practice, cite a current primary source with its version or publication date. Repository evidence remains authoritative for what this system actually does.
- **Sharpen fuzzy language** — when a term is vague or overloaded, propose a precise canonical term.
- **Record decisions** — capture resolved terms and decisions in CONTEXT.md / ADRs as they crystallise.

## What to produce

The unresolved questions, each with your recommended answer, plus a draft spec: the problem; scope (in and out); the requirements — **functional** (what it does) and **nonfunctional / quality-of-service** (performance, reliability, security, usability), each measurable and given a stable **ID** so design, tasks, and tests can trace back to it; and risks.

Include an evidence ledger:

| Claim or requirement | Repository evidence / primary source | Interpretation | Confidence |
| --- | --- | --- | --- |
| `REQ-...` or argument | `path/to/file.ts:42` or source URL | What the evidence establishes and its limits | High / Medium / Low |

Unsupported assumptions belong in open questions, not in the specification as facts.

</supporting-info>
