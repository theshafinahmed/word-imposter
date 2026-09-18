/**
 * persistence.js
 *
 * One job: save, load, and clear state in sessionStorage, so an in-progress
 * round — and the setup wizard that leads into it — survives an accidental
 * page refresh but does not persist across browser sessions/tabs (per
 * product decision 3, which defines a "round" as starting at player-count
 * selection, not at round-creation).
 *
 * This module knows nothing about how round/setup state is built, mutated,
 * or which screen renders it — it just serializes/deserializes whatever
 * object it's given under one of two keys. Screen-routing logic (which
 * setup screen to resume into) belongs to main.js, not here.
 */

const STORAGE_KEY = "word-imposter:round-state";
const SETUP_STORAGE_KEY = "word-imposter:setup-state";

/**
 * Minimal structural sanity check for a parsed round-state object — just
 * enough to decide "is this safe to hand back" so downstream code
 * (main.js, gameState.js) never has to defend against a malformed shape.
 * This is not game-rule validation (see validation.js for that); it only
 * checks the fields downstream code indexes into without a guard.
 * @param {unknown} value
 * @returns {boolean}
 */
function isValidRoundStateShape(value) {
  if (!value || typeof value !== "object") return false;
  const { players, currentPlayerIndex, word } = value;
  if (!Array.isArray(players) || players.length === 0) return false;
  if (
    !Number.isInteger(currentPlayerIndex) ||
    currentPlayerIndex < 0 ||
    currentPlayerIndex >= players.length
  ) {
    return false;
  }
  if (!word || typeof word !== "object") return false;
  return true;
}

/**
 * Minimal structural sanity check for a parsed setup-state object — confirms
 * `screen` is present and any fields that ARE present have the right basic
 * type, without re-validating game rules (that's validation.js's job).
 * @param {unknown} value
 * @returns {boolean}
 */
function isValidSetupStateShape(value) {
  if (!value || typeof value !== "object") return false;
  if (typeof value.screen !== "string" || value.screen.length === 0) return false;
  if (
    value.playerCount !== undefined &&
    !Number.isInteger(value.playerCount)
  ) {
    return false;
  }
  if (
    value.imposterCount !== undefined &&
    !Number.isInteger(value.imposterCount)
  ) {
    return false;
  }
  if (value.names !== undefined && !Array.isArray(value.names)) return false;
  return true;
}

/**
 * Saves the round state to sessionStorage, overwriting any previous value.
 * Call this after every state change (new round, reveal/hide, advance, etc.).
 * @param {object} roundState
 */
export function saveRoundState(roundState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(roundState));
  } catch (err) {
    // sessionStorage can fail in private/incognito modes with strict quotas,
    // or if it's unavailable entirely. Fail silently — losing persistence
    // shouldn't crash an otherwise-playable round.
    console.warn("word-imposter: failed to save round state", err);
  }
}

/**
 * Loads the round state from sessionStorage, if any.
 * @returns {object|null} the saved round state, or null if none/invalid.
 */
export function loadRoundState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidRoundStateShape(parsed)) {
      console.warn("word-imposter: saved round state has an unexpected shape, discarding it");
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn("word-imposter: failed to load round state", err);
    return null;
  }
}

/**
 * Clears any saved round state. Also clears any saved setup state, since a
 * round and the setup that led into it are the same "round" per decision 3
 * — callers like "Start New Round" should never leave stale setup data
 * behind after wiping the round itself.
 */
export function clearRoundState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("word-imposter: failed to clear round state", err);
  }
  clearSetupState();
}

/**
 * Checks whether a round is in progress (i.e. there's a saved, non-null
 * round state). Used on app load to decide whether to resume or show Home.
 * @returns {boolean}
 */
export function hasInProgressRound() {
  return loadRoundState() !== null;
}

/**
 * @typedef {Object} SetupState
 * @property {string} screen - which setup screen to resume into, e.g.
 *   "playerCount" | "imposterCount" | "nameMode" | "nameEntry"
 * @property {number} [playerCount]
 * @property {number} [imposterCount]
 * @property {"named"|"generic"} [mode]
 * @property {string[]} [names] - partially-entered names, index-aligned to player order
 */

/**
 * Saves the in-progress setup-wizard state (Player Count / Imposter Count /
 * Name Mode / Name Entry screens) to sessionStorage, overwriting any
 * previous value. Call this after every change on those screens — selecting
 * a count, choosing a mode, typing a name, or navigating between them.
 * @param {SetupState} setupState
 */
export function saveSetupState(setupState) {
  try {
    sessionStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(setupState));
  } catch (err) {
    // Same rationale as saveRoundState: fail silently, don't crash setup.
    console.warn("word-imposter: failed to save setup state", err);
  }
}

/**
 * Loads the in-progress setup-wizard state from sessionStorage, if any.
 * @returns {SetupState|null} the saved setup state, or null if none/invalid.
 */
export function loadSetupState() {
  try {
    const raw = sessionStorage.getItem(SETUP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidSetupStateShape(parsed)) {
      console.warn("word-imposter: saved setup state has an unexpected shape, discarding it");
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn("word-imposter: failed to load setup state", err);
    return null;
  }
}

/**
 * Clears any saved setup-wizard state. Used once a round is actually
 * created (the wizard is done, so its in-progress state is no longer
 * relevant) and by "Start New Round" via clearRoundState.
 */
export function clearSetupState() {
  try {
    sessionStorage.removeItem(SETUP_STORAGE_KEY);
  } catch (err) {
    console.warn("word-imposter: failed to clear setup state", err);
  }
}

/**
 * Checks whether a setup wizard is in progress (i.e. there's a saved,
 * non-null setup state). Used on app load to decide whether to resume into
 * the wizard instead of Home.
 * @returns {boolean}
 */
export function hasInProgressSetup() {
  return loadSetupState() !== null;
}
