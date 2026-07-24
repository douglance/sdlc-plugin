# Unified Writing and Documentation Standard

| Field | Value |
| --- | --- |
| Identifier | UWDS |
| Version | 1.0 |
| Effective date | 2026-07-21 |
| Status | Unified baseline |
| Applies to | Selected consequential assistant communication, documentation, interfaces, specifications, procedures, public communications, and supporting content |
| Owner | Project documentation authority |

> **Purpose:** UWDS consolidates the standards and guides reviewed for this project into one usable system. It resolves overlap by assigning each source a defined role instead of combining incompatible house styles.
>
> **Interpretation:** UWDS is a synthesis and implementation standard. It does not reproduce proprietary publications or replace laws, contracts, accessibility regulations, or licensed source standards.

## 1. Purpose and scope

UWDS governs how information is communicated so that people can find, understand, trust, and use it. It applies when selected for consequential assistant communication, formal documentation, software interfaces, requirements, procedures, announcements, and reference material. Routine conversation may use the host's lighter communication defaults.

> **UWDS-SCOPE-001 MUST:** Authors MUST identify the intended audience, user task, delivery medium, and consequence of misunderstanding before drafting.
>
> **UWDS-SCOPE-002 MUST:** Content MUST be accurate, relevant, findable, understandable, usable, and maintainable for its intended audience.
>
> **UWDS-SCOPE-003 MUST:** Authors MUST apply the content profile in section 18 when a domain-specific style is required.
>
> **UWDS-SCOPE-004 MUST:** A project MAY define stricter local rules, but it MUST document and apply them consistently.
>
> **UWDS-SCOPE-005 MUST:** Assistants MUST apply UWDS when the governing communication profile or task explicitly selects it.

UWDS includes concepts, tutorials, how-to guides, references, interface content, requirements, architecture decisions, API contracts, runbooks, release notes, policy content, accessible documents, forms, tables, media alternatives, and safety messages. It does not determine product behavior, legal duties, scientific truth, brand identity, or accessibility conformance by itself.

## 2. Conformance, authority, and precedence

Apply the highest applicable authority. Do not treat a legal requirement, safety rule, platform convention, and editorial preference as interchangeable.

| Priority | Authority | Application |
| --- | --- | --- |
| 1 | Law, regulation, contract, and binding policy | Follow exactly within its scope. |
| 2 | Safety and domain-specific normative standard | Apply when the relevant hazard, regulated field, or formal publication type exists. |
| 3 | Project terminology registry and product specification | Control product names, domain concepts, capitalization, identifiers, and definitions. |
| 4 | Audience and platform conventions | Apply conventions familiar to the target audience and platform. |
| 5 | UWDS | Use as the general operating and conflict-resolution standard. |
| 6 | General house style and dictionary | Use only when a higher authority is silent. |

> **UWDS-AUTH-001 MUST:** When rules conflict, authors MUST follow the higher-priority authority and record any consequential exception.
>
> **UWDS-AUTH-002 MUST:** The project terminology registry MUST override general editorial preferences for project-specific concepts.
>
> **UWDS-AUTH-003 MUST:** Authors MUST NOT apply AP, Chicago, APA, MLA, AMA, Apple, Google, Microsoft, or GOV.UK rules outside their intended context when doing so reduces clarity or conflicts with a higher authority.
>
> **UWDS-AUTH-004 MUST:** Clarity and consistency MAY justify a documented exception to a nonbinding style preference. They do not justify violating a legal, contractual, safety, or accessibility requirement.

| Conformance level | Meaning |
| --- | --- |
| Required | All applicable MUST and MUST NOT statements are satisfied. |
| Recommended | Required rules and applicable SHOULD statements are satisfied, or deviations are justified. |
| Enhanced | Recommended conformance plus usability testing, accessibility review, terminology validation, and task-success evidence. |

Do not claim that content conforms to, complies with, or meets a named level of an external standard unless the scope, version, tests, exceptions, and evidence are explicit. Otherwise use `aligned with`, `guided by`, `based on`, or `derived from`.

## 3. Governing principles

