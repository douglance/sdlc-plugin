---
name: visual-design
description: >-
  Start here for user-facing UI/visual work — layout, visual hierarchy,
  composition, states, and accessibility — and to verify a rendered change
  actually looks right.
---
<execution-contract>
This phase is owned by `graphic-designer`. When the host exposes named agents and you are the parent/orchestrator, delegate this phase to `graphic-designer` and pass the prior artifact. If you are already that agent or delegation is unavailable, execute locally; never recursively delegate the same phase. Consume the product requirements and current surface, produce the visual design plus rendered evidence, return unresolved states or accessibility issues, and hand off to `implementation` or `quality` only when work remains. Format the result with `actionable-communication`.
</execution-contract>

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

LOOK before declaring done. A passing test and a clean console do not prove it looks right — the screenshot is the test. Judge the whole composition, not just what you changed, and iterate until it is both visually coherent and specific to the brief. Check that implementation did not drift into a familiar default pattern even when individual components look polished.

When the browser tooling supports it (e.g. an annotate mode), offer the user an on-page markup loop — they draw boxes and comments directly on the live render and you consume the annotated screenshot — instead of relying only on text descriptions of what's wrong.

## What to produce

The UI (built or specified), plus screenshots of the real rendered result at the relevant breakpoints, and a note on the states and accessibility checks covered.

</supporting-info>
