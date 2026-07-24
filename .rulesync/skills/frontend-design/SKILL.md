---
name: frontend-design
description: >-
  Use when building or restyling a user-facing web interface where art direction
  and production-quality visual execution matter.
targets:
  - '*'
claudecode:
  context: fork
  agent: graphic-designer
---
<what-to-do>

Create an interface that feels authored by a strong human designer, not averaged from template patterns. In order:

1. **Understand the context** — purpose, users, framework, performance budget, accessibility requirements, brand anchors (adjectives, references, taboos). Check the project's existing design system / component library before authoring custom markup. Ask only for what blocks correct execution.
2. **Commit to a specific art direction** — derive it from the subject, then execute it with precision. Bold maximalism and refined minimalism both work; intentionality is mandatory. Do not force novelty through arbitrary extremity, and do not let unrelated briefs converge on the same theme, fonts, palette, layout, assets, or energy.
3. **Invent a signature element** — one unforgettable hook that is functional, not decorative.
4. **Define design tokens before layout** — all styling flows from tokens.
5. **Build to the hard rules** below (typography, color, layout, motion, texture) with every interaction state and failure path designed.
6. **Run the final quality gate** — if any check fails, the output is invalid. Then verify visually per the `visual-design` skill: render, screenshot, judge the whole composition.

Deliver: an art-direction brief (direction, type pairing, palette logic, motion grammar, material choice), complete runnable code matching the requested scope, and extension notes on growing tokens/components/states without breaking coherence.

</what-to-do>

<supporting-info>

## Art directions (inspiration only — never a menu to rotate through)

Editorial magazine (asymmetric grids, typographic authority, dramatic whitespace) · Neo-brutalist industrial (hard edges, utilitarian labels, raw materials) · Luxury refined (restraint, premium materials, invisible complexity) · Retro-futurist CRT (scanlines, angular geometry, phosphor glow) · Organic tactile (paper grain, irregular shapes, handmade warmth) · Punk zine (collage energy, raw texture, deliberate imperfection) · Bauhaus precision (geometric discipline, functional clarity, primary colors) · Psychedelic surreal (controlled chaos, vivid contrast, fluid forms).

## Signature elements (valid examples)

Morphing border/frame responding to scroll or state · typographic hero with deliberate kerning and optical rhythm · navigation with spatial logic and animated affordances · custom cursor behavior that improves discoverability · texture system that supports hierarchy and focus · branded data-visualization language · scroll-triggered reveal with orchestrated timing.

## Design tokens

