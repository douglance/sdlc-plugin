# Standards and style reference

## Use and conformance

Use this reference to select and tailor lifecycle information. It summarizes public descriptions
of the standards. It does not reproduce their normative text. Obtain the official publication when
a contract, regulator, or audit requires formal conformance.

Use the current published standard as the baseline. Record an older version only when the project
or contract requires it. Record all tailoring. ISO/IEC/IEEE 15289 permits projects to combine or
split information items, so do not create one file per standard by default. In this SDLC, combine
items only within one phase. Never merge phase ownership or skip an immediate receiver.

## Lifecycle artifact map

| Phase or concern | Primary artifact | Governing reference | Use |
| --- | --- | --- | --- |
| Software lifecycle | Lifecycle model and process records | [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html) | Use as the current process framework. It does not require one lifecycle method. |
| All phase handoffs | Plan, description, specification, report, request, procedure, policy, or record | [ISO/IEC/IEEE 15289:2019](https://www.iso.org/standard/74909.html) | Use as the current umbrella for lifecycle information items. Combine or split items when useful. |
| Feasibility | Feasibility report or lifecycle concept | 12207 and 15289 | State options, constraints, evidence, assumptions, and the decision condition. |
| Requirements | Software Requirements Specification (SRS) | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) | Use stable requirement IDs, measurable statements, source, rationale, and verification method. IEEE 830 is superseded. |
| Project management | Project Management Plan | [ISO/IEC/IEEE 16326:2019](https://standards.ieee.org/ieee/16326/6769/) | Define scope, lifecycle, organization, work, schedule, resources, risk, control, and closure. |
| Software design | Software Design Description (SDD) | [IEEE 1016-2009](https://standards.ieee.org/ieee/1016/4502/) plus 15289 | Record stakeholders, concerns, views, interfaces, decisions, rationale, and traceability. IEEE 1016 is inactive-reserved, so use it as specialist precedent under the current 15289 umbrella. |
| Configuration management | Configuration Management Plan and configuration records | [IEEE 828-2012](https://standards.ieee.org/ieee/828/5367/) plus 12207 and 15289 | Identify configuration items, baselines, change control, status accounting, builds, and releases. IEEE 828 is inactive-reserved, so record that tailoring. |
| Testing | Test Plan, Test Specification, Test Case, Test Procedure, and Test Report | [ISO/IEC/IEEE 29119-3:2021](https://standards.ieee.org/ieee/29119-3/7499/) | Link test basis, environment, cases, results, anomalies, and coverage. This standard supersedes the IEEE 829 documentation line. |
| Software quality assurance | Software Quality Assurance Plan and Report | [IEEE 730-2026](https://standards.ieee.org/ieee/730/10854/) | Define quality activities, criteria, independence, records, nonconformance control, and reporting. |
| Verification and validation | V&V Plan, task records, anomaly records, and V&V Report | [IEEE 1012-2024](https://standards.ieee.org/ieee/1012/7324/) | Separate verification from validation. Link each conclusion to requirements, intended use, and evidence. |
| User documentation | Information plan and information for users | [ISO/IEC/IEEE 26514:2021](https://standards.ieee.org/ieee/26514/7467/) | Base content on user tasks. Define structure, format, delivery, evaluation, and maintenance. |
| Reviews and audits | Review record, inspection record, walkthrough record, or audit report | IEEE 1028-2008 plus 15289 | Record scope, entry criteria, participants, evidence, findings, disposition, and exit decision. IEEE 1028 is inactive-reserved, so use it as specialist precedent. |
| Deployment | Release plan, release record, configuration status, smoke report, and rollback record | 12207, 15289, and the tailored CM plan | Identify the exact baseline, target, approvals, result, evidence, and recovery path. |
| Operations | Operations plan, runbook, incident report, service report, and change request | 12207 and 15289 | State triggers, owner, procedure, expected result, evidence, and feedback destination. |
| Maintenance | Maintenance plan, change request, impact report, and review record | 12207, 15289, and the project CM plan | Preserve traceability from the observed need through the changed baseline and regression evidence. |

The standards list is current as of 2026-07-20. Verify official status before claiming formal
conformance. ISO/IEC/IEEE 29148 and 15289 have revisions in development, but their 2018 and 2019
editions remain the published baselines on this date.

## STE-derived writing profile

[ASD Simplified Technical English](https://en.wikipedia.org/wiki/Simplified_Technical_English)
is a controlled language for clear technical documentation. Its public summary distinguishes
procedures from descriptions and gives these useful rules:

- use approved words with one meaning and part of speech;
- make instructions clear and specific;
- prefer active voice;
- use no more than 20 words in an instruction sentence;
- use no more than 25 words in a descriptive sentence;
- write one instruction per sentence;
- write one topic per paragraph;
- use vertical lists for complex text.

This skill adopts the structural rules, but it does not bundle the ASD-STE100 dictionary. Therefore,
describe output as `STE-derived controlled English`, not `ASD-STE100 compliant`.

## Requirement sentence pattern

Use this pattern for a binding requirement:

```text
<Condition>, the <actor> shall <action> <object> within <measurable limit>.
```

Example:

```text
When authentication succeeds, the service shall create the session within 500 milliseconds.
```

Give each requirement one stable ID. Keep rationale, source, priority, and verification method in
separate fields. Do not join independent behavior with `and`.

## Phase-to-phase traceability

Preserve this chain when the phase applies:

```text
Need -> requirement -> design element -> work item -> configuration item
     -> test case -> test result -> V&V conclusion -> release -> operating evidence
```

Each link must name both stable IDs. Do not rely only on prose or document position.
