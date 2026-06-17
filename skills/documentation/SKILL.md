---
name: documentation
description: Start here to document what shipped — READMEs, API docs, ADRs, and usage — once a feature lands or an interface changes.
context: fork
agent: technical-writer
---

<what-to-do>

Document what actually shipped, not what was planned. Read the change, then write the docs a future engineer or agent needs: how to use it, how the interface behaves, and why the key decisions were made.

Docs are only done when they match the shipped behavior. Verify every command, signature, and example against the real code — guesses age into lies.

</what-to-do>

<supporting-info>

## What to write

- **README / usage** — what it does, how to run it, a working example. Lead with the common path.
- **API / interface docs** — the public surface: signatures, parameters, return shapes, errors. Match the code exactly.
- **ADRs** — for decisions with lasting consequences: the context, the decision, the alternatives rejected, and the trade-off accepted.

## Principles

- **Match the source of truth.** Pull examples and signatures from the real code; run commands you document.
- **Why over what.** Code shows what; docs explain why and how to use it. Don't narrate the obvious.
- **Concise and current.** Smallest doc that conveys it. Stale docs are worse than none.

## What to produce

The files written or updated, and a note of anything you found undocumented but out of scope.

</supporting-info>
