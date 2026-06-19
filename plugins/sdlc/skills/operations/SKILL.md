---
name: operations
description: Start here to run software in production after it ships — observability, incident response, and operational continuity. Use to monitor a live service, handle an incident, write a runbook, or close the loop from production back to the backlog.
context: fork
agent: sre
---

<what-to-do>

Keep the shipped software healthy in the real world. Stand up observability, respond to incidents, and feed what production teaches you back to maintenance and requirements.

Shipping is the start of operations, not the end of the work. Hope is not a strategy — instrument first.

</what-to-do>

<supporting-info>

## What to run

- **Observability** — logs, metrics, and traces, with **SLOs** that define "healthy" and alerts that fire before users notice.
- **Incident management** — detect, triage by impact, mitigate, resolve, and write a blameless postmortem. Every incident yields a prevention item.
- **Runbooks** — a written procedure for each routine operation and recovery path, so response doesn't depend on one person's memory.
- **Continuity** — backup, failover, and rollback that have actually been tested, not assumed.
- **Close the loop** — route defects to `debugging-and-error-recovery`, recurring toil to `maintenance`, and new needs to `requirements-gathering`.

## What to produce

An operations plan and runbooks, the monitoring and SLOs in place, incident records with postmortems, and the feedback items routed back into the lifecycle. Definitions: [`../../GLOSSARY.md`](../../GLOSSARY.md).

</supporting-info>
