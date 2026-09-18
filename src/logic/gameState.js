/**
 * gameState.js
 *
 * One job: the pure game-logic state transitions for a Word Imposter round
 * (start a round, read/mutate per-player reveal state, advance turns,
 * restart). No DOM, no rendering — that's the frontend's job.
 *
 * Every function that changes state auto-saves the resulting round state to
 * sessionStorage (via persistence.js) before returning it, so callers never
 * have to remember to persist manually. Functions are otherwise pure: given
 * a state object and some input, they return a brand-new state object
 * (never mutate the one passed in) alongside doing that save side effect.
 */

import wordsData from "../data/words.json";
import { validateRoundSetup } from "./validation.js";
import { saveRoundState, clearRoundState, clearSetupState } from "./persistence.js";

/**
 * @typedef {Object} Player
 * @property {string} name
 * @property {boolean} isImposter
 * @property {boolean} revealed - has this player revealed their card at least once
 * @property {boolean} faceUp - is the card currently showing its face
 *
 * @typedef {Object} RoundWord
 * @property {string} category
 * @property {string} english
 * @property {string} bangla
 * @property {string} description
 *
 * @typedef {Object} RoundState
 * @property {"named"|"generic"} mode
 * @property {number} playerCount
 * @property {number} imposterCount
 * @property {RoundWord} word - the single word assigned to all non-imposters this round
 * @property {Player[]} players - turn-ordered queue, index 0 goes first
 * @property {number} currentPlayerIndex
 */

/**
 * Picks one random category and one random word within it from the bundled
 * word list.
 * @returns {RoundWord}
 */
function pickRandomWord() {
  const categories = wordsData.categories;
  const category = categories[Math.floor(Math.random() * categories.length)];
  const word = category.words[Math.floor(Math.random() * category.words.length)];
  return {
    category: category.category,
    english: word.english,
    bangla: word.bangla,
    description: word.description,
  };
}

/**
 * Randomly picks `imposterCount` distinct indices out of `playerCount`.
 * @param {number} playerCount
 * @param {number} imposterCount
 * @returns {Set<number>}
 */
function pickImposterIndices(playerCount, imposterCount) {
  const indices = Array.from({ length: playerCount }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return new Set(indices.slice(0, imposterCount));
}

/**
 * Creates a brand-new round: picks the word, assigns imposters, builds the
 * turn-ordered player queue, and persists the result.
 *
 * Turn order matches input order: for Named mode that's the order names were
 * entered in; for Generic mode that's Player 1, Player 2, ... Player N.
 *
 * @param {Object} input
 * @param {number} input.playerCount
 * @param {number} input.imposterCount
 * @param {"named"|"generic"} input.mode
 * @param {string[]} [input.names] - required when mode is "named", index-aligned to player order
 * @returns {RoundState}
 * @throws {Error} with a message from VALIDATION_MESSAGES if input is invalid
 */
export function createNewRound({ playerCount, imposterCount, mode, names }) {
  const validation = validateRoundSetup({
    playerCount,
    imposterCount,
    names: mode === "named" ? names : undefined,
  });
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const imposterIndices = pickImposterIndices(playerCount, imposterCount);

  const players = Array.from({ length: playerCount }, (_, i) => ({
    name: mode === "named" ? names[i] : `Player ${i + 1}`,
    isImposter: imposterIndices.has(i),
    revealed: false,
    faceUp: false,
  }));

  const roundState = {
    mode,
    playerCount,
    imposterCount,
    word: pickRandomWord(),
    players,
    currentPlayerIndex: 0,
  };

  saveRoundState(roundState);
  // The setup wizard is done now that a round exists — its in-progress
  // state (which screen, partial names, etc.) is no longer relevant, and
  // leaving it around would make a later "Start New Round" resume into the
  // stale wizard instead of Home.
  clearSetupState();
  return roundState;
}

/**
 * Returns the current player and their derived display content.
 * @param {RoundState} roundState
 * @returns {Player & { displayContent: { isImposter: boolean, english?: string, bangla?: string, description?: string } }}
 */
export function getCurrentPlayer(roundState) {
  const player = roundState.players[roundState.currentPlayerIndex];
  const displayContent = player.isImposter
    ? { isImposter: true }
    : {
        isImposter: false,
        english: roundState.word.english,
        bangla: roundState.word.bangla,
        description: roundState.word.description,
      };
  return { ...player, displayContent };
}

/**
 * Flips the current player's card face-up. Marks `revealed` true permanently
 * for this player (enables the handoff button), independent of future
 * Hide/Reveal toggles.
 * @param {RoundState} roundState
 * @returns {RoundState} new state
 */
export function revealCurrentPlayer(roundState) {
  const players = roundState.players.map((p, i) =>
    i === roundState.currentPlayerIndex ? { ...p, faceUp: true, revealed: true } : p
  );
  const newState = { ...roundState, players };
  saveRoundState(newState);
  return newState;
}

/**
 * Flips the current player's card face-down. Does not clear `revealed`.
 * @param {RoundState} roundState
 * @returns {RoundState} new state
 */
export function hideCurrentPlayer(roundState) {
  const players = roundState.players.map((p, i) =>
    i === roundState.currentPlayerIndex ? { ...p, faceUp: false } : p
  );
  const newState = { ...roundState, players };
  saveRoundState(newState);
  return newState;
}

/**
 * Whether the current player is the last one in turn order (i.e. the
 * handoff button should read "Finish" and go to the End screen instead of
 * looping back to the Confirm-identity screen).
 * @param {RoundState} roundState
 * @returns {boolean}
 */
export function isLastPlayer(roundState) {
  return roundState.currentPlayerIndex === roundState.players.length - 1;
}

/**
 * Returns the next player in turn order without advancing, or null if the
 * current player is last. Useful for rendering "Hand it over to {name}".
 * @param {RoundState} roundState
 * @returns {Player|null}
 */
export function peekNextPlayer(roundState) {
  if (isLastPlayer(roundState)) return null;
  return roundState.players[roundState.currentPlayerIndex + 1];
}

/**
 * Advances to the next player in turn order. Do not call this when
 * isLastPlayer(roundState) is true — check that first and navigate to the
 * End screen instead.
 * @param {RoundState} roundState
 * @returns {RoundState} new state
 */
export function advanceToNextPlayer(roundState) {
  if (isLastPlayer(roundState)) {
    throw new Error("There is no next player — this is the last player in the round.");
  }
  const newState = { ...roundState, currentPlayerIndex: roundState.currentPlayerIndex + 1 };
  saveRoundState(newState);
  return newState;
}

/**
 * Ends the round and wipes all saved round state, for the "Start New Round"
 * button on the End screen. There is no return value — call this, then
 * navigate to the Home screen.
 */
export function restartRound() {
  clearRoundState();
}