| Principle | Operational meaning |
| --- | --- |
| Relevant | Include what the audience needs to achieve the purpose. |
| Findable | Use the titles, hierarchy, labels, keywords, navigation, and references that readers expect. |
| Understandable | Use familiar language, stable terminology, explicit relationships, and logical order. |
| Usable | Enable the reader to act, decide, verify, recover, or learn without hidden assumptions. |
| Accurate | Validate facts, commands, examples, interfaces, references, and outcomes. |
| Accessible | Support assistive technology and reduce avoidable cognitive demand. |
| Consistent | Use one term, format, and interaction pattern for one meaning. |
| Maintainable | Make ownership, review, reuse, versioning, and retirement practical. |
| Testable | Define observable success for procedures, requirements, and critical information. |

> **UWDS-CORE-001 MUST:** Content MUST lead with the information or action that matters most to the intended audience.
>
> **UWDS-CORE-002 MUST:** Content MUST expose the actor, action, object, condition, and expected result whenever they affect correct interpretation.
>
> **UWDS-CORE-003 MUST:** Critical information MUST NOT depend only on implication, color, position, memory, or prior exposure.
>
> **UWDS-CORE-004 MUST:** Concision MUST NOT remove information required for safety, correctness, consent, compliance, or successful task completion.

## 4. Audience, purpose, and context

Define the primary audience by its goals, knowledge, environment, constraints, language, accessibility needs, and frequency of use. Write for the audience's task knowledge, not the author's organization.

> **UWDS-AUD-001 MUST:** Every substantial document MUST state or internally record its primary audience and intended outcome.
>
> **UWDS-AUD-002 MUST:** Authors MUST organize content around the audience's task.
>
> **UWDS-AUD-003 MUST:** Content for mixed audiences MUST layer information: immediate answer first, explanation second, specialist detail last.

State prerequisites before the first action. Distinguish required access, knowledge, tools, data, permissions, and environment. Identify irreversible actions and limits before they affect the reader. Provide recovery or escalation when a task can fail.

## 5. Terminology and controlled language

> **UWDS-TERM-001 MUST:** Use one preferred term for one project concept. Do not alternate synonyms for variety.
>
> **UWDS-TERM-002 MUST:** Each approved term MUST have one definition that distinguishes it from adjacent concepts.
>
> **UWDS-TERM-003 MUST:** A definition MUST name the broader category and the distinguishing characteristic.
>
> **UWDS-TERM-004 MUST:** Define an unfamiliar abbreviation at first use unless it is unambiguous for the audience and context.
>
> **UWDS-TERM-005 MUST:** Do not create an abbreviation that saves little space, appears infrequently, or conflicts with an existing term.
>
> **UWDS-TERM-006 MUST:** Normative words MUST keep the same meaning throughout a specification.

Prefer familiar words such as `use`, `start`, `stop`, `change`, `send`, `receive`, `before`, `after`, and `because`. Use literal language in operational content. Avoid idioms, jokes, metaphors, cultural references, and ambiguous technical words. Name the actor when responsibility matters. Use respectful, precise, inclusive terminology and mention personal characteristics only when relevant.

## 6. Sentences, paragraphs, voice, and tone

> **UWDS-SENT-001 MUST:** Use active voice when the actor or responsibility matters.
>
> **UWDS-SENT-002 MUST:** Use present tense for current behavior and instructions unless another time relationship is necessary.
>
> **UWDS-SENT-003 MUST:** Prefer direct subject-verb-object order.
>
> **UWDS-SENT-004 MUST:** Break a sentence that contains several actions, conditions, exceptions, or nested clauses.
>
> **UWDS-SENT-005 MUST:** Avoid double negatives and stacked qualifications.
>
> **UWDS-SENT-006 MUST:** Include `that` or `who` when omission could create ambiguity.

Use second person and the imperative for procedures, name the system when describing behavior, and name the obligated component in requirements. Start paragraphs with the controlling idea and keep one main idea per paragraph. Use a calm, competent, respectful tone.

> **UWDS-TONE-001 MUST:** Content MUST NOT blame the user for a system limitation or error.
>
> **UWDS-TONE-002 MUST:** Critical content MUST prioritize clarity over personality, humor, or brand flourish.

## 7. Information architecture and modular content

