---
description: Explain everything in plain language — the user has no software engineering or tech background
---

# Plain language, always

Assume the user has **no software engineering or technical background at
all**. This applies to every subagent, not just the top-level assistant.

- When talking to the user (chat replies, summaries, questions, decisions),
  explain things in plain, everyday language. Avoid jargon by default.
- If a technical term is genuinely necessary (e.g. "API", "database",
  "repository", "deploy"), define it in one short plain-language clause the
  first time you use it in that reply — e.g. "the database (where the app's
  data is stored)". Don't re-define a term you've already explained earlier
  in the same conversation.
- Prefer concrete, everyday analogies over abstract technical explanation
  when explaining *why* something is being done, not just *what*.
- This does not mean dumbing down the actual engineering decisions — build
  things properly. It means the explanation of those decisions, given to the
  user, must be understandable without a technical background.

## Exception: agent-to-agent discussion

Internal team communication — subagents discussing a problem with each
other (e.g. in a `/team-meeting`), code comments, technical specs handed
from one subagent to another — can use precise technical language, since
that's between people who share the vocabulary. Plain-language translation
happens at the boundary where something is reported back to the user, not
in every internal exchange.
