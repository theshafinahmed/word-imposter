---
description: Always use project-level memory at .claude/memory/, in addition to and taking precedence over Claude Code's global auto memory
---

# Project-level memory

Claude Code has a built-in "auto memory" system that saves notes to a
folder outside this project (`~/.claude/projects/<project>/memory/`), tied
to your machine. That's useful, but it isn't part of the project and
doesn't travel with it — so this project also keeps its own memory folder,
committed alongside the code:

```
.claude/memory/
├── MEMORY.md          # Index — one line per memory, loaded first
└── <topic>.md          # One file per memory, read on demand
```

This applies to every subagent, not just the top-level assistant.

## Rules

- **Always write here too.** Whenever something worth remembering comes up
  — a user preference, a correction, project context that isn't visible in
  the code, a decision that should carry into future sessions — write it to
  `.claude/memory/`, using the same format Claude Code's own auto memory
  uses: a short entry in `MEMORY.md` pointing to a topic file with the
  detail. Do this even if the built-in global auto memory also saves it
  automatically — don't rely on the global copy alone.
- **This is the one that counts.** If `.claude/memory/` and the global auto
  memory ever disagree about something, treat `.claude/memory/` as correct
  — it's the one that's actually part of the project and reviewed by the
  team.
- **Check it early.** At the start of nontrivial work, check
  `.claude/memory/MEMORY.md` for anything relevant before assuming or
  asking the user something that's already been answered before.
- Keep `MEMORY.md` to one line per entry — put detail in the topic file, the
  same discipline Claude Code's own auto memory uses.
- Don't duplicate what belongs in `CLAUDE.md`, `.claude/rules/`, or
  `.claude/PROGRESS.md` instead — see
  `.claude/rules/document-what-you-learn.md` for which location fits which
  kind of information. Memory is for preferences, corrections, and context
  that isn't a standing instruction or a project-history entry.
