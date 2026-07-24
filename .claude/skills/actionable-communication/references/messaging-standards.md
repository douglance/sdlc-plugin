# Messaging standards reference

## Purpose

Use external standards and style guides as anchors for consistent messaging. Do not treat an anchor as a blanket conformance claim. Record a version, publication date, or access date when a material decision depends on an external reference.

This reference applies to user-visible lifecycle reports, handoffs, blockers, completion summaries, requirements, plans, designs, instructions, and documentation.

## Reference hierarchy

Apply the first source that resolves the question:

1. Preserve the user's required format, quoted text, identifiers, commands, logs, and legal language.
2. Use the project's glossary, domain model, established product names, and local house style.
3. Use the standard or guide that matches the audience, artifact, and delivery channel.
4. Use the plain-language, controlled-language, and accessibility anchors below.
5. Use the current Chicago Manual of Style as the general US English editorial fallback.

Do not mix competing house styles line by line. Document a deliberate exception when a higher-priority source requires one.

## Core messaging anchors

| Anchor | Apply it to | Project use |
| --- | --- | --- |
| [ISO 24495-1:2023](https://www.iso.org/standard/78907.html) | Plain language | Make information relevant, findable, understandable, and usable for its intended readers. |
| [ASD-STE100 Issue 9](https://www.asd-ste100.org/) | Controlled technical English | Use its structural ideas for direct, consistent procedures. Describe project output as `STE-derived controlled English`, not ASD-STE100 compliant. |
| [ISO/TS 24620-1:2015](https://www.iso.org/standard/37334.html) | Controlled natural language | Treat controlled language as a domain-specific restriction of natural language with explicit objectives and rules. |
| [ISO 704:2022](https://www.iso.org/standard/79077.html) | Terminology | Define concepts before choosing terms. Use one preferred term for one concept and write explicit definitions. |
| [Google developer documentation style guide](https://developers.google.com/style) | Developer documentation | Default technical editorial guide for commands, code terms, headings, procedures, examples, and developer-facing explanations. |
| [Microsoft Writing Style Guide](https://learn.microsoft.com/style-guide/) | UI text and global-ready content | Use for concise product language, errors, interface text, terminology, localization, and machine-translation readiness. |
| [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) | Normative protocol or interface language | Use uppercase `MUST`, `SHOULD`, and `MAY` only when the document explicitly adopts their normative meanings. |
| [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) | Requirements | Use stable requirement IDs, explicit actors, measurable conditions, rationale, source, and verification method. |
| [ISO/IEC/IEEE 26514:2021](https://standards.ieee.org/ieee/26514/7467/) | Software user information | Organize documentation around user tasks and verify it against shipped behavior. |
| [IEC/IEEE 82079-1:2019](https://www.iso.org/standard/71620.html) | Instructions for use | State prerequisites, ordered actions, expected results, hazards, and an evaluation method for instructions. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessible web content | Target Level AA for applicable content and interfaces. Make structure, navigation, labels, errors, and interaction understandable. |
| [W3C cognitive accessibility guidance](https://www.w3.org/WAI/cognitive/) | Cognitive and learning accessibility | Use literal words, succinct text, separated instructions, predictable paths, summaries, and low-memory interactions. Treat it as informative guidance beyond WCAG conformance. |

## Channel-specific editorial anchors

| Anchor | Use it when | Do not use it as |
| --- | --- | --- |
| [AP Stylebook](https://www.apstylebook.com/) | Writing news, press releases, media statements, or public announcements. | The default for engineering requirements, lifecycle artifacts, or technical procedures. |
| [The Chicago Manual of Style, 18th edition](https://www.chicagomanualofstyle.org/) | Resolving general US English grammar, punctuation, usage, citations, or publishing questions not answered above. | A reason to override project terminology or a specialized technical standard. |
| [Apple Style Guide](https://support.apple.com/guide/applestyleguide/welcome/web) | Documenting Apple platforms, Apple UI terms, or Apple-specific interactions. | A cross-platform product vocabulary. |
| [GOV.UK content guidance](https://guidance.publishing.service.gov.uk/) | Writing UK public-service content or borrowing evidence-based content-design patterns. | The source for US spelling or project-specific terminology. |

Use APA, MLA, AMA, or another specialist publication style only when the target publication or discipline requires it.

## Legal and accommodation references

Apply these references only when their jurisdiction or audience is in scope:

- The [US Plain Writing Act of 2010 guidance](https://digital.gov/guides/plain-language) governs covered US federal public communication. Its audience-first plain-language practices remain useful elsewhere, but the law does not automatically apply.
- The [Revised Section 508 Standards](https://www.access-board.gov/ict/) govern covered US federal information and communication technology. Do not equate an accessibility intention with Section 508 compliance.
- The [Job Accommodation Network ADHD guidance](https://askjan.org/disabilities/Attention-Deficit-Hyperactivity-Disorder-AD-HD.cfm) offers accommodation ideas such as written instructions, checklists, reminders, task separation, and recorded directives. It is guidance, not a universal writing standard. Determine accommodations with the individual.

## Writing profile

- Write for the reader's immediate task and decision.
- Use US English unless the audience, locale, quotation, or project requires another variety.
- Lead with the outcome, required action, or controlling fact.
- Use familiar, literal words. Define a specialized term once and use it consistently.
- Name the actor and action. Prefer active voice.
- Keep one instruction in each numbered step.
- State prerequisites before actions and expected results after actions.
- Keep critical paths short. Do not require the reader to remember information that can remain visible.
- Expand an unfamiliar abbreviation on first use.
- Use descriptive sentence-case headings and meaningful link text.
- Use lists for procedures and conditions. Use tables for exact mappings and comparisons.
- Separate known facts, inferences, recommendations, and unresolved questions.
- Preserve enough evidence to reproduce a result or verify a claim.
- For failures, state the cause, supporting evidence, and smallest remedy when known. Label hypotheses.

## Conformance language

Use `aligned with`, `guided by`, `based on`, or `derived from` unless the work has passed the official conformance process for the named standard.

Use `conforms to`, `complies with`, or a named accessibility level only when the scope, version, tests, exceptions, and evidence are explicit. A checklist, intention, or partial adoption is not conformance.

References last verified: 2026-07-21.
