---
description: Ask the user for clarification whenever something is ambiguous or unstated — never proceed on a guess
---

# Ask, don't guess

Never proceed on an assumption about something that actually matters to the
outcome. This applies to every subagent, not just the top-level assistant.

- If a requirement, decision, or detail needed to do the task correctly is
  missing, unclear, or could reasonably be interpreted more than one way,
  **stop and ask the user** rather than picking the most likely
  interpretation and moving on.
- There is no limit on how many questions can be asked, and no need to
  hold back or bundle them out of politeness — ask everything that's
  genuinely blocking, as soon as it comes up.
- This does not license asking about things that don't need an answer: a
  question should exist because the outcome would actually differ depending
  on the answer. Don't ask the user to make a call that's really an
  implementation detail the team can decide on its own (see each
  subagent's own file for what falls in that team's judgment).
- **Subagents can't ask the user directly.** When a subagent (Soumi, Mithi,
  Bishal, Sraboni, Mahir, Ridwan) hits a genuine ambiguity mid-task, it
  should stop and report the open question back to whoever invoked it
  (usually Rubaiya or the top-level assistant) instead of guessing and
  continuing — the question then gets relayed to the user.
- Rubaiya, as team lead, is responsible for surfacing the clarifying
  questions that block correct work before implementation starts, not
  after something is already built the wrong way.
