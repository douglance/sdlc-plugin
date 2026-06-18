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

## What it is

- The software lifecycle, broken into **phases** — distinct **concerns**:
  feasibility, requirements, planning, design, building, testing, quality,
  shipping, operating, maintaining.
- Each phase is owned by a **specialist** focused on that one concern.
- Work flows from concern to concern as the idea becomes a shipped product.

> Separation of concerns — applied to the *process*, not just the code.

---

## The big idea

- Each phase is a **distinct concern**, handled in isolation.
- Each concern has a dedicated **specialist** who handles nothing else.
- The specialist for requirements never builds; the builder never sets scope.

**One concern, one specialist, one clear responsibility.**

---

## The method is separate from the doer

- **What each specialist does — the method — is defined independently of the specialist.**
- The process is the **source of truth**; the specialist merely carries it out.
- Two specialists can share a method; a method can be refined without touching the people.

> The discipline lives in the process, not in any individual.

---

## Work moves as handoffs

- Each phase produces a concrete **work product** — a spec, a plan, a design,
  working code, a test verdict, a release.
- That work product becomes the **next phase's starting point**.
- **Nothing is passed as vague intent.** Every handoff is something you can hold up and inspect.

---

## The scope boundary travels with the work

- Every unit of work declares what it **will not** touch.
- That boundary **travels with the work** through every phase.
- It constrains everyone — no specialist quietly expands the job.

> What's out of scope is as binding as what's in it.

---

## The defining stance: falsification

- Requirements and claims of correctness are **hypotheses to disprove**, not confirm.
- **Requirements** interrogates the spec to *break* it before anything is built.
- **Testing** executes the change to *break* it before it ships.

**You earn confidence by failing to falsify — not by asserting success.**

---

## The pipeline

```
feasibility → requirements → planning → design → visual design
   → building → testing → quality → shipping → operating → maintaining

   ↺ what you learn in production
     re-enters as new requirements, or a bug to root-cause
```

- Every arrow is a **work-product handoff**.
- Skip any phase the work doesn't need.

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

## A closer look: requirements

- Treats every stated requirement as a **claim to disprove**.
- Probes scope, edge cases, failure modes, hidden assumptions.
- Produces a **scoped spec** and sets the **boundary** the rest of the work inherits.

> The spec earns its place by surviving interrogation.

---

## A closer look: building

- The intended behavior is **pinned down before the code exists**.
- Work ships as **thin, end-to-end slices** — not big layers assembled blind.
- What's handed off is **working, demonstrated** behavior, not a draft.

---

## Cross-cutting concerns

Woven through every phase — not bolted on at the end.

- **Quality** — defined up front, challenged throughout, judged before shipping.
- **Security** — threats named in requirements, guarded in design, attacked in testing.
- **Traceability** — each requirement stays linked through design, building, and testing.
- **Visual verification** — for anything visual, the rendered result is the proof.

---

## A loop, not a line

- The lifecycle **bends back on itself**.
- Production teaches you something → it **re-enters** as a new requirement or a bug to root-cause.
- You can also **enter mid-stream**: a bug, a performance problem, a cleanup —
  start at the concern that fits.

---

<!-- _class: lead -->

## The takeaway

- The lifecycle is a chain of **concerns**, each owned by a **specialist**.
- The **method is the source of truth**; specialists carry it out.
- Work moves as **inspectable handoffs**, inside a **scope boundary** that travels with it.
- The stance is **falsification**, and the shape is a **loop**.

**Idea → shipped → learn → again.**