| Topic type | Purpose | Typical contents |
| --- | --- | --- |
| Concept | Explain what or why | Definition, context, relationships, model, constraints, examples |
| Task | Help complete a goal | Outcome, prerequisites, steps, verification, recovery |
| Reference | Provide precise facts | Parameters, fields, options, limits, syntax, tables |
| Troubleshooting | Diagnose and recover | Symptom, cause, checks, resolution, escalation |
| Glossary | Control terminology | Preferred term, definition, aliases, prohibited forms |

> **UWDS-IA-001 MUST:** Each topic MUST have one primary purpose and a title that predicts its contents.
>
> **UWDS-IA-002 MUST:** Required task steps MUST NOT exist only inside conceptual prose.
>
> **UWDS-IA-003 MUST:** Reusable content MUST remain understandable outside its original page or declare its dependency.
>
> **UWDS-IA-004 MUST:** Navigation labels and headings MUST use terms that users search for and encounter in the product.

Use a logical heading hierarchy without skipped levels. Use descriptive, parallel headings. Put the minimum sufficient answer first, followed by details, edge cases, rationale, and references.

## 8. Procedures and instructions

Every procedure should state the outcome, list prerequisites and permissions, present actions in order, put conditions before governed actions, show expected results at meaningful checkpoints, and provide recovery when failure is plausible.

> **UWDS-PROC-001 MUST:** Each numbered step MUST contain an action or immediate result that supports the next action.
>
> **UWDS-PROC-002 MUST:** Use one primary action per step. Separate actions when the reader must observe, decide, or change context.
>
> **UWDS-PROC-003 MUST:** Put required warnings before the hazardous action.
>
> **UWDS-PROC-004 MUST:** Label optional steps and explain when they apply.
>
> **UWDS-PROC-005 MUST:** Provide a visible or testable expected result instead of making the reader infer success.

Use decision tables or labeled branches for conditional procedures. Provide complete, safe, copyable commands; identify execution context and privileges; distinguish placeholders from literal values; state expected output; and test examples against the documented environment.

## 9. Requirements and specifications

Use the BCP 14 meanings from RFC 2119 and RFC 8174 only when uppercase keywords are declared normative.

| Keyword | Meaning |
| --- | --- |
| MUST, REQUIRED, SHALL | Absolute requirement |
| MUST NOT, SHALL NOT | Absolute prohibition |
| SHOULD, RECOMMENDED | Default choice; deviation requires a valid reason and understood consequences |
| SHOULD NOT, NOT RECOMMENDED | Normally prohibited; deviation requires a valid reason and understood consequences |
| MAY, OPTIONAL | Permitted choice |

> **UWDS-REQ-001 MUST:** A specification using BCP 14 keywords MUST include the RFC 2119 and RFC 8174 declaration or an explicit equivalent.
>
> **UWDS-REQ-002 MUST:** Each requirement MUST identify the obligated actor and an observable behavior, state, output, or constraint.
>
> **UWDS-REQ-003 MUST:** Requirements MUST be individually testable or traceable to a testable parent requirement.
>
> **UWDS-REQ-004 MUST:** Do not use SHOULD to avoid a decision. State the permitted exception and consequences.
>
> **UWDS-REQ-005 MUST:** Do not use vague qualifiers such as `fast`, `secure`, `appropriate`, `soon`, or `user-friendly` without measurable or reviewable criteria.
>
> **UWDS-REQ-006 SHOULD:** State non-obvious security and safety consequences of violating a requirement.

Use this pattern: `[Identifier] [Actor] MUST [behavior] [condition] [measurable constraint].` Record status, version, owner, source or rationale, dependencies, verification, and exceptions separately.

## 10. Developer and API documentation

> **UWDS-DEV-001 MUST:** Documentation MUST state the supported product, API, language, or runtime version when behavior can vary.
>
> **UWDS-DEV-002 MUST:** Examples MUST be syntactically valid, internally consistent, and limited to the concept demonstrated.
>
> **UWDS-DEV-003 MUST:** Production examples MUST NOT contain real credentials, secrets, personal data, or unsafe defaults.
>
> **UWDS-DEV-004 MUST:** Code identifiers, API names, commands, paths, and literals MUST preserve exact spelling and capitalization.
>
> **UWDS-DEV-005 MUST:** A deprecated feature MUST identify its replacement, migration path, and known removal timeline.

