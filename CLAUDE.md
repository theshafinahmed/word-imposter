# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Word Imposter is a client-side-only party-game companion PWA (progressive
web app — an installable, offline-capable website) for the classic
"imposter" word game. One device is passed around the group: each player in
turn confirms their identity, sees a face-down card, reveals it privately,
then hands the device to the next player. Everyone except the imposter(s)
sees the same word (in English and Bangla, plus a short description); the
imposter sees an explicit "You are the Imposter" message instead. There is
no server, no accounts, and no network calls at runtime — the word list
ships bundled with the app.

## Architecture

- **Stack**: Vite + vanilla JavaScript. No UI framework (React/Vue/etc.) and
  no backend — the app is fully client-side, deployed as static files.
- **Commands**: `npm run dev` (local dev server), `npm run build` (production
  build to `dist/`), `npm run preview` (serve the built output locally).
- **File structure**:
  - `src/logic/` — framework-agnostic game logic (no DOM code): `validation.js`
    (input/round-setup validation), `persistence.js` (sessionStorage
    read/write), `gameState.js` (round creation and turn-state transitions).
  - `src/data/words.json` — the bundled word list. Each word has `english`,
    `bangla`, and `description` fields (both languages shown together on the
    card, not a language toggle), grouped under categories.
  - `src/screens/*.js` — one file per screen, one render function each:
    `home.js`, `playerCount.js`, `imposterCount.js`, `nameMode.js`,
    `nameEntry.js`, `confirmIdentity.js`, `card.js`, `end.js`.
  - `src/components/*.js` — shared UI pieces used across screens:
    `stepper.js`, `backButton.js`, `flipCard.js` (the two-face flip-card
    shell, no game-state knowledge of its own).
  - `src/main.js` — app bootstrap and screen router; owns which screen is
    shown and delegates all actual state transitions to `src/logic/gameState.js`.
  - `src/dom.js` — a small imperative DOM-element builder helper, used in
    place of a templating engine/framework.
  - `src/mascot.js` — the "Inspector Egg" mascot SVG.
  - `src/nativeAppFeel.js` — applies native-app-like restrictions (disabled
    zoom/text-selection/pull-to-refresh, portrait lock).
  - `src/style.css` — global styles.
  - `public/manifest.json`, `public/sw.js` — PWA setup. `public/sw.js` is a
    cache-first app-shell service worker; its `CACHE_NAME` contains a
    `__CACHE_VERSION__` placeholder that a custom Vite plugin in
    `vite.config.js` (`stampServiceWorkerCacheVersion`) substitutes at build
    time with the package version + build timestamp, so every deploy gets a
    fresh cache name and old caches are cleaned up on activate. **Don't
    hand-edit the `CACHE_NAME` value in `public/sw.js`** — it's a build-time
    placeholder, not a literal string.

## Conventions & gotchas

- **One screen, one file.** Each file in `src/screens/` renders exactly one
  screen; this is the atomic-components rule (`.claude/rules/atomic-components.md`)
  actively applied to this codebase's UI layer.
- **`src/logic/` must stay framework-agnostic.** No DOM access, no rendering
  — it's the model layer and is imported by both the router (`main.js`) and
  the screens. Keep any new game-logic code here instead of inline in a
  screen file.
- **sessionStorage is the only persistence** — there is no real backend. In
  this project, "Bishal" (backend developer, per the team roster) owns the
  data/logic layer (`src/logic/`, `src/data/words.json`), not a literal
  server.
- **The card's visual shell must stay identical between the real-word and
  imposter states** (same background/shape for both `flipCard.js` states) —
  this is a deliberate privacy decision to prevent an observer from
  inferring who's the imposter just by glancing at card color from across
  the table. Don't "fix" this into a visually distinct imposter card without
  checking the closing note in `.claude/design/word-imposter-v1-spec.md`
  first.
- A "round" is defined as the whole span from player-count selection through
  every player having seen their word — the setup wizard's in-progress state
  is persisted the same way round state is, so a refresh mid-setup resumes
  correctly. See `.claude/memory/word_imposter_v1_decisions.md` for this and
  other product-rule decisions.
