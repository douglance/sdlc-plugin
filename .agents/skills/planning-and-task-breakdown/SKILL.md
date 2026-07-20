---
name: planning-and-task-breakdown
description: >-
  Breaks work into milestones containing ordered tasks and atomic commits. Use
  when you have a spec or clear requirements and need implementable vertical
  slices, scope estimates, dependency order, or parallel work boundaries.
---
# Planning and Task Breakdown

Write the plan and its handoff with `lifecycle-documentation`.

## When to Use

- You have a spec and need to break it into implementable units
- A task feels too large or vague to start
- Work needs to be parallelized across multiple agents or sessions
- You need to communicate scope to a human
- The implementation order isn't obvious

**When NOT to use:** Single-file changes with obvious scope, or when the spec already contains well-defined tasks.

## Planning hierarchy

```text
Plan
└── Milestone: a checkpoint outcome
    └── Task: an implementable vertical slice with acceptance criteria
        └── Commit: an atomic, revertable logical change
```

A milestone contains one or more ordered tasks. A task contains one or more ordered commits. Planning names affected areas and required verification outcomes; design adds exact future file paths, signatures, and commands.

## The Planning Process

### Step 1: Enter Plan Mode

Before writing any code, operate in read-only mode:

- Read the spec and relevant codebase sections
- Identify existing patterns and conventions, citing the exact `path:line` evidence
- Find the closest implemented analogue and state what is reusable and what differs
- Map dependencies between components
- Note risks and unknowns

Record the searches used when no relevant prior art exists. Never use “the codebase does X” or “follow the existing pattern” without a concrete citation.

**Do NOT write code during planning.** The output is a plan document, not implementation.

### Step 2: Identify the Dependency Graph

Map what depends on what:

```
Database schema
    │
    ├── API models/types
    │       │
    │       ├── API endpoints
    │       │       │
    │       │       └── Frontend API client
    │       │               │
    │       │               └── UI components
    │       │
    │       └── Validation logic
    │
    └── Seed data / migrations
```

Implementation order follows the dependency graph bottom-up: build foundations first.

### Step 3: Slice Vertically

Break work into **vertical slices** — one complete feature path through every layer at a time, not all-DB-then-all-API-then-all-UI. See the `incremental-implementation` skill for the full treatment (contract-first and risk-first variants included).

**Good (vertical slicing):**
```
Task 1: User can create an account (schema + API + UI for registration)
Task 2: User can log in (auth schema + API + UI for login)
Task 3: User can create a task (task schema + API + UI for creation)
Task 4: User can view task list (query + API + UI for list view)
```

Each slice delivers working, testable functionality and becomes a task below. A task may require more than one atomic commit to reach its acceptance criteria.

### Step 4: Write Tasks

Each task follows this structure:

```markdown
## Task [N]: [Short descriptive title]

**Description:** One paragraph explaining what this task accomplishes.

**Acceptance criteria:**
- [ ] [Specific, testable condition]
- [ ] [Specific, testable condition]

**Verification:**
- [ ] Required outcome: [behavior, quality gate, or observation that proves the task]
- [ ] Evidence needed: [test result / type or build result / rendered or runtime observation]

**Dependencies:** [Task numbers this depends on, or "None"]

**Affected areas:**
- [Subsystem, boundary, or component; design supplies exact future files]

**Evidence and prior art:**
- `src/existing-flow.ts:24-61` — analogous control flow; reuse its boundary, not its persistence model
- Search with no result: `rg "alternate-flow" src tests`

**Estimated scope:** [Small: 1-2 files | Medium: 3-5 files | Large: 5+ files]

**Commits:**
1. `[atomic logical change]`
2. `[next atomic logical change, when needed]`
```

### Step 5: Order and Checkpoint

Arrange tasks so that:

1. Dependencies are satisfied (build foundation first)
2. Each task leaves the system in a working state
3. A verification checkpoint closes every milestone
4. High-risk tasks are early (fail fast)

Add explicit checkpoints:

```markdown
## Checkpoint: [Milestone outcome]
- [ ] All tests pass
- [ ] Application builds without errors
- [ ] Core user flow exercised end-to-end — the command that drives it passes, or drive it manually and screenshot the result
- [ ] Human sign-off: a person other than the agent has reviewed and approved proceeding (the agent cannot tick this itself)
```

## Task Sizing Guidelines

| Size | Files | Scope | Example |
|------|-------|-------|---------|
| **XS** | 1 | Single function or config change | Add a validation rule |
| **S** | 1-2 | One component or endpoint | Add a new API endpoint |
| **M** | 3-5 | One feature slice | User registration flow |
| **L** | 5-8 | Multi-component feature | Search with filtering and pagination |

The table sizes tasks. One commit is one revertable logical change (~100 lines — see `git-workflow-and-versioning`). A task contains however many atomic commits it needs to satisfy its acceptance criteria; if one commit grows too broad, split it without inventing another task unless the acceptance boundary also changes.

**When to break a task down further:**
- It would take more than one focused session (roughly 2+ hours of agent work)
- You cannot describe the acceptance criteria in 3 or fewer bullet points
- It touches two or more independent subsystems (e.g., auth and billing)
- You find yourself writing "and" in the task title (a sign it is two tasks)

## Plan Document Template

```markdown
# Implementation Plan: [Feature/Project Name]

## Overview
[One paragraph summary of what we're building]

## Architecture Decisions
- [Key decision 1, rationale, and exact `path:line` evidence]
- [Key decision 2, rationale, and exact `path:line` evidence]

## Prior Art and Evidence
| Claim / decision | Evidence | Interpretation and limits | Confidence |
| --- | --- | --- | --- |
| [...] | `path/to/file.ts:10-28` or primary-source URL | [...] | High / Medium / Low |

## Task List

### Milestone 1: Foundation
- [ ] Task 1: ...
  - Commit 1: ...
  - Commit 2: ...

### Checkpoint: Foundation
- [ ] Tests pass, builds clean

### Milestone 2: Core Features
- [ ] Task 2: ...
  - Commit 3: ...
- [ ] Task 3: ...
  - Commit 4: ...

### Checkpoint: Core Features
- [ ] End-to-end flow exercised — the command that drives it passes (or drive it and screenshot)

### Milestone 3: Polish
- [ ] Task 4: ...
  - Commit 5: ...
  - Commit 6: ...

### Checkpoint: Complete
- [ ] Each acceptance criterion checked against its verification command or observation
- [ ] Human sign-off obtained before review (external approval — the agent cannot tick this itself)

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | [High/Med/Low] | [Strategy] |

## Open Questions
- [Question needing human input]
```

## Parallelization Opportunities

When multiple agents or sessions are available:

- **Safe to parallelize:** Independent feature slices, tests for already-implemented features, documentation
- **Must be sequential:** Database migrations, shared state changes, dependency chains
- **Needs coordination:** Features that share an API contract (define the contract first, then parallelize)

## Verification

Before starting implementation, confirm:

- [ ] Every task has acceptance criteria
- [ ] Every task names its verification outcome and required evidence
- [ ] Every task contains one or more ordered atomic commits
- [ ] Every material claim about the repository cites exact lines of code or tests
- [ ] Each major decision names concrete prior art or records the search that found none
- [ ] Observations, inferences, and recommendations are distinguishable
- [ ] Task dependencies are identified and ordered correctly
- [ ] Checkpoints exist between milestones
- [ ] A human other than the agent has reviewed and approved the plan (external sign-off — the agent cannot tick this itself)
