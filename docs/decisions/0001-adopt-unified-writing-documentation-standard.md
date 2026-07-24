# ADR-0001: Adopt the Unified Writing and Documentation Standard

## Status

Accepted

## Date

2026-07-21

## Context

Agents communicate with the user through questions, acknowledgments, explanations, status updates, recommendations, error reports, and final answers. They also produce requirements, plans, designs, handoffs, reports, instructions, documentation, interface content, and public messages. No single external style guide serves every interaction, artifact, and audience. Applying several guides without authority or scope creates conflicts in terminology, normative language, accessibility claims, and editorial mechanics.

The project needs one readable, enforceable baseline without reproducing licensed standards or claiming conformance that has not been assessed.

## Decision

Adopt `.rulesync/skills/actionable-communication/references/unified-writing-documentation-standard.md` as the canonical standard for every user-visible response and produced artifact. This is first a communication contract between the user and the agent, not merely a documentation policy. Markdown is the authoritative format. DOCX, PDF, TOON, and generated provider copies are derivatives.

Resolve conflicts in this order:

1. Law, regulation, contract, and binding policy.
2. Safety and domain-specific normative standards.
3. Project terminology registry and product specification.
4. Audience and platform conventions.
5. UWDS.
6. General house style and dictionary.

Select the applicable UWDS content profile for technical documentation, interface content, government communication, journalism, long-form editorial work, academic work, medical publishing, safety information, or regulated publications. Do not mix house styles without a functional reason.

Describe work as aligned with or derived from an external anchor unless an explicit conformance assessment proves otherwise.

## Alternatives considered

### Keep a short list of messaging anchors

Rejected. A list identifies sources but does not define enforceable precedence, content profiles, procedures, terminology governance, templates, or publication checks.

### Use AP style everywhere

Rejected. AP style is for journalism and public announcements. It does not govern engineering requirements, technical procedures, interfaces, or accessibility.

### Use one controlled-language standard everywhere

Rejected. The project does not bundle proprietary dictionaries or run their official conformance processes. Strict controlled language is also unnecessary for every artifact.

## Consequences

- All agents apply UWDS to every user-visible response through `actionable-communication`.
- Global agent instructions preserve a compact precedence fallback when the skill is unavailable.
- Rulesync generation distributes the same canonical Markdown to supported provider layouts.
- Validation detects a missing source, rule ID, skill link, content profile, reference anchor, conformance guard, or generated-copy drift.
- Future changes update UWDS once and regenerate its projections.
