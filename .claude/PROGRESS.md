<!--
TEMPLATE — this is Ridwan's (.claude/agents/ridwan-docs.md) running progress
log for the project, not a log of this template repo itself. Clear the
example entries below when you start a real project from this template, but
keep the format.

Newest entries at the top. Each entry should be short enough to skim in a
few seconds — this is a log, not a report.
-->

# Progress log

## Format

```
## YYYY-MM-DD — Short title
- What changed: ...
- Why: ...
- Owner / follow-up: who owns anything still open, or "none"
```

## In progress

<!-- Work that's started but not done. Remove an item once it's finished
     and logged below, or moved to Blocked. -->

- (none)

## Blocked

<!-- Work that can't proceed and why, so it isn't silently forgotten. -->

- (none yet)

## Completed

## 2026-09-18 — Word Imposter v1 shipped
- What changed: full pipeline complete for v1. Rubaiya scoped the work from
  the kickoff decisions; Soumi produced the design spec
  (`.claude/design/word-imposter-v1-spec.md`); Bishal built the data/logic
  layer (`src/logic/`, `src/data/words.json`); Mithi built the frontend
  (screens, components, router, PWA shell). Sraboni QA'd the result against
  acceptance criteria and found two bugs, both fixed before sign-off: the
  setup wizard not surviving a refresh, and a reduced-motion cross-fade that
  leaked the imposter's identity. Mahir then reviewed the diff and found two
  more issues, also fixed: unversioned service-worker cache naming (now
  stamped at build time, see `vite.config.js`) and missing defensive shape
  validation on sessionStorage reads (now in `src/logic/persistence.js`).
  The top-level assistant additionally re-verified both QA fixes in a real
  mobile-viewport browser session. Product-rule decisions behind the build
  are recorded in `.claude/memory/word_imposter_v1_decisions.md`, not
  repeated here.
- Why: this was the initial build of the project's core feature — a
  full pass-and-play round flow (setup → per-player reveal → end) — per the
  2026-09-18 kickoff scoping.
- Owner / follow-up: none open. All bugs found during QA and review are
  resolved, not outstanding.
