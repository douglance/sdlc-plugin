# Core system ontology

| Field | Value |
| --- | --- |
| Identifier | SDLC-ONTOLOGY |
| Version | 1.0 |
| Effective date | 2026-07-21 |
| Status | Canonical core ontology |
| Owner | Project architecture authority |
| Scope | Agent communication, lifecycle execution, work products, evidence, and provider projection |

## Purpose

This ontology defines the smallest stable set of concepts and relationships needed to explain and validate the system. It describes what can exist, how instances connect, and which relationships are invariant.

The glossary defines the meaning of individual terms. This ontology defines relationships between those terms. Agent prompts, skill prose, and provider-specific files are implementations of this model, not independent domain authorities.

## 1. Core classes

| Class | Identity | Role in the system |
| --- | --- | --- |
| User | Human participant | Provides intent, decisions, authority, feedback, and acceptance. |
| Project | Stable project or repository identity | Owns local terminology, specifications, source, and extensions. |
| Request | Stable request or task ID when available | Expresses a desired outcome within a context. |
| Goal | Outcome statement | Defines the state the user wants to reach. |
| Scope | In-scope and out-of-scope sets | Bounds permitted work. |
| Authority | Named law, contract, policy, standard, specification, or convention | Resolves which rule governs a decision. |
| Rule | Stable rule ID or exact instruction | Constrains communication or execution. |
| Term | Preferred name with one definition | Identifies one project concept. |
| ContentProfile | Stable profile name | Selects channel-specific rules on top of UWDS. |
| Host | Runtime that invokes the system | Exposes tools, context, delegation, and provider capabilities. |
| Orchestrator | Coordinating agent instance | Selects work, preserves context, and integrates results. |
| AgentRole | Stable role name | Owns one kind of lifecycle judgment. |
| AgentInstance | Runtime execution of an agent role | Performs bounded work in a host context. |
| Skill | Stable skill name | Encapsulates a reusable method or a lifecycle phase contract. |
| Phase | Stable lifecycle phase name | Transforms accepted inputs into one primary artifact. |
| Artifact | Stable artifact ID and version | Carries durable information between phases. |
| Requirement | Stable requirement ID | States an obligated, observable behavior or constraint. |
| Decision | Stable decision ID | Records a selected option and its rationale. |
| Change | Commit, patch, configuration mutation, or external write | Alters system state. |
| Claim | Testable statement | Describes behavior, status, quality, or completion. |
| Evidence | Stable test, observation, source, or artifact reference | Supports or refutes a claim. |
| Validation | Named check with a result | Evaluates an artifact, change, claim, or projection. |
| Handoff | Transfer record | Moves one accepted artifact to one immediate receiver. |
| Receiver | User or phase-owning agent role | Accepts or rejects a response, artifact, or handoff. |
| Response | User-visible communication instance | Answers a request and is governed by UWDS. |
| Action | Bounded operation | Changes or inspects state within authority and scope. |
| Warning | Response associated with a hazardous action | States the hazard, consequence, and avoidance action before exposure. |
| ErrorReport | Response associated with a failed action or state | Distinguishes cause, evidence, and recovery. |
| CanonicalSource | Authoritative source path and version | Generates semantically equivalent provider files. |
| Projection | Provider-specific generated file | Represents canonical source in a host-native format. |
| Feedback | User, runtime, test, or production observation | Re-enters the lifecycle as evidence or a new request. |

## 2. Core relationships

Cardinality uses `1`, `0..1`, `0..*`, and `1..*`.

