---
marp: true
theme: default
paginate: true
---

<!-- _class: lead -->

# SDLC Plugin

## idea → shipped

A way of conceiving the whole software lifecycle as a series of distinct concerns.

---

# The lifecycle is a chain of distinct **concerns.**

Feasibility, requirements, planning, design, building, testing, quality, shipping, operating, maintaining.

---

# Separation of concerns — applied to the **process,** not just the code.

---

# One concern. One specialist. One responsibility.

The requirements specialist never builds; the builder never sets scope.

---

# The method is defined **independently of the doer.**

The process is the source of truth; the specialist just carries it out.

---

# Work moves as **handoffs** — never as vague intent.

Each phase produces something you can hold up and inspect.

---

# A **scope boundary** travels with the work.

What's out of scope is as binding as what's in it.

---

# The stance is **falsification.**

Requirements and correctness are hypotheses to *disprove*, not confirm.

---

# Requirements tries to **break the spec** — before anything is built.

---

# Testing tries to **break the change** — before it ships.

---

## The pipeline

```
feasibility → requirements → planning → design → visual design
   → building → testing → quality → shipping → operating → maintaining

   ↺ what you learn in production
     re-enters as new requirements, or a bug to root-cause
```

---

## Phase → specialist → work product

| Phase | Specialist | Work product |
|---|---|---|
| feasibility | researcher | options, constraints, trade-offs |
| requirements | product owner | a scoped, interrogated spec |
| planning | planner | a phased plan with dependencies |
| design | architect | interfaces, contracts, structure |
| visual design | designer | layout, states, accessibility |
| building | engineer | working, tested code |
| testing | tester | a verdict with concrete failures |
| quality | quality engineer | a quality judgment |
| shipping | release engineer | a safe rollout with a way back |
| operating | reliability engineer | health signals and runbooks |
| documentation | technical writer | a record of what shipped |
| maintenance | maintainer | a cleaner system, same behavior |

---

# Behavior is **pinned down before the code exists.**

Then it ships as thin, end-to-end slices.

---

# Quality, security, traceability, visual proof are **woven in** — not bolted on.

---

# It's a **loop, not a line.**

Production teaches you something; it re-enters as a new requirement or a bug.

---

# You can enter **mid-stream.**

A bug, a performance problem, a cleanup — start at the concern that fits.

---

<!-- _class: lead -->

# Idea → shipped → learn → again.
