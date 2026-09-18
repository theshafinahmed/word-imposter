---
name: word-imposter-v1-decisions
description: Product-rule decisions Shafin made for the Word Imposter app's v1 scope, settled during the 2026-09-18 kickoff meeting
metadata:
  type: project
---

During the Word Imposter app kickoff meeting ([[word-imposter-kickoff-meeting]]), the team surfaced ten open product-rule questions that only Shafin could answer. He answered all of them on 2026-09-18:

1. **Imposter reveal**: the imposter's card shows an explicit "You are the Imposter" message, not a blank card or a different word.
2. **Wrong-player / "not me" flow**: no special handling needed. Trust-based — there's just a "yes, that's me" confirm button, no explicit "no" path.
3. **Accidental refresh mid-round**: progress must survive a refresh (sessionStorage-backed), not reset. Shafin clarified "round" = the whole span from player-count selection to every player having seen their word.
4. **Minimum players**: 3.
5. **Imposter count range**: 1 to (players − 2) — always at least 2 non-imposters.
6. **Duplicate player names**: allowed as-is, no blocking or auto-suffixing. Shafin explicitly said not to worry about the ambiguity this creates.
7. **Generic "Player 1/2..." mode**: still shows the "Are you Player 1?" confirmation screen, same as named mode — no simplified flow for generic mode.
8. **Name length limit**: ~15-20 characters.
9. **Dark mode**: not in v1, deferred to a later iteration.
10. **Mascot**: "Inspector Egg" — an egg/blob-shaped character in a crimson deerstalker cap holding a crimson magnifying glass, beige body. Chosen from three SVG concepts shown to Shafin (Agent Fox, Inspector Egg, Agent Bear-net).

**Why this matters**: these are all rules a future session could easily get wrong by guessing (e.g. assuming duplicate names should be blocked, or that refresh should reset). Treat this file as the source of truth for these specific behaviors — don't re-derive or re-ask unless Shafin changes his mind.

**How to apply**: Soumi's design spec and Mithi/Bishal's implementation must match these exactly. If a future request seems to contradict one of these, flag it back to the user rather than silently changing it.

11. **Word list language**: mixed/dual-language. Every word entry needs both an English form and a Bangla form, shown together on the same card (not a language-select toggle at setup) — so the data schema needs `english`, `bangla` fields per word, not a single `word` string.
12. **Word description**: every word needs a short, simple, easy-to-understand description (since not every player will know every word), shown directly alongside the word on the card — not hidden behind a tap/info icon. This applies to the imposter's card too if the imposter mode isn't just a bare "You are the Imposter" message, but confirm this doesn't apply since imposter gets a message, not a word (see decision 1) — the description field is for the real word only.

Full meeting transcript: `.claude/meetings/2026-09-18-word-imposter-app-scoping.md`.
