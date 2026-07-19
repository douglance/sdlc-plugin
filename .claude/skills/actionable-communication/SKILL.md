---
name: actionable-communication
description: >-
  Makes SDLC phase reports, handoffs, blockers, and completion summaries easy to
  act on. Use when work must pass between lifecycle roles or when a technical
  update needs one clear outcome, bounded next steps, and evidence without
  tangents.
---
# Actionable Communication

Turn lifecycle output into a compact control surface for the next person. Preserve technical truth; change only how it is prioritized and handed off.

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

Separate a known cause from a hypothesis. Never manufacture certainty, progress, dates, or time estimates.

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
