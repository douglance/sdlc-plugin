---
name: find-simplifying-insight
description: >-
  Use when proliferating rules, exceptions, adapters, or workarounds suggest the
  underlying model may be wrong and a falsifiable simpler model is needed.
---
# Find Simplifying Insight

Look for the equivalent of a heliocentric shift: one model that explains the observations while making many inherited rules unnecessary. Treat elegance as a hypothesis, never as evidence, and do not force a revolution when the current model survives testing.

## Method

1. **Separate observations from machinery.** Inventory measured facts and invariants separately from inherited rules, exceptions, adapters, conventions, and workarounds.
2. **Expose the load-bearing assumptions.** For each cluster of compensating rules, state the assumption they protect. Identify contradictions, repeated translations, and rules whose only justification is another rule.
3. **Form alternatives.** Propose at most three simpler models plus the null hypothesis that the current model is necessary.
4. **Make each model falsifiable.** For every candidate, state:
   - facts and invariants it preserves;
   - rules or exceptions it eliminates;
   - a novel prediction or observable consequence;
   - the cheapest decisive test that could disprove it.
5. **Run or specify the decisive test.** Prefer executable probes, counterexamples, historical cases, or small spikes over argument from taste.
6. **Choose a verdict.** Use exactly one: `adopt`, `spike`, `reject`, or `no simplifying insight`.

## Guardrails

- A shorter explanation that loses facts is not simpler; it is incomplete.
- Moving complexity behind a new abstraction does not eliminate it.
- Count migration cost, operational risk, and new failure modes.
- Preserve the null hypothesis throughout the comparison.
- If no candidate survives falsification, report that plainly and keep the existing model.

## Output contract

```text
Observed facts:
Current assumptions and compensating rules:

Candidate: <model or null hypothesis>
Preserves:
Eliminates:
Predicts:
Falsification test:
Result/evidence:

Verdict: adopt | spike | reject | no simplifying insight
Why:
Next test: <only when verdict is spike>
```