An API reference must cover purpose, identifier, authorization, request, fields and constraints, response schema and status codes, errors and recovery, and applicable idempotency, pagination, rate limits, retries, ordering, versioning, compatibility, security, and data handling. Errors need a stable code, meaning, cause, resolution, and retry behavior.

## 11. User-interface and product content

> **UWDS-UI-001 MUST:** A control label MUST describe the action or destination in the user's vocabulary.
>
> **UWDS-UI-002 MUST:** Use the same label for the same action throughout the product.
>
> **UWDS-UI-003 SHOULD:** Button labels SHOULD begin with a specific verb when the control performs an action.
>
> **UWDS-UI-004 MUST:** Avoid generic labels such as `OK`, `Submit`, `Continue`, or `Yes` when a specific action label is practical.
>
> **UWDS-UI-005 MUST:** An irreversible action MUST name the affected object and require proportionate confirmation.

An error message states what happened, gives the next useful action, preserves entered data when possible, includes a diagnostic identifier when useful, and does not expose sensitive internals. Empty states explain purpose, why the state is empty, and the best next action. Do not put critical information only in a transient message.

## 12. Accessibility and cognitive usability

WCAG 2.2 is the formal web-accessibility baseline when applicable. W3C cognitive accessibility guidance and W3C clear-content patterns supplement conformance with practices that improve comprehension and task success.

> **UWDS-A11Y-001 MUST:** Digital content MUST use programmatically determinable headings, lists, tables, labels, relationships, and reading order where supported.
>
> **UWDS-A11Y-002 MUST:** Meaning MUST NOT depend on color, sensory location, shape, sound, or visual styling alone.
>
> **UWDS-A11Y-003 MUST:** Links MUST describe their destination or action without surrounding text whenever practical.
>
> **UWDS-A11Y-004 MUST:** Informative images MUST have equivalent text alternatives. Decorative images SHOULD be ignored by assistive technology.
>
> **UWDS-A11Y-005 MUST:** Tables MUST identify header cells and MUST NOT be used only for visual layout.
>
> **UWDS-A11Y-006 MUST:** Instructions MUST identify required inputs, constraints, errors, and corrections in text.

Use common and literal words, short separated blocks, distinct steps and decisions, explicit relationships, summaries, predictable paths, and visible point-of-use information. Forms need visible labels, advance format guidance, named groups, nearby error messages, retained valid input, and accessible time limits. Documents and media need correct structure, reading order, captions, transcripts, descriptions, and representative keyboard and assistive-technology testing.

## 13. Safety and risk communication

> **UWDS-SAFE-001 MUST:** Physical product safety messages MUST follow applicable law and the governing safety-message standard. Do not invent severity categories or signal-word meanings.
>
> **UWDS-SAFE-002 MUST:** A warning MUST identify the hazard, consequence, and avoidance action in that order or another demonstrably clearer order.
>
> **UWDS-SAFE-003 MUST:** Place a warning immediately before the action or condition that creates the risk.
>
> **UWDS-SAFE-004 MUST:** Do not dilute high-severity warnings by using warning styling for ordinary tips.
>
> **UWDS-SAFE-005 MUST:** Security warnings MUST identify the affected asset, threat or failure mode, and safe alternative without unnecessary exploitable detail.

Distinguish physical safety, security, data loss, caution, and ordinary notes. Use ANSI Z535.6 only for actual physical hazards and only with the licensed standard and governing requirements available.

## 14. Numbers, dates, times, and units

> **UWDS-DATE-001 MUST:** Machine-readable dates and timestamps MUST use an applicable ISO 8601 representation.
>
> **UWDS-DATE-002 SHOULD:** Human-facing dates SHOULD spell the month when a numeric form could be ambiguous.
>
> **UWDS-DATE-003 MUST:** A timestamp that can cross time zones MUST include an offset or named time zone.
>
> **UWDS-DATE-004 MUST:** Durable content MUST NOT use a relative date without also supplying the absolute date.

Use numerals for measurements, versions, percentages, dates, times, money, and technical values unless a domain style requires otherwise. Preserve source precision, use a leading zero for values below one when appropriate, and keep numbers with their units.

