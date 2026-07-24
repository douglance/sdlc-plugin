---
targets:
  - '*'
name: actionable-communication
description: >-
  Use for consequential handoffs, blockers, completion reports, requirements,
  procedures, interface content, or formal documentation that must be easy to
  act on.
codexcli:
  interface:
    display_name: Actionable Communication
    short_description: Make SDLC handoffs easy to act on
    default_prompt: Use $actionable-communication to turn this SDLC report into a clear next action.
---

# Actionable Communication

Turn consequential communication into a compact control surface for its reader. Preserve technical truth; change only how it is prioritized and handed off. Routine conversation follows the host's lightweight communication rules without loading this skill.

## Messaging standards

Load the UWDS reference when producing or reviewing formal documentation, requirements, procedures, interface content, safety or accessibility content, or when a scoped standards question arises. For a simple status, blocker, or handoff, use the compact rules below without loading the reference.

The reference is [references/unified-writing-documentation-standard.md](references/unified-writing-documentation-standard.md). Treat it as the canonical Markdown communication baseline without claiming blanket conformance to an external standard.

Resolve conflicts in UWDS precedence order: binding authority; safety or domain standard; project terminology and product specification; audience and platform conventions; UWDS; then general house style. Use AP style only for news, press releases, and public announcements; do not use it as the default for engineering artifacts or technical procedures.

## Write in decision order

1. Lead with the outcome, blocker, or decision needed.
2. State the lifecycle phase and whether it completed, partially completed, or stopped.
3. Give the evidence that makes the status credible: artifacts, commands, results, or exact failure.
4. List unresolved items only when they affect acceptance or the next phase.
5. Name one next action only when someone must act. Name its owner when known.

For multi-step work, use a numbered list with no more than five immediate items. Keep later possibilities out of the immediate-action list.

## Make failures actionable

Report an error as:

- **Cause:** the narrowest supported explanation.
- **Evidence:** the observation, command, or artifact that supports it.
- **Remedy:** the smallest next test or change likely to unblock progress.

Separate a known cause from a hypothesis. Never manufacture certainty, progress, dates, or time estimates. Do not invent observations to complete a template. Mark missing evidence as unknown and name the smallest check that can establish it.

## Handoff contract

A phase handoff should answer:

```text
Outcome: <artifact or verified result>
Phase: <phase> - complete | partial | blocked
Evidence: <compact proof>
Open: <only acceptance-affecting unresolved items, or none>
Next: <one phase/action and owner, only if work remains>
```

Adapt the labels to the host format, but preserve the information. Do not add conversational preambles, repeated summaries, motivational framing, tangents, or closing offers.

## Preserve necessary depth

Concise does not mean incomplete. Keep details that change a decision, reproduce a defect, establish a contract, or prove completion. Move supporting detail after the outcome instead of deleting it.
