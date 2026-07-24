# System ontology

This plugin has one canonical authoring layer and several generated provider projections.

## System map

```text
User request
    |
    v
Orchestrator --> selects an applicable phase
    |
    v
Agent role + skills --> produces an artifact and evidence
    |
    v
Immediate receiver or user

.rulesync canonical source
    |
    +--> Claude projection
    +--> Codex projection
    `--> Grok projection
```

## Core concepts

| Concept | Meaning |
| --- | --- |
| User | Provides intent, authority, decisions, feedback, and acceptance. |
| Request | States one controlling goal and its scope. |
| Orchestrator | Selects applicable work and integrates results. |
| Agent role | Stable responsibility that owns one kind of lifecycle judgment. |
| Agent instance | Runtime execution of one agent role in one provider. |
| Skill | Reusable phase contract or method. |
| Phase | Optional lifecycle transformation owned by one agent role. |
| Response | User-visible communication governed by UWDS. |
| Artifact | Durable phase output with an owner, status, version, and scope. |
| Handoff | Point-to-point transfer of one accepted artifact. |
| Claim | Statement about behavior, status, quality, or completion. |
| Evidence | Test, rendered observation, review, measurement, or source that supports or refutes a claim. |
| Canonical source | Authoritative file under `.rulesync/`. |
| Projection | Provider-native generated representation of canonical source. |

## Canonical sources

| Source | Owns |
| --- | --- |
| `.rulesync/rules/` | Shared and provider-targeted operating rules |
| `.rulesync/subagents/` | Twelve agent role definitions |
| `.rulesync/skills/` | Thirty phase and method skills |
| `.rulesync/skills/actionable-communication/references/` | UWDS communication policy |
| `.rulesync/skills/sdlc-flow/references/` | Detailed lifecycle ontology |
| `rulesync.jsonc` | Provider targets and generated features |
| `scripts/validate.mjs` | Semantic, terminology, and projection invariants |

## Provider projections

| Provider | Generated locations |
| --- | --- |
| Claude Code | `CLAUDE.md`, `.claude/skills/`, `.claude/agents/` |
| Codex CLI | `AGENTS.md`, `.agents/skills/`, `.codex/agents/` |
| Grok CLI | `AGENTS.md`, `.grok/skills/`, `.grok/agents/` |

Codex and Grok share the root `AGENTS.md`. All three providers receive the same shared rule body.
Provider-specific frontmatter and manifests may differ when required by the host.

## Invariants

1. One canonical file controls each generated semantic body.
2. Every lifecycle phase has exactly one owning agent role.
3. Delegation never recursively assigns the same phase to itself.
4. The lifecycle is an optional graph; each actual handoff has one immediate receiver.
5. Every user-visible response applies UWDS.
6. Every completion claim has current evidence appropriate to the claim.
7. Provider metadata may differ, but generated semantic bodies remain equivalent.
8. Missing, stale, or divergent projections fail validation.

The detailed
[lifecycle ontology](.rulesync/skills/sdlc-flow/references/core-ontology.md) defines phase edges,
artifact properties, traceability, evidence states, and handoff acceptance rules.