| Subject | Relationship | Object | Cardinality | Constraint |
| --- | --- | --- | --- | --- |
| User | submits | Request | User `1` -> Request `0..*` | The system MUST preserve the user's meaning and required format. |
| Request | seeks | Goal | Request `1` -> Goal `1` | A request has one controlling outcome, even when it contains several tasks. |
| Request | is bounded by | Scope | Request `1` -> Scope `1` | Out-of-scope work is a hard boundary unless the user changes it. |
| Request | is governed by | Authority | Request `1` -> Authority `1..*` | Higher applicable authority overrides lower authority. |
| Authority | defines | Rule | Authority `1` -> Rule `1..*` | A local synthesis MUST NOT misrepresent an external conformance claim. |
| Project | controls | Term | Project `1` -> Term `0..*` | One preferred term identifies one project concept. |
| Host | runs | AgentInstance | Host `1` -> AgentInstance `0..*` | Host capability determines whether delegation is available. |
| AgentInstance | instantiates | AgentRole | AgentInstance `1` -> AgentRole `1` | Runtime identity and role are distinct. |
| Orchestrator | selects | Phase | Orchestrator `1` -> Phase `0..*` | Select the smallest phase that fits the work. |
| Phase | is owned by | AgentRole | Phase `1` -> AgentRole `1` | One role owns each phase contract. |
| AgentRole | uses | Skill | AgentRole `1` -> Skill `1..*` | Skills supply reusable methods; they do not become additional phase owners. |
| Phase | consumes | Artifact | Phase `1` -> Artifact `0..*` | The phase MUST reject an input that fails its acceptance gate. |
| Phase | produces | Artifact | Phase `1` -> Artifact `1..*` | One artifact is primary; supporting evidence can be separate artifacts. |
| Artifact | contains or references | Scope | Artifact `1` -> Scope `1` | The out-of-scope set travels unchanged across handoffs. |
| Artifact | records | Decision | Artifact `1` -> Decision `0..*` | Consequential decisions use stable IDs. |
| Artifact | specifies | Requirement | Artifact `1` -> Requirement `0..*` | Each normative requirement is testable or traceable to a testable parent. |
| Requirement | is realized by | Change | Requirement `1` -> Change `0..*` | A planned requirement can have no realization yet. |
| Requirement | is verified by | Evidence | Requirement `1` -> Evidence `0..*` | A completed requirement needs verification evidence. |
| Change | produces | Claim | Change `1` -> Claim `1..*` | Claims describe the intended and observed effects of the change. |
| Evidence | supports or refutes | Claim | Evidence `1` -> Claim `1..*` | Evidence records its source, context, and result. |
| Validation | evaluates | Claim | Validation `1` -> Claim `1..*` | A validation result is pass, fail, blocked, or not applicable. |
| Handoff | transfers | Artifact | Handoff `1` -> Artifact `1` | One handoff transfers one primary versioned artifact. |
| Handoff | names | Receiver | Handoff `1` -> Receiver `1` | A handoff has one immediate receiver, not a distribution list. |
| CanonicalSource | generates | Projection | CanonicalSource `1` -> Projection `1..*` | Provider files MUST preserve the canonical semantic body. |
| Validation | checks | Projection | Validation `1` -> Projection `1..*` | Drift or stale projections fail validation. |
| Feedback | supports | Claim | Feedback `1` -> Claim `0..*` | Feedback becomes evidence when its source and context are retained. |
| Feedback | creates | Request | Feedback `1` -> Request `0..*` | Production learning can begin a new lifecycle traversal. |

In this repository, the project is the SDLC plugin, canonical source is `.rulesync/`, and a receiver is a phase owner or the user.

## 3. Authority and communication model

Every user-visible response is communication governed by UWDS. A response becomes a lifecycle artifact only when it is durable phase output.

| Priority | Authority class | Relationship to lower classes |
| ---: | --- | --- |
| 1 | Law, regulation, contract, binding policy | Overrides all lower authorities within scope. |
| 2 | Safety or domain-specific normative standard | Overrides project and editorial rules for its domain. |
| 3 | Project terminology registry and product specification | Controls local concepts, identifiers, and behavior. |
| 4 | Audience and platform convention | Controls familiar interaction and channel behavior. |
| 5 | UWDS | Supplies the default communication and conflict-resolution rules. |
| 6 | General house style and dictionary | Resolves only questions left open above. |

The communication relationships are:

| Subject | Relationship | Object | Invariant |
| --- | --- | --- | --- |
| AgentInstance | communicates with | User | Every visible message applies UWDS. |
| Response | answers | Request | Lead with the useful answer, action, blocker, or decision. |
| Response | preserves | Evidence | Include evidence that changes acceptance or the next action. |
| Response | applies | ContentProfile | Use the profile matching the audience, artifact, and channel. |
| Warning | precedes | Action | Do not reveal a hazard warning after exposure. |
| ErrorReport | identifies | Claim | Distinguish a verified cause claim from a hypothesis. |
| ErrorReport | provides | Action | Name the smallest supported recovery action. |

UWDS applies silently. An agent SHOULD name UWDS or an external anchor only when the user asks about the standard, when a consequential conflict requires explanation, or when a conformance claim is under review.

## 4. Execution model

