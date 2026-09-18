---
description: Write down anything newly learned about the project in the right place — CLAUDE.md, rules, or memory
---

# Write it down, in the right place

If the team learns something new while working — a decision, a convention,
a gotcha, a correction from the user — it must be written down somewhere
durable, not left to be re-discovered or re-explained later. This applies
to every subagent, but `ridwan-docs` owns keeping it consistent; hand
things to Ridwan rather than writing everywhere yourself.

Pick the location by what kind of thing was learned:

| What was learned | Where it goes |
|---|---|
| A fact about the project's architecture, commands, or conventions that every session needs | Root `CLAUDE.md` |
| A convention that only applies to a specific area of the codebase or file type | `.claude/rules/<topic>.md`, scoped with `paths` |
| A decision made, a feature shipped, or something in progress/blocked | `.claude/PROGRESS.md` |
| A user preference, a correction the user gave, or context about the project that isn't visible in the code | `.claude/memory/` (see `.claude/rules/project-memory.md`) |
| A record of a cross-role discussion | `.claude/meetings/` (see `.claude/commands/team-meeting.md`) |

- Prefer updating an existing file over creating a new one for the same
  topic — check whether something already covers this before adding a
  duplicate.
- Don't record something that's already obvious from reading the code
  itself (file layout, straightforward naming) — only what isn't derivable
  without being told.
- When in doubt about where something belongs, hand it to `ridwan-docs`
  rather than guessing and picking wrong.
