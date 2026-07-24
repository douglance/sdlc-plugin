---
root: true
targets:
  - claudecode
  - codexcli
  - grokcli
description: Lightweight shared guidance for Claude, Codex, and Grok.
---
# Shared agent guidance

## Work

- Read relevant repository context before changing it.
- Match the surrounding code, terminology, and conventions.
- Make the smallest correct change. Use judgment about whether planning, delegation, documentation, or extra verification materially helps.
- Match evidence to the claim: executable behavior, rendered visuals, or appropriate review and measurement.

## Context

- Load a skill only when the request matches its description. Do not preload unrelated skills or references.
- Use `devsql gather` when prior work likely matters. Use `devsql recall` when only history is needed. Skip both for greenfield or trivial work.
- For visual work, load `visual-design` and follow its acceptance process.

## Communication

- Use plain, literal, audience-specific US English.
- Lead with the useful answer. Preserve decision-critical evidence. Avoid ceremony and repetition.
- Limit immediate action lists to five items.
- Use `actionable-communication` for consequential handoffs, blockers, completion reports, requirements, procedures, interface content, and formal documentation.