Define before layout, in `:root` (or the framework's token layer):

- **Color**: `--color-bg / -surface / -text / -muted / -accent / -focus / -success / -warning / -danger`
- **Typography**: `--font-display / -body / -mono`; `--text-xs…2xl` each paired with `--leading-*`
- **Spacing**: `--space-1/2/3/4/6/8`
- **Radius & shadow**: `--radius-sm/md/lg`, `--shadow-sm/md/lg`
- **Motion**: `--duration-fast/base/slow`, `--ease-out`, `--ease-spring`

## Hard rules

**Selective avoidance**
- Treat familiar structures as scaffolding, not finished designs. Substantially adapt hierarchy, typography, palette, assets, density, interaction, and copy to the prompt.
- Reject unprompted purple/blue gradients, decorative grid backgrounds, bento-box sectioning, oversized hero type used instead of meaningful imagery, arbitrary offset composition, and gratuitous confetti or particles.
- These are context-dependent patterns, not universal bans. Keep one when the brief, brand, content, or existing product genuinely calls for it; the user's explicit direction wins.
- Apply the swap test: if the result could serve an unrelated product after changing only the logo and nouns, revise the most generic decisions.

**Typography**
- Avoid Inter, Roboto, Arial, and system defaults.
- Pair a characterful display face with a refined body face; robust fallbacks that preserve tone.
- Tune letter-spacing and line-height intentionally; use typographic contrast as a primary design tool.
- `text-wrap: balance` on headings (effective up to ~6 lines in Chromium, ~10 in Firefox); `text-wrap: pretty` on shorter body text to kill orphans.

**Color**
- No emoji icons anywhere. No default purple-gradient-on-white SaaS aesthetic.
- One dominant hue plus one to three accents with defined roles.
- Contrast and focus colors must be functional. Dark mode only if it strengthens the direction.

**Layout**
- No predictable center hero → three cards → icon row.
- Do not divide every idea into a rounded tile. Group content by task and relationship; use cards only when their boundaries carry meaning.
- Consistent grid logic plus at least one intentional grid break; asymmetry when it clarifies hierarchy.
- Responsive design must preserve narrative and rhythm, minimum three breakpoints, touch targets ≥ 44px on mobile.

**Motion**
- Should it animate? Frequency decides: used 100+ times a day → never animate; occasional → standard motion; rare moments → delight allowed. Every animation must serve spatial continuity, a state change, feedback, or explanation — otherwise cut it.
- Easing: entering/exiting → ease-out; on-screen movement → ease-in-out; hover/color → ease; constant motion → linear; **never ease-in for UI**. House curves: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`.
- Durations: button 100–160ms, tooltip 125–200ms, dropdown 150–250ms, modal 200–500ms; UI motion stays **under 300ms**. Consistency rule: if buttons animate at 200ms, all buttons animate at 200ms.
- Springs: default `{ type: "spring", duration: 0.5, bounce: 0.2 }`; keep bounce 0.1–0.3 (bounce 0 for icon swaps). Never enter from `scale(0)` — start at `scale(0.9–0.95)` + opacity. Icon transitions: scale 0.25→1, opacity 0→1, blur 4px→0. Press feedback: `scale(0.96)`, never below 0.95.
- Popovers/dropdowns animate from a trigger-anchored `transform-origin`; modals stay centered. Context menus animate exit only, never entry.
- Motion communicates structure, feedback, and affordances — prefer one orchestrated entrance over scattered micro-animation; scroll reveals only when they add meaning. `prefers-reduced-motion`: keep opacity/color transitions, strip movement.
- Performance: animate only `transform`/`opacity` (use the full `transform` string — Framer Motion's `x`/`y` shorthands run on the main thread); never animate CSS variables on a parent (recalcs every child); `will-change` only on transform/opacity/filter, added only after observed first-frame stutter, never `all`; canvas, WebGL, and particles require a reduced mode and lazy initialization.

**Texture & material**
- Avoid flat sterile backgrounds unless austerity is intentional; texture supports hierarchy, never noise.
- Depth language consistent across the system; glass effects only if fully committed and readable.
- Allowed: subtle grain overlay, SVG parametric patterns, noise-driven gradients, paper-fold shadows, CRT scanlines for retro themes, procedural canvas texture when performance allows.

**Surface polish (numeric defaults)**
- Concentric radii: nested radius = outer radius − padding; skip the math when padding > 24px.
- Prefer 2–3 layered box-shadows over 1px borders for elevation, tuned separately for light and dark.
- Image/avatar outlines: inset `rgba(0,0,0,.1)` on light, `rgba(255,255,255,.1)` on dark — never a tinted neutral.
- Optical over geometric alignment: icon-side button padding ≈ text-side − 2px; nudge optically unbalanced glyphs (a play triangle gets ~2px toward the point).
- Hit areas ≥ 44×44px touch, ≥ 40×40px dense desktop — extend with a pseudo-element, and never let two hit areas overlap.

## Required interaction states

Every interactive element: default, hover, active/pressed, focus-visible, disabled, loading, error, and empty state where applicable.

## Accessibility (WCAG AA intent) — fix in priority order

1. **Accessible names** — icon-only buttons get `aria-label`; meaningful images get alt text.
2. **Keyboard access** — no div/span-as-button without full keyboard support; never `tabindex` greater than 0.
3. **Focus & dialogs** — visible focus styling integrated into the aesthetic; modals trap focus and restore it on close.
4. **Semantics** — semantic HTML first; ARIA only where native semantics can't do the job (don't add ARIA that duplicates them).
5. **Forms & errors** — validation messages paired to inputs via `aria-describedby` + `aria-invalid`.
6. **Announcements** — dynamic content changes announced via live regions when not otherwise perceivable.
7. **Contrast & states** — contrast and focus colors stay functional across every interaction state.
8. **Media & motion** — captions/alternatives for media; reduced-motion fallback.

Fix accessibility minimally: don't refactor unrelated code, and don't migrate UI libraries to get there. When reporting a11y findings: quote the exact offending snippet, one sentence on why it matters, and the concrete code-level fix.

## Failure handling

Design network failure/offline, partial or delayed data, and user-error recovery flows. Failure states must be visually intentional, on brand, and informative without verbosity. Silent failures and default browser error states are not permitted.

## No placeholder energy

Reject output containing lorem ipsum or filler copy, vague marketing language, empty states without guidance, or labels/helper text that ignore the established voice. All copy is authored, contextual, and deliberate — and consistent: typography, motion, layout, and microcopy must feel authored by one system telling one story.

## Data visualization

Start with the question or decision the data must support. Use realistic domain data and select the visual encoding for that relationship rather than for decoration. Label units and scales, preserve zero baselines where comparison requires them, make legends/tooltips readable, and test dense and narrow states. A branded chart language is valuable only after the chart is truthful and usable; ornamental pseudo-data is invalid.

## Abomination checklist (any true → reject)

- Inter + purple gradient + rounded cards + generic icons
- Generic chatbot bubbles with no branded concept
- Default Tailwind appearance with minimal tokenization
- Missing focus states or keyboard access
- No error or loading states
- Marketplace-template resemblance, or visual polish without usability completeness
- Convergence on common AI aesthetic patterns
- Gratuitous confetti/particles or decorative charts standing in for product substance
- The same stock image, hero structure, or signature treatment reused across unrelated contexts

## Review output format

When reviewing or refining existing UI, report every finding as a **Before / After / Why** table row: the exact current code, the exact replacement, and a one-sentence reason. No prose walls.

## Final quality gate (all must be true before delivery)

Signature element exists and is functional · tokens drive styling · accessibility met · all interaction states implemented · failure and recovery states designed · narrative consistency holds · responsive rhythm preserved · prompt-specific choices survive the swap test · charts are truthful and legible · no unearned AI tropes. Then hand off to `visual-design` for rendered inspection and visual evidence.

</supporting-info>
