# Meeting: Word Imposter app — initial scoping
2026-09-18

**Attendees:** Rubaiya (PM, moderator), Soumi (UI/UX), Mithi (Frontend), Bishal (Backend), Sraboni (QA)

## Discussion

**Rubaiya:** Framed the project — "Word Imposter" is a party-game companion PWA. One phone is passed hand-to-hand; each player checks their own secret word (or imposter status) via a card-flip reveal, then hands off to the next player. Style: cute, cozy, cartoonish, crimson + beige palette. PWA with native-app feel (disabled zoom/text-selection/pull-to-refresh). Assigned each teammate a set of open questions to discuss before anything goes to the user.

**Soumi:** Recommends a plain CSS `transform: rotateY` flip (no animation library). "Cute cartoonish" = rounded/blob shapes, soft drop-shadows, a small friendly mascot (spy/detective themed) on the card back, rounded-stroke filled icons. Suggests skipping dark mode for v1, but flags it as needing confirmation. Flow concerns: undefined "No, not me" behavior on the confirm screen; the reveal needs an explicit "Hide" button rather than relying on accidental re-tap, to avoid other players glimpsing the word; needs a clear end screen after the last player's handoff instead of a dead end; recommends locking to portrait orientation; the handover screen should show only a large "I am [Name]" button (not a clickable card) to prevent accidental flips while physically passing the phone.

**Mithi:** Recommends a lightweight frontend stack (Preact/Svelte/vanilla over React/Next, since this is a fresh repo and a simple single-page flow with no routing needed — final pick is an implementation detail, not something that needs the user's input). PWA via a manifest and a simple cache-first service worker (no server data to sync, so "offline" just means the app shell loads without a network). Recommends `sessionStorage` for game state so an accidental refresh doesn't wipe an in-progress round, but flags persist-vs-reset as needing user confirmation. Zoom/select/pull-to-refresh disabling and portrait lock are standard CSS/manifest settings, no library needed.

**Bishal:** No backend needed for v1 — the whole app is client-side. The word list ships as a bundled, categorized JSON file (e.g. animals/food/professions). Imposter assignment and randomization are plain client-side JS logic, not server-side business logic. A backend could matter later only for remote/multi-device play, word-list administration, or analytics — out of scope now. Flags a core game-rule ambiguity: does the imposter get nothing/blank, an explicit "You are the Imposter" message, or a different-but-related word? All three are real variants of this game, and the answer determines the word-list's data structure.

**Sraboni:** Compatibility focus should be iOS Safari (no real install prompt, stricter service worker/storage rules, more aggressive storage clearing on reload) and Android Chrome, since a party game means random people's random phones. Edge cases raised: a 1-player game breaks the pass-and-play concept (allow it, or enforce a minimum?); 0 imposters is possible but pointless (allow, or enforce a minimum of 1?); imposter count at or above player count needs a validation ceiling (exact number is a product call); duplicate player names make "Are you Rafi?" ambiguous with two Rafis (block duplicates, or auto-suffix?); very long names could break card layout (QA will test it, but the max length is a design call); and generic "Player 1/2" mode makes the "Are you Player 1?" confirmation feel odd without a real name to anchor to — questions whether generic mode needs a confirmation step at all, versus a simple fixed-order "It's Player 1's turn" handoff.

**Rubaiya (closing):** No real disagreement surfaced — the team converged naturally on "no backend, lightweight client-side PWA, plain CSS for the flip/native-feel restrictions." Synthesized the tech direction and consolidated every open item into one list for the user.

## Decision

- **No backend for v1.** Fully client-side app. Word list ships as bundled, categorized JSON. Imposter assignment/randomization is client-side JS logic.
- **Lightweight frontend stack** (exact framework — Preact/Svelte/vanilla — is Mithi's implementation call, not a user decision).
- **PWA** via manifest + simple cache-first service worker.
- **Plain CSS** for the card-flip animation, portrait lock, and disabling zoom/text-selection/pull-to-refresh — no extra libraries needed for any of this.

## Open questions
(all sent to Shafin — see chat for his answers)

1. Imposter reveal rule: blank card, explicit "You are the Imposter" message, or a different-but-related word?
2. "No, not me" flow: what happens when the wrong person is at the confirm screen?
3. Refresh/session persistence: should an accidental refresh preserve the in-progress round, or reset it?
4. Minimum players: allow a 1-player game, or enforce a minimum (e.g. 3)?
5. Imposter count validation: allow 0 imposters? What's the max relative to player count?
6. Duplicate player names: block them, or auto-suffix (e.g. "Rafi 2")?
7. Generic "Player 1/2" mode: keep the "Are you Player 1?" confirmation step, or switch to a simpler fixed-order handoff?
8. Name length limit: what's the max character count before it risks breaking the card layout?
9. Dark mode: needed for v1, or later?
10. Mascot / visual style: include a spy/detective-themed mascot on the card back? Any specific visual reference to follow?
