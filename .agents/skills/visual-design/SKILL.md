---
name: visual-design
description: >-
  Use when creating or reviewing a user-facing layout, state, illustration,
  document, slide, motion treatment, or rendered visual result.
---
<execution-contract>
This skill defines the visual-design phase. Use the `graphic-designer` agent when a bounded visual task can proceed independently; otherwise work locally. Produce the design, rendered evidence, and any unresolved state or accessibility issue.
</execution-contract>

Use `lifecycle-documentation` only when the result needs a durable artifact or handoff.

<what-to-do>

Design and verify the user-facing surface. Work from the user's task, design the whole composition and every state, meet accessibility, then LOOK — render it, screenshot it, and judge the real result.

</what-to-do>

<supporting-info>

## What to cover

- **User-centered** — start from the user, the job, and the success state, not the data model.
- **Composition & hierarchy** — balance, spacing, alignment, visual hierarchy, typographic scale. No dead zones, squashing, overflow, clipping, or floating orphans.
- **Specificity** — proven structures may scaffold the work, but hierarchy, typography, palette, assets, density, interaction, and copy must respond to this product and brief. If another product could use the result after swapping only its logo and nouns, revise it.
- **Generated-design defaults** — reject unprompted purple/blue gradients, decorative grid backgrounds, bento-box sectioning, oversized hero type replacing meaningful imagery, arbitrary offset composition, repeated stock assets, and gratuitous confetti/particles. These remain valid when the brief or product context earns them.
- **Data visualization** — use realistic data, truthful encodings, labeled units/scales, legible legends/tooltips, and responsive layouts. Decorative pseudo-data does not count as a chart.
- **States** — empty, loading, error, populated, and responsive breakpoints.
- **Accessibility** — contrast, focus order, keyboard operability, labels/alt text, reduced-motion.

## Visual verification (non-negotiable)

LOOK before declaring done. A passing behavioral test and a clean console do not verify visual
composition. Inspect a rendered capture, judge the whole composition, and use that capture as
evidence for visual claims. Iterate until the result is coherent and specific to the brief.

When the browser tooling supports it (e.g. an annotate mode), offer the user an on-page markup loop — they draw boxes and comments directly on the live render and you consume the annotated screenshot — instead of relying only on text descriptions of what's wrong.

## What to produce

The UI (built or specified), plus screenshots of the real rendered result at the relevant breakpoints, and a note on the states and accessibility checks covered.

</supporting-info>
