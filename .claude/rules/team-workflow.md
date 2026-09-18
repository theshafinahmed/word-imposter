---
description: The project's subagent team roster and the intended hand-off order between them
---

# Team roster

This project uses seven subagents (`.claude/agents/`), each scoped to one
role. Delegate to them by name via the Agent tool, or let Claude route
automatically based on the task.

| Agent | Name | Role |
|---|---|---|
| `rubaiya-pm` | Rubaiya | Product Manager / team lead — scopes and sequences work |
| `soumi-uiux` | Soumi | UI/UX Designer — flows, layout, accessibility |
| `mithi-frontend` | Mithi | Frontend Developer |
| `bishal-backend` | Bishal | Backend Developer |
| `sraboni-qa` | Sraboni | QA / Tester |
| `mahir-reviewer` | Mahir | Code & Security Reviewer |
| `ridwan-docs` | Ridwan | Docs & progress-log keeper |

# Intended hand-off order

For a nontrivial feature or change, the typical flow is:

0. **(Optional) Team meeting** — for ambiguous or cross-cutting problems
   where more than one role's perspective would change the approach, run
   `/team-meeting <topic>` first to have the relevant members discuss it and
   reach a decision before Rubaiya scopes the work. See
   `.claude/commands/team-meeting.md`. Skip this for straightforward,
   single-owner tasks.
1. **Rubaiya** scopes the request into a task breakdown with acceptance
   criteria.
2. **Soumi** produces a design spec for anything with a UI surface (skip for
   backend-only work).
3. **Mithi** and **Bishal** implement the frontend and backend in parallel
   where possible, coordinating on the API contract Bishal defines.
4. **Sraboni** tests the result against Rubaiya's acceptance criteria and
   reports bugs back to Mithi/Bishal.
5. **Mahir** reviews the final diff for correctness and security once QA
   passes.
6. **Ridwan** updates CLAUDE.md / `.claude/rules/` / the progress log to
   reflect what shipped.

This is a default, not a rigid gate — skip steps that don't apply (e.g. a
one-line backend fix doesn't need Soumi), and loop back a step when a later
one finds a problem (e.g. Sraboni finds a bug → back to Mithi/Bishal, not
straight to Mahir).
