# Word Imposter — v1 UI/UX Design Spec

Written by Soumi, 2026-09-18. Source of truth for Mithi (frontend implementation) and Bishal (data/logic). Product-rule decisions this spec builds on live in `.claude/memory/word_imposter_v1_decisions.md` — don't contradict those without going back to the user.

Scope: 8-screen flow, card component, flip animation, native-app-feel restrictions. Style baseline for every screen unless noted otherwise:

- **Palette:** Crimson `#A31621` (primary actions, accents, mascot cap/glass), Beige `#F0E4D0` (backgrounds, mascot body, secondary surfaces), near-black text `#2B1E1A` for body copy, white/beige card surfaces.
- **Shape language:** rounded corners everywhere (buttons `border-radius: 16px`, cards `24px`), soft drop shadows (`0 4px 12px rgba(0,0,0,0.12)`), no sharp edges, no dark mode.
- **Orientation:** portrait-only (locked, see checklist).
- **Typography:** one rounded/friendly sans-serif family throughout. Minimum body text 16px, minimum tap target 48x48px (accessibility floor).
- **Buttons:** primary = filled crimson, beige text; secondary = beige fill, crimson border/text. Disabled state = 40% opacity, no shadow, non-interactive.

---

## 1. Screen-by-Screen Spec

### Screen 1 — Home

**Purpose:** entry point, brand moment.

**Layout (top to bottom, centered, generous vertical spacing):**
- App title "Word Imposter" — large, bold, crimson, top third of screen.
- Inspector Egg mascot, static (no animation required), centered, **160px height**.
- Subtitle/tagline (optional, short): "একজন লুকিয়ে আছে..." / "Find the imposter." — one line, muted color, 16px.
- Primary button: **"Start"** — full-width minus 24px margin each side, fixed to lower-middle of screen (not glued to very bottom, leave breathing room).

**State:** stateless, no loading needed (static assets only).

**Navigation:** "Start" → Screen 2 (Player Count picker).

---

### Screen 2 — Player Count Picker

**Purpose:** choose how many players (min 3, max 10 for v1).

**Layout:**
- Header: "How many players?" (24px, bold, centered, top).
- Stepper control, centered mid-screen: large `−` button, large numeral display (current count, 48px bold), large `+` button. Row is horizontally centered, generous spacing between the three elements (min 16px gaps), each tap target ≥48x48px.
- Default value on entry: **3** (the minimum).
- `−` button disabled (visually greyed, non-interactive) when count = 3.
- `+` button disabled when count = 10.
- Small helper text below stepper, muted: "Minimum 3, maximum 10 players."
- Primary button at bottom: **"Next"** — always enabled once a value is showing (it always has a valid value by construction).
- Back affordance: a simple back chevron/arrow top-left corner (crimson, 48x48 tap target) — standard on every screen from here except Home and End.

**State:** holds `playerCount` (int, 3–10) in session state.

**Navigation:** Back → Screen 1. "Next" → Screen 3.

---

### Screen 3 — Imposter Count Picker

**Purpose:** choose how many imposters, range 1 to `playerCount − 2`.

**Layout:** identical stepper pattern to Screen 2, for visual consistency.
- Header: "How many imposters?"
- Stepper, default value **1** (the minimum).
- `−` disabled at 1, `+` disabled at `playerCount − 2`.
- Helper text: "Between 1 and {playerCount − 2} imposters, so at least 2 players get the real word."
- Edge case: if `playerCount = 3`, max imposters = 1, so the stepper effectively shows a fixed "1" with both `−` and `+` disabled — this is expected and fine, no special-case screen needed.
- Primary button: **"Next"**.

**Navigation:** Back → Screen 2 (preserves the playerCount value already chosen). "Next" → Screen 4.

---

### Screen 4 — Name Mode Picker

**Purpose:** choose Named vs Generic.

**Layout:**
- Header: "How should players be identified?"
- Two large selectable cards/tiles stacked vertically, each full-width, min height 80px, rounded, tappable as a whole (not just a radio dot):
  - Tile A: **"Named"** — subtext: "Each player enters their own name."
  - Tile B: **"Generic"** — subtext: "Players are just called Player 1, Player 2, etc."
- Selected tile gets crimson border (2px) + light crimson tint background; unselected stays beige/white.
- Primary button: **"Next"** — disabled until one tile is selected (no default pre-selection, forces an explicit choice).

**Navigation:** Back → Screen 3. "Next" → if Named, Screen 5; if Generic, skip straight to Screen 6 (Confirm-identity for "Player 1").

---

### Screen 5 — Name Entry (Named mode only)

**Purpose:** collect one name per player.