> **UWDS-UNIT-001 MUST:** Use the International System of Units unless law, contract, audience, or domain convention requires another system.
>
> **UWDS-UNIT-002 MUST:** Put a space between a value and unit symbol except where SI specifies otherwise.
>
> **UWDS-UNIT-003 MUST:** Do not pluralize unit symbols or add a period unless the symbol ends a sentence.
>
> **UWDS-UNIT-004 MUST:** Use approved unit symbols, prefixes, capitalization, and powers.

State whether range endpoints are inclusive and separate measured values from tolerances.

## 15. Formatting and editorial mechanics

Use sentence-style capitalization for headings and interface text unless a profile requires another convention. Preserve official product names and identifiers. Use punctuation to clarify structure. Use the serial comma where required by the selected profile or to prevent ambiguity, and remain consistent.

> **UWDS-FMT-001 MUST:** List items MUST be grammatically parallel.
>
> **UWDS-FMT-002 MUST:** Use numbered lists for sequence, priority, or referenced steps and bullets for unordered items.
>
> **UWDS-FMT-003 MUST:** Introduce a list with a sentence that explains the relationship among its items.

Use tables for comparisons or structured lookup, not long narrative or visual layout. Use monospace for code, commands, paths, identifiers, and literals. Document placeholder syntax. Use emphasis sparingly and never as a substitute for hierarchy.

## 16. Links, citations, and attribution

> **UWDS-LINK-001 MUST:** Link text MUST describe the destination, document, or action. Avoid `click here` and bare URLs in ordinary prose.
>
> **UWDS-LINK-002 MUST:** State special behavior when a link downloads a file, opens an external application, prompts for authentication, or performs a destructive action.
>
> **UWDS-LINK-003 MUST:** Do not repeat one destination through adjacent links.

Use the citation system required by the publication profile. Prefer primary and authoritative sources for technical, legal, scientific, and standards claims. Distinguish normative sources from commentary, preserve version information that affects reproducibility, identify unresolved disagreement, and never cite a source for an unsupported claim.

## 17. Globalization and localization

> **UWDS-GLOB-001 MUST:** Avoid idioms, puns, culturally narrow references, and ambiguous pronouns in content intended for localization.
>
> **UWDS-GLOB-002 MUST:** Do not build sentences from runtime fragments that can produce ungrammatical word order in another language.
>
> **UWDS-GLOB-003 MUST:** Keep variables out of inflected words and give translators enough context for meaning, grammar, and interface constraints.
>
> **UWDS-GLOB-004 MUST:** Do not embed text in images when it must be translated or read by assistive technology.
>
> **UWDS-GLOB-005 MUST:** Localize dates, times, numbers, currency, names, addresses, and units according to product policy while retaining an unambiguous machine representation.

Use complete sentences where practical, avoid long noun stacks, keep terminology stable, and allow layout expansion.

## 18. Content profiles

UWDS supplies the baseline. Select one primary profile for specialized content and do not mix house styles without a functional reason.

| Profile | Primary anchors | Scope and limits |
| --- | --- | --- |
| Consequential assistant communication | UWDS; user communication preferences; required response format | Apply to handoffs, blockers, completion reports, requirements, procedures, interface content, and formal documentation. Match the user's task and level, preserve needed evidence, and avoid ceremony or unnecessary cognitive load. |
| Technical and developer documentation | Google Developer Documentation Style Guide; Microsoft technical guidance; ISO/IEC/IEEE 26514; IEC/IEEE 82079-1; OASIS DITA 1.3 | Prefer executable examples, task orientation, modular topics, and technical validation. |
| Apple-platform content | Apple Style Guide | Use Apple terminology and interface conventions only for Apple contexts. |
| General product and UI content | Microsoft Writing Style Guide and platform conventions | Use concise, action-oriented interface language; platform labels override generic wording. |
| Government public content | Applicable law; Plain Writing Act guidance; GOV.UK patterns where useful | Jurisdiction-specific duties override house style. Test understanding. |
| News and public announcements | AP Stylebook | AP controls journalistic mechanics, not engineering requirements or technical procedures. |
| Long-form editorial work | The Chicago Manual of Style | Use for publishing mechanics, citations, and editorial disputes when higher rules are silent. |
| Behavioral and social sciences | APA Style | Use the required edition for scholarly conventions. |
| Humanities | MLA Handbook | Use for humanities research and source documentation. |
| Medical and scientific publishing | AMA Manual of Style or required journal style | Clinical, scientific, ethical, statistical, and nomenclature rules override general preferences. |
| Physical safety information | ANSI Z535.6 and governing safety rules | Use only for actual hazards and follow the licensed source exactly. |
| Regulated technical publications | S1000D | Use when contractual, defense, aerospace, or lifecycle requirements justify the overhead. |