| Concept | Relationship rule |
| --- | --- |
| Orchestration | The main agent coordinates the request, selects the next bounded action, and integrates results. |
| Delegation | When named agents are available, the orchestrator MAY create one agent instance for one bounded phase. |
| Local execution | When delegation is unavailable or the current agent already owns the phase, the current agent executes locally. |
| Recursion guard | An agent MUST NOT delegate the same phase to itself or create an ownership cycle. |
| Context | The receiver gets the accepted artifact, current scope, governing decisions, and evidence needed for its phase. |
| Method | Work follows `HYPOTHESIZE -> TEST -> IMPLEMENT -> VERIFY`, tailored to the task. |
| Completion | A phase is complete only when its acceptance checks pass and its required artifact and evidence exist. |
| Blocked state | A phase is blocked only when a missing decision, authority, credential, or external condition prevents safe progress. |

## 5. Lifecycle phase ontology

The lifecycle is a directed graph, not a mandatory waterfall. A request can enter at the smallest applicable phase and can skip phases that do not apply.

| Phase | Owner | Primary input | Primary output | Default next relationship |
| --- | --- | --- | --- | --- |
| `feasibility-analysis` | `researcher` | Idea or unfamiliar problem | Sourced options and constraints | informs `requirements-gathering` |
| `requirements-gathering` | `product-owner` | Request and feasibility evidence | Stress-tested scoped specification | authorizes `planning` |
| `planning` | `project-manager` | Accepted specification | Milestones, dependencies, risks, scope | structures `design` |
| `design` | `architect` | Specification and plan | Interfaces, decisions, files, verification contracts | constrains `implementation` |
| `visual-design` | `graphic-designer` | User tasks and current surface | Approved targets and rendered evidence | constrains `implementation` and `quality` |
| `implementation` | `engineer` | Accepted design and plan | Tested bounded changes | supplies `testing` |
| `testing` | `tester` | Change, specification, prior tests | Adversarial verdict and reproducible cases | supplies `quality` |
| `quality` | `quality-engineer` | Change, specification, test evidence | Verification and validation verdict | authorizes `deployment` |
| `deployment` | `release-engineer` | Green exact version and release criteria | Deployed version, smoke evidence, rollback path | creates operated system |
| `operations` | `sre` | Deployed system and operating targets | SLOs, runbooks, incident and telemetry evidence | creates feedback |
| `documentation` | `technical-writer` | Shipped behavior and verified interfaces | Documentation validated against reality | supports users and maintainers |
| `maintenance` | `maintainer` | Working system and bounded debt or defect | Behavior-preserving change and proof | re-enters `testing` or `quality` |

The following edges are conditional:

| Source | Condition | Destination |
| --- | --- | --- |
| Any phase | Requirement or assumption fails | `requirements-gathering` |
| Any phase | Root cause is unknown | `debugging-and-error-recovery` |
| Any phase | Security boundary is material | `security-and-hardening` |
| Any phase | Performance claim is material | `performance-optimization` |
| Design or implementation | User-visible state changes | `visual-design` |
| Operations | Incident or recurring toil | `maintenance`, `implementation`, or `requirements-gathering` |
| Quality | Release criteria fail | Owning phase for the failed criterion |

## 6. Skill ontology

There are two skill kinds:

| Skill kind | Defines | Does not define |
| --- | --- | --- |
| Phase skill | Owner, accepted inputs, primary output, gate, and next relationship | A universal requirement to run every phase |
| Method skill | Reusable practice such as testing, security, communication, documentation, debugging, or simplification | Independent lifecycle ownership |

`actionable-communication` and `lifecycle-documentation` are cross-cutting methods:

- `actionable-communication` governs every user-visible response and handoff.
- `lifecycle-documentation` governs durable phase artifacts and their acceptance gates.
- A conversational response is not automatically a lifecycle document.
- A lifecycle document is always also a communication artifact.

## 7. Artifact and traceability ontology

An artifact has:

| Required property | Relationship |
| --- | --- |
| Identity | `Artifact has_id StableIdentifier` |
| Version | `Artifact has_version Version` |
| Status | `Artifact has_status ArtifactState` |
| Ownership | `Artifact is_owned_by AgentRole` |
| Provenance | `Artifact derives_from Request or Artifact` |
| Governance | `Artifact is_governed_by Authority` |
| Scope | `Artifact carries Scope` |
| Evidence | `Artifact cites Evidence` |
| Handoff | `Artifact is_transferred_by Handoff` when another phase consumes it |

Traceability is a graph, not a document section:

| Source node | Required edge | Target node |
| --- | --- | --- |
| Request | `seeks` | Goal |
| Goal | `is_refined_into` | Requirement |
| Requirement | `is_addressed_by` | Decision or Change |
| Decision | `constrains` | Change |
| Change | `is_checked_by` | Validation |
| Validation | `produces` | Evidence |
| Evidence | `supports_or_refutes` | Requirement or Claim |

A completed claim without an evidence path is unsupported. A changed requirement without a downstream trace is orphaned.

## 8. Evidence and knowledge model

The system distinguishes four epistemic states:

| State | Meaning | Permitted language |
| --- | --- | --- |
| Unknown | No adequate observation exists. | State what is missing. |
| Hypothesis | A falsifiable explanation or expectation exists. | Label it as a hypothesis. |
| Observed | A source, command, test, or runtime observation exists. | State the observation and context. |
| Verified | Defined acceptance checks pass against current evidence. | State the scope and exact verification. |

An observation does not automatically prove a general claim. Verification is scoped to the version, environment, inputs, and oracle recorded by the validation.

## 9. State models

| Entity | Valid states | Valid transitions |
| --- | --- | --- |
| Request | received, clarified, accepted, completed, blocked, superseded | received -> clarified or accepted; accepted -> completed or blocked; any active state -> superseded |
| Phase execution | selected, running, verifying, complete, blocked | selected -> running -> verifying -> complete; running or verifying -> blocked |
| Artifact | draft, in review, approved, rejected, superseded | draft -> in review -> approved or rejected; approved -> superseded |
| Claim | unknown, hypothesized, observed, verified, refuted | unknown -> hypothesized; hypothesized -> observed; observed -> verified or refuted |
| Projection | absent, generated, current, stale, invalid | absent -> generated -> current; current -> stale; generated or stale -> invalid or current |

## 10. Source and projection model

| Layer | Canonical content | Projection relationship |
| --- | --- | --- |
| `.rulesync/skills/` | Skill contracts and skill references | Generates Claude, Codex, and Grok skill layouts. |
| `.rulesync/subagents/` | Agent role contracts | Generates Claude, Codex, and Grok agent profiles. |
| `.rulesync/rules/` | Shared and provider-targeted rules | Generates provider-native agent instructions. |
| `scripts/validate.mjs` | Semantic repository invariants | Rejects missing, divergent, or stale projections. |

Provider-specific frontmatter and sidecars MAY vary. The semantic body, ownership, scope, and relationships MUST remain equivalent to the canonical source.

## 11. Core invariants

| ID | Invariant |
| --- | --- |
| ONT-INV-001 | One canonical source controls each generated semantic body. |
| ONT-INV-002 | Every lifecycle phase has exactly one owning agent role. |
| ONT-INV-003 | Delegation never recursively assigns the same phase to itself. |
| ONT-INV-004 | Every request has one controlling goal and one explicit scope. |
| ONT-INV-005 | The out-of-scope set survives every phase handoff unless the user changes it. |
| ONT-INV-006 | Every user-visible response applies UWDS. |
| ONT-INV-007 | External standards are scoped authorities, not blanket conformance claims. |
| ONT-INV-008 | Every completion claim has current, relevant evidence. |
| ONT-INV-009 | Every normative requirement is testable or traces to a testable parent. |
| ONT-INV-010 | Every phase handoff names one immediate receiver and one primary artifact. |
| ONT-INV-011 | A failed acceptance gate returns work to the owning source; receivers do not guess. |
| ONT-INV-012 | Generated projections that diverge from canonical semantics are invalid. |

## 12. Deliberate exclusions

The core ontology does not define:

- provider-specific model names, colors, or tool syntax;
- a mandatory requirement to run all lifecycle phases;
- business-domain concepts owned by a target project;
- official conformance to an external standard;
- a database schema, serialization format, or knowledge-graph technology;
- implementation details that do not change a system relationship.

Extensions MAY add project-domain classes and relationships. An extension MUST preserve the core invariants and MUST use the project terminology registry for its names.

## Handoff

Receiver: Repository maintainer
Accepted inputs: Repository version 0.5.1; UWDS 1.0; current phase and agent contracts
Decisions: SDLC-ONTOLOGY defines the canonical core relationships and invariants
Produced outputs: Core ontology version 1.0
Verification evidence: `pnpm validate`; canonical-to-provider content parity
Open items: None
Acceptance checks: Confirm all 12 phase-owner mappings, all ontology invariants, and all three generated provider copies