**Layout:**
- Header: "Enter player names."
- Scrollable vertical list of text input fields, one per player, count = `playerCount`. Each field:
  - Small persistent label "Player {n}" above the field; placeholder inside field is empty or "Enter name" (don't rely on placeholder-only labels — accessibility anti-pattern).
  - `maxlength = 20` enforced at input level.
  - No error state for duplicates — duplicates are explicitly allowed per product decision, so there is nothing to validate here. Do not show any warning/hint about duplicates.
  - Every field must be non-empty to enable "Next". If left blank, just keep the button disabled with a small static helper line: "Fill in all names to continue." — no red error banner.
- Primary button "Next" pinned at bottom, disabled until all fields non-empty.

**State:** holds `names: string[]` array, index-aligned to player order.

**Navigation:** Back → Screen 4. "Next" → Screen 6, starting at player index 0.

---

### Screen 6 — Confirm-Identity

**Purpose:** trust-based handoff checkpoint before each player sees their card. Shown once per player, first for player 0 after setup, then again after every "Hand it over" tap.

**Layout:**
- Large centered text: **"Are you {Name}?"** (Name = the entered name, or "Player {n}" in Generic mode). Font size large, 28-32px, bold, centered both axes roughly (upper-middle of screen).
- Below it, smaller muted line: "Make sure no one else is looking."
- One single large button, centered lower half: **"Yes, that's me"** — full-width minus margins, min height 56px. This is the *only* interactive element on the screen (no back button here — going back mid-handoff would break the trust flow).
- No mascot needed here — keep this screen sparse and fast, it's a checkpoint, not a moment.

**Navigation:** "Yes, that's me" → Screen 7 (Card screen) for the current player, always starting in face-down state.

---

### Screen 7 — Card Screen

Full detail in Section 2 (Card Component Spec) and Section 3 (Flip Animation). Navigation summary:

- Face-down state: shows mascot + name + Reveal button.
- Tapping Reveal → flips to face-up (word+description, or imposter message).
- Face-up state shows Hide button (returns to face-down, reveal is *not* lost) and, once revealed at least once, a **"Hand it over to {NextName}"** button.
- If current player is the **last** player in the order: the handoff button's copy changes to **"Finish"** instead of "Hand it over to..." and it navigates to Screen 8 instead of looping back to Screen 6.
- Otherwise: "Hand it over to {NextName}" → Screen 6, with the confirm-identity prompt now for the next player in sequence.

**State per player:** `revealed: boolean` (has this player revealed at least once — controls whether the handoff button exists at all), `faceUp: boolean` (current visual state, toggled by Reveal/Hide, independent of `revealed` once `revealed` is true).

---

### Screen 8 — End Screen

**Purpose:** clean close to the round, offer restart.

**Layout:**
- Mascot, same asset is fine (no new pose required for v1) — centered, 140-160px.
- Header: **"All done!"** (large, bold, centered).
- Subtext: "Everyone's seen their card. Time to talk it out!"
- Primary button: **"Start New Round"** — full width minus margins.

**Navigation:** "Start New Round" → Screen 1 (Home), and clears all session state (`playerCount`, `imposterCount`, `names`, `revealed`/`faceUp` per player, imposter assignment) so nothing carries over. Per decision 3, a mid-round refresh must restore progress — but an explicit "Start New Round" tap is a deliberate reset, not an accidental refresh, so it's correct for this button to wipe state.

---

## 2. Card Component Spec

One component, three states. Applies to Screen 7 only.

### Shared card shell (all states)
- Card container: rounded rect, `border-radius: 24px`, centered on screen, width ~85% of viewport (max 400px), fixed aspect ratio roughly 3:4 (portrait card shape), soft shadow `0 6px 20px rgba(0,0,0,0.15)`, beige `#F0E4D0` background.
- Card sits in the vertical middle of the screen; buttons live below the card, not inside it, so the card's content area never has to make room for controls.

### State A — Face-down
- Top area of card: current player's name (or "Player n"), centered, bold, 20px, crimson text.
- Center of card: Inspector Egg mascot, **120px height**, centered.
- Below mascot inside card: short static line, muted: "Tap Reveal to see your card."
- Below the card (outside it): primary button **"Reveal"**, full width minus margins.
- No handoff button visible in this state.

### State B — Face-up, real word
- Top of card: small crimson label "Your word".
- Center-upper: English word, large bold, 28px, centered.
- Directly below it: Bangla word, large bold, 24px, centered, same visual weight family (peer word, not a translation footnote — both shown together per decision 11).
- Divider line (thin, subtle, crimson at 20% opacity) between the word pair and the description.
- Below divider: short plain-language description, 16px, regular weight, left-aligned (indented to match card padding), always visible, never behind a tap/icon.
- No mascot in this state.
- Below the card: **"Hide"** button (secondary style) and, once `revealed` has been set true, **"Hand it over to {NextName}"** (primary, filled) beneath it. Stack order: Hide above, Hand-it-over below, 12px gap between.

### State C — Face-up, imposter
- Card background stays identical (beige, same shell) — **do not** recolor the card differently for imposter vs. real word. Recoloring would let an observer glancing at *card color* infer who's the imposter, defeating the face-down privacy mechanic. Only the content inside differs.
- Center of card: single message, large bold, 28px, centered: **"You are the Imposter"**.
- Below it, smaller supporting line, 16px, centered: "You don't get a word — try to blend in!"
- No word, no Bangla text, no description, no mascot.
- Below the card: same **"Hide"** / **"Hand it over to {NextName}"** button pair as State B, identical positioning — button layout must not differ between B and C, so nothing about the button area leaks which state the player is in.

---

## 3. Flip Animation Spec

**Trigger:** tapping **Reveal** (face-down → face-up) or **Hide** (face-up → face-down).

**Mechanic:** genuine card flip, not a fade or slide.

- **Axis:** vertical (rotate around the Y-axis) — `transform: rotateY()` on the card element (CSS 3D transform, `perspective: 1000px` on the parent container).
- **Duration:** 400ms total for the full flip.
- **Easing:** `ease-in-out` (`cubic-bezier(0.4, 0, 0.2, 1)`).
- **Privacy requirement:** at no point during the transition should both faces, or a blended/ghosted combination of both, be visible. Implement via two separate DOM faces (`.card-front` / `.card-back`) each with `backface-visibility: hidden`, absolutely positioned in the same spot, one rotated 180° from the other — use the standard two-face flip-card CSS pattern, not a manually-timed midpoint content swap.
- **Hide button behavior:** Hide performs the same flip animation in reverse. It does **not** discard the reveal — `revealed` stays `true`, only `faceUp` toggles to `false`. Re-tapping Reveal after Hide flips forward again to the *same* word/imposter-message content already assigned to that player (word assignment is fixed once per player per round, never re-rolled).
- **Reduced motion:** respect `prefers-reduced-motion: reduce` — skip rotation, cross-fade over 150ms instead (fade old content to 0 opacity, then fade new content in, with a brief blank/beige frame in between — no overlapping cross-dissolve).
- No entrance animation needed on the handoff button appearing — keep that transition boring.

---

## 4. Native-App-Feel Restrictions Checklist

**Meta tags (in `<head>`):**
- `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">` — disables pinch-zoom.
- `<meta name="mobile-web-app-capable" content="yes">` — standalone app feel when added to home screen.
- `<meta name="apple-mobile-web-app-capable" content="yes">` and `<meta name="apple-mobile-web-app-status-bar-style" content="default">` — iOS standalone/status-bar behavior.
- `<meta name="theme-color" content="#A31621">` — crimson browser chrome/status bar tint.

**Web app manifest (`manifest.json`):**
- `"display": "standalone"` — removes browser URL bar/chrome when launched from home screen.
- `"orientation": "portrait"` — requests portrait lock at the manifest level.

**Orientation lock (runtime, since manifest lock isn't honored everywhere):**
- Call `screen.orientation.lock('portrait')` on load where the Screen Orientation API is supported; wrap in a try/catch since it's not universally supported (e.g. desktop Safari) — fail silently, don't block the app if the API is unavailable.

**Disable pinch-zoom (CSS, belt-and-suspenders alongside the viewport meta tag):**
- `touch-action: manipulation;` on `html, body`.

**Disable text selection:**
- `user-select: none; -webkit-user-select: none; -ms-user-select: none;` on `html, body` (global). Override locally with `user-select: text` if any future screen needs selectable text (none in v1).

**Disable pull-to-refresh:**
- `overscroll-behavior-y: contain;` on `html, body`.

**Disable long-press context menu / callout (cards and buttons):**
- `-webkit-touch-callout: none;` on card and button elements.
- `-webkit-user-drag: none;` on the same elements (relevant for the mascot SVG).
- Add a `contextmenu` event `preventDefault()` handler on the card container and all buttons, on top of the CSS callout suppression (CSS alone doesn't cover Android Chrome's long-press menu in all cases).

**General:**
- No `<a>` tags with `href` navigation for in-app buttons — use `<button>` elements exclusively.
- Double-tap zoom is already covered by `user-scalable=no` + `touch-action: manipulation`; no extra JS debouncing needed for v1.

---

## Mascot Placement

Reusing the existing Inspector Egg SVG (egg/blob body, crimson deerstalker cap, crimson magnifying glass, beige body, flat fill + thick rounded outline, crimson `#A31621` + beige `#F0E4D0`) — no redesign needed.

| Screen/state | Size (height) | Notes |
|---|---|---|
| Home (Screen 1) | 160px | Static, centered, no animation required for v1. |
| Card, face-down state (Screen 7, State A) | 120px | Centered inside the card, above the "Tap Reveal" line. Must stay a clear silhouette at this size. |
| End screen (Screen 8) | 140–160px | Same static asset reused, no new pose needed for v1. |

Mascot does **not** appear on: Player Count, Imposter Count, Name Mode, Name Entry, Confirm-identity, or the face-up card states (word/imposter).

---

## Design-team judgment calls (not sent to the user — documented so no one silently changes them)

- Max player count capped at 10 for v1 — arbitrary but sane upper bound, not a product rule.
- Card background/shell is intentionally identical between the real-word and imposter states (Section 2, State C) to prevent inferring the imposter by card color alone from across the table. **Do not** give the imposter card a different tint later without checking back — it would quietly break the game's privacy model.