> **UWDS-PROFILE-001 MUST:** A project MUST declare the profiles that apply and MUST NOT switch house styles within one publication without a functional reason.
>
> **UWDS-PROFILE-002 MUST:** When a profile is silent, apply UWDS. When UWDS is silent, use the declared secondary reference.

## 19. Quality assurance and conformance testing

Review in this order: scope and authority; factual accuracy; terminology; structure and task flow; plain language and editorial consistency; accessibility and cognitive usability; executable procedures, code, links, forms, and examples; then exceptions and publication approval.

| Check | Pass condition |
| --- | --- |
| Audience | The primary audience and desired outcome are clear. |
| Accuracy | Facts, commands, labels, examples, limits, and outcomes were verified. |
| Terminology | Preferred terms are consistent and defined where needed. |
| Findability | Titles, headings, keywords, navigation, and references match user language. |
| Procedures | Prerequisites, steps, conditions, results, warnings, and recovery are complete. |
| Requirements | Normative statements are testable and use BCP 14 correctly. |
| Accessibility | Structure, alternatives, labels, keyboard use, reading order, and errors were checked. |
| Cognition | Content minimizes memory load, ambiguity, nesting, and unnecessary complexity. |
| Localization | Content is explicit, complete, and free from avoidable cultural dependencies. |
| Maintenance | Owner, version, review date, and retirement conditions are defined. |

> **UWDS-QA-001 MUST:** A reviewer MUST NOT approve content that has not been validated against the interface, system, law, data, or process it describes.
>
> **UWDS-QA-002 MUST:** Automated readability or lint scores MAY identify review candidates but MUST NOT be treated as proof of clarity, accessibility, or correctness.

## 20. Standard templates

| Content type | Required fields |
| --- | --- |
| Concept | Title, summary, details, example when useful, related tasks |
| Task | Action-oriented title, outcome, prerequisites, ordered steps, verification, recovery |
| Reference | Object title, scope and version, syntax or schema, members, errors and limits |
| Troubleshooting | Symptom, scope, causes in diagnostic order, resolution, escalation evidence |
| Requirement | Stable identifier, actor and normative behavior, rationale, verification, dependencies |
| UI error | Headline, actionable cause when known, recovery, useful diagnostic identifier |
| API operation | Method and path, authorization, request, response, errors, operational behavior |

## 21. Quick reference and publication decision

| Do | Do not |
| --- | --- |
| Lead with the user's goal or controlling fact. | Open with organizational background or throat-clearing. |
| Name the actor and action. | Hide responsibility in passive constructions. |
| Use one term for one concept. | Alternate synonyms for variety. |
| Put conditions before governed actions. | Reveal exceptions after the reader acts. |
| Use one primary action per procedural step. | Pack decisions and results into a long step. |
| State expected results and recovery. | Assume the reader knows whether the task worked. |
| Use specific labels and errors. | Use generic labels or blame the user. |
| Use BCP 14 only for normative obligations. | Use MUST or SHOULD as emphasis. |
| Provide structure and text alternatives. | Depend on styling or color alone. |
| Use unambiguous dates, zones, and units. | Use context-dependent shorthand in durable content. |
| Test against the real product or process. | Approve plausible content without validation. |

> **Publish only when:** A representative reader can find the content, understand the intended meaning, complete or evaluate the task, and recover from likely errors without undocumented knowledge.

## Appendix A. Source integration map

