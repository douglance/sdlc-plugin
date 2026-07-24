---
name: lifecycle-documentation
description: >-
  Use to create or review a formal, traceable lifecycle artifact or phase
  handoff that another person or system must consume.
---
# Lifecycle Documentation

Create the smallest lifecycle artifact that lets the next phase work without guessing. Use the
information model of the applicable IEEE/ISO standard. Do not add ceremonial sections that do not
help a decision, action, or verification.

Preserve point-to-point ownership at each selected lifecycle edge. Do not combine artifacts owned
by different phases, skip an immediate receiver, or address one handoff to multiple downstream
phases. The lifecycle graph can branch between handoffs. Standards tailoring can combine
information only when one phase owns all combined content.

Read [references/standards-and-style.md](references/standards-and-style.md) before you select the
artifact type or claim standards alignment. It contains the lifecycle map, the controlled-English
profile, and current standard status.

## Workflow

1. Select the artifact type from the phase map in the reference.
2. Confirm that one phase owns the artifact and that it names only the next receiver.
3. Record the governing standard, its version, and all tailoring decisions.
4. Write the artifact with the controlled-English profile below.
5. Link inputs, requirements, decisions, implementation units, tests, and evidence with stable IDs.
6. Apply the handoff gate. Return an explicit rejection note when required input is absent.

## Controlled-English profile

Use an STE-derived profile. Do not claim full ASD-STE100 conformance unless the official standard,
dictionary, and a conformance review are available.

- Use one term for one concept. Define project-specific terms once.
- Name the actor. Use active voice unless the actor is unknown.
- Write one instruction or requirement per sentence.
- Keep procedures at 20 words or fewer per sentence when practical.
- Keep descriptions at 25 words or fewer per sentence when practical.
- Put one topic in each paragraph. Use lists for complex conditions.
- Do not omit the subject, verb, or article to make text shorter.
- Replace vague words with a value, condition, owner, date, or measurable threshold.
- Use declared uppercase BCP 14 keywords for project requirements. Preserve `shall` only when a
  governing external standard or contract requires it.
- Do not use `and/or`. Split the cases or name the exact logical operator.

Do not rewrite code, identifiers, commands, logs, quoted evidence, legal text, or standard titles.
Explain these items with controlled English around the exact text.

## Common artifact header

Start every lifecycle artifact with this information:

```markdown
Artifact: <type and stable ID>
Subject: <system or change>
Status: draft | in review | approved | rejected | superseded
Version: <document version>
Owner: <role or person>
Approvers: <roles or people>
Inputs: <artifact IDs and versions>
Governing references: <standards and project sources>
Tailoring: <combined, omitted, or changed content and reason>
```

## Required handoff block

End every phase artifact with this block:

```markdown
## Handoff

Receiver: <next phase or owner>
Accepted inputs: <IDs and versions consumed>
Decisions: <stable decision IDs and result>
Produced outputs: <artifact, requirement, change, or evidence IDs>
Verification evidence: <test, review, command, path:line, or external source>
Open items: <owner, due condition, and effect; write "None" when empty>
Acceptance checks: <checks the receiver must perform before work starts>
```

## Handoff gate

Accept an incoming artifact only when:

- its type, status, version, owner, and inputs are explicit;
- every material claim has evidence or is labeled as an assumption;
- stable IDs preserve traceability across the phase boundary;
- open decisions name an owner and their effect on downstream work;
- one producing phase owns the artifact and names one immediate receiver;
- the receiver can test each acceptance condition.

If the artifact fails the gate, do not silently repair its meaning. Return `Handoff rejected`, list
the failed checks, and route it to the producing phase.
