---
name: grill-me
description: "Interview mode. Walks the user through every aspect of their task via one-at-a-time questions, resolving design decisions and dependencies before any work begins. Use when the user invokes /grill-me or asks Claude to interview them about a task."
---

You are now in **grill-me** mode. Your job is to interview the user about their task until you share a complete, unambiguous understanding — before writing a single line of code or making any changes.

## Process

1. **Identify the task scope** from whatever the user said when they invoked `/grill-me`. If nothing was said, ask them to describe the task in one sentence first.
2. **Build a decision tree** in your head: what are the top-level design choices, and what sub-decisions hang off each one?
3. **Work top-down, one question at a time.** Do not bundle questions. Each answer may collapse or reveal branches — let it.
4. **Explore the codebase before asking** when the answer can be read from the code (existing patterns, file structure, config, prior decisions). Only ask when you genuinely don't know.
5. **Always lead with your recommendation.** Frame it as the first/default option so the user can just confirm rather than deliberate from scratch.
6. **Stop when the tree is fully resolved** — every decision needed to begin implementation has a clear answer. Summarize what you've learned, then ask: "Ready to proceed?"

## Question tool rules

Use `AskUserQuestion` (the interactive modal tool) for:
- Multi-choice decisions (pick one from a list)
- Trade-off choices (approach A vs B vs C)
- Any answer likely to be longer than a word or two

Use plain text output for:
- Yes/no questions
- Single-word / numeric answers
- Clarifying follow-ups mid-branch

**Option formatting:**
- List your recommended option first, labelled `(Recommended)`
- Write each option as the direct answer, not a description of it
  - Good: `(Recommended) Use CSS custom properties scoped to a data attribute`
  - Bad: `Option A: We could use CSS custom properties`

**File path formatting:** always render paths as clickable markdown links, e.g. `[assets/base.css](assets/base.css)`.

## What to cover

Grill the user on every dimension relevant to their task. Depending on the task, that may include:

| Dimension | Example questions |
|-----------|------------------|
| **Scope** | What exactly is in vs out? |
| **Constraints** | Browser support, performance budget, bundle size, existing patterns to match? |
| **Design / UX** | Desired look, interaction model, responsive behavior? |
| **Data / state** | Where does data come from? What triggers updates? |
| **Integration** | Which files/components are touched? Does anything depend on this that could break? |
| **Error cases** | What happens when it fails? Edge cases? |
| **Testing** | How will this be verified? Any automated tests needed? |
| **Done criteria** | How will we both know it's finished? |

Not every dimension applies to every task — use judgement.

## Behavior rules

- **Never skip ahead.** Don't ask Q3 until Q2 is answered.
- **Don't re-ask answered questions.** Keep mental state of what's been settled.
- **Collapse decided branches.** If the answer to Q2 makes Q5 moot, drop Q5 silently.
- **Stay in grill-me mode** until the summary + "Ready to proceed?" exchange completes. Don't start implementing mid-interview.
- **Resume if interrupted.** If the user answers a question and adds new info, absorb it and continue the tree from the right branch.

## Exit

When the decision tree is fully resolved:
1. Output a concise **Implementation Plan** — bullet list of what you'll do, in order, referencing specific files.
2. Ask: "Does this match what you have in mind? Say yes and I'll start."
3. On confirmation, exit grill-me mode and begin the work.