| Source | Role in UWDS | Official reference |
| --- | --- | --- |
| ISO 24495-1:2023 | Plain-language outcomes: relevant, findable, understandable, usable | <https://www.iso.org/standard/78907.html> |
| ASD-STE100 Issue 9 | Controlled vocabulary, explicit actors, and short procedures | <https://www.asd-ste100.org/> |
| ISO/TS 24620-1:2015 | Controlled natural-language principles | <https://www.iso.org/standard/37334.html> |
| Plain Writing Act and Digital.gov guidance | Clear, concise, organized US federal public content | <https://digital.gov/guides/plain-language> |
| Google Developer Documentation Style Guide | Developer documentation, terminology, procedures, code, and global content | <https://developers.google.com/style> |
| Microsoft Writing Style Guide | Technology and UI voice, accessibility, and localization | <https://learn.microsoft.com/en-us/style-guide/> |
| Apple Style Guide | Apple-platform terminology and interface language | <https://support.apple.com/guide/applestyleguide/welcome/web> |
| GOV.UK content design guidance | Task-oriented public content and scannability | <https://www.gov.uk/guidance/content-design/writing-for-gov-uk> |
| WCAG 2.2 | Formal web-accessibility success criteria | <https://www.w3.org/TR/WCAG22/> |
| W3C cognitive accessibility guidance | Literal, succinct, predictable, low-memory content | <https://www.w3.org/WAI/cognitive/> |
| W3C clear-content patterns | Supplemental clear-content practices | <https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/> |
| Section 508 Standards | Accessibility duties for covered US federal ICT | <https://www.access-board.gov/ict/> |
| Job Accommodation Network ADHD guidance | Individualized written-instruction and task-separation ideas; not a writing standard | <https://askjan.org/disabilities/Attention-Deficit-Hyperactivity-Disorder-AD-HD.cfm> |
| ADA accommodation process | Individualized reasonable-accommodation framework; not a writing style | <https://www.ada.gov/> |
| IEC/IEEE 82079-1:2019 | Requirements for instructions and information for use | <https://www.iso.org/standard/71620.html> |
| ISO/IEC/IEEE 26514:2021 | Software and systems user-documentation processes and content | <https://www.iso.org/standard/77451.html> |
| OASIS DITA 1.3 | Modular technical-content architecture | <https://www.oasis-open.org/standard/ditav1-3/> |
| ANSI Z535.6 | Safety messages in manuals and collateral | <https://www.ansi.org/> |
| S1000D | Regulated, modular aerospace and defense publications | <https://s1000d.org/> |
| ISO 704:2022 | Terminology work, concepts, designations, and definitions | <https://www.iso.org/standard/79077.html> |
| Project terminology registry | Local authority for product concepts and terms | Project-controlled repository |
| RFC 2119 and RFC 8174 | Normative requirement keywords | <https://www.rfc-editor.org/info/rfc2119/> |
| ISO 8601 | Date and time representations | <https://www.iso.org/iso-8601-date-and-time-format.html> |
| International System of Units | Units, symbols, prefixes, and presentation | <https://www.bipm.org/en/publications/si-brochure/> |
| AP Stylebook | Journalism and public announcements | <https://www.apstylebook.com/> |
| The Chicago Manual of Style | Long-form editorial and publishing mechanics | <https://www.chicagomanualofstyle.org/> |
| APA Style | Behavioral and social-science publishing | <https://apastyle.apa.org/> |
| MLA Handbook | Humanities research and documentation | <https://style.mla.org/> |
| AMA Manual of Style | Medical and scientific publishing | <https://www.amamanualofstyle.com/> |

## Appendix B. Definitions

| Term | Definition |
| --- | --- |
| Accessibility | The quality that lets people with disabilities perceive, operate, understand, and use content and systems. |
| Controlled language | A constrained form of natural language designed to reduce ambiguity and variation. |
| Content profile | Domain or channel rules applied on top of UWDS. |
| Findable | Locatable through navigation, search, headings, labels, or references using audience vocabulary. |
| Normative | Defining a requirement, prohibition, recommendation, or permitted option. |
| Plain language | Communication whose wording, structure, and design let the audience find, understand, and use information. |
| Project terminology registry | The authoritative local record of approved concepts, terms, definitions, aliases, capitalization, and prohibited forms. |
| Topic | A self-contained content unit with one primary purpose. |
| Usable | Able to support the intended decision or task in its real context. |

## Document control

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-07-21 | Initial unified standard synthesized from the reviewed standards, guides, accessibility resources, legal frameworks, and project terminology authority. |
