---
name: visual-design
description: Start here for user-facing UI/visual work — layout, visual hierarchy, composition, states, and accessibility — and to verify a rendered change actually looks right.
context: fork
agent: visual-designer
---

<what-to-do>

Design and verify the user-facing surface. Work from the user's task, design the whole composition and every state, meet accessibility, then LOOK — render it, screenshot it, and judge the real result.

</what-to-do>

<supporting-info>

## What to cover

- **User-centered** — start from the user, the job, and the success state, not the data model.
- **Composition & hierarchy** — balance, spacing, alignment, visual hierarchy, typographic scale. No dead zones, squashing, overflow, clipping, or floating orphans.
- **States** — empty, loading, error, populated, and responsive breakpoints.
- **Accessibility** — contrast, focus order, keyboard operability, labels/alt text, reduced-motion.

## Visual verification (non-negotiable)

LOOK before declaring done. A passing test and a clean console do not prove it looks right — the screenshot is the test. Judge the whole composition, not just what you changed, and iterate on the screenshot until it's genuinely good.

## What to produce

The UI (built or specified), plus screenshots of the real rendered result at the relevant breakpoints, and a note on the states and accessibility checks covered. Definitions: [`../../GLOSSARY.md`](../../GLOSSARY.md).

</supporting-info>
