/**
 * validation.js
 *
 * One job: validate the inputs that drive a Word Imposter round (player count,
 * imposter count, and player names) and return plain, user-displayable error
 * message strings. This module has no knowledge of game state, storage, or
 * rendering — it only answers "is this input valid, and if not, why".
 */

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const MAX_NAME_LENGTH = 20;

export const VALIDATION_MESSAGES = {
  PLAYER_COUNT_TOO_LOW: `You need at least ${MIN_PLAYERS} players.`,
  PLAYER_COUNT_TOO_HIGH: `You can have at most ${MAX_PLAYERS} players.`,
  PLAYER_COUNT_NOT_INTEGER: "Player count must be a whole number.",
  IMPOSTER_COUNT_TOO_LOW: "You need at least 1 imposter.",
  IMPOSTER_COUNT_TOO_HIGH:
    "There are too many imposters for this many players — at least 2 players need the real word.",
  IMPOSTER_COUNT_NOT_INTEGER: "Imposter count must be a whole number.",
  NAME_EMPTY: "Name can't be empty.",
  NAME_TOO_LONG: `Name can't be longer than ${MAX_NAME_LENGTH} characters.`,
  NAMES_COUNT_MISMATCH: "The number of names doesn't match the number of players.",
};

/**
 * Returns the valid imposter count range for a given player count.
 * @param {number} playerCount
 * @returns {{ min: number, max: number }}
 */
export function getImposterCountRange(playerCount) {
  return { min: 1, max: playerCount - 2 };
}

/**
 * Validates playerCount.
 * @param {number} playerCount
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validatePlayerCount(playerCount) {
  if (!Number.isInteger(playerCount)) {
    return { valid: false, error: VALIDATION_MESSAGES.PLAYER_COUNT_NOT_INTEGER };
  }
  if (playerCount < MIN_PLAYERS) {
    return { valid: false, error: VALIDATION_MESSAGES.PLAYER_COUNT_TOO_LOW };
  }
  if (playerCount > MAX_PLAYERS) {
    return { valid: false, error: VALIDATION_MESSAGES.PLAYER_COUNT_TOO_HIGH };
  }
  return { valid: true, error: null };
}

/**
 * Validates imposterCount against a given playerCount.
 * Valid range is 1 to (playerCount - 2) inclusive.
 * @param {number} imposterCount
 * @param {number} playerCount
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateImposterCount(imposterCount, playerCount) {
  if (!Number.isInteger(imposterCount)) {
    return { valid: false, error: VALIDATION_MESSAGES.IMPOSTER_COUNT_NOT_INTEGER };
  }
  const { min, max } = getImposterCountRange(playerCount);
  if (imposterCount < min) {
    return { valid: false, error: VALIDATION_MESSAGES.IMPOSTER_COUNT_TOO_LOW };
  }
  if (imposterCount > max) {
    return { valid: false, error: VALIDATION_MESSAGES.IMPOSTER_COUNT_TOO_HIGH };
  }
  return { valid: true, error: null };
}

/**
 * Validates a single player name. Duplicate names are explicitly allowed —
 * this function never checks for duplicates against other names.
 * @param {string} name
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    return { valid: false, error: VALIDATION_MESSAGES.NAME_EMPTY };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: VALIDATION_MESSAGES.NAME_TOO_LONG };
  }
  return { valid: true, error: null };
}

/**
 * Validates a full names array for Named mode: count must match playerCount,
 * and every individual name must pass validateName. Duplicates are allowed.
 * @param {string[]} names
 * @param {number} playerCount
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateNames(names, playerCount) {
  if (!Array.isArray(names) || names.length !== playerCount) {
    return { valid: false, error: VALIDATION_MESSAGES.NAMES_COUNT_MISMATCH };
  }
  for (const name of names) {
    const result = validateName(name);
    if (!result.valid) {
      return result;
    }
  }
  return { valid: true, error: null };
}

/**
 * Validates the full set of inputs needed to start a round.
 * @param {{ playerCount: number, imposterCount: number, names?: string[] }} input
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateRoundSetup({ playerCount, imposterCount, names }) {
  const playerCountResult = validatePlayerCount(playerCount);
  if (!playerCountResult.valid) return playerCountResult;

  const imposterCountResult = validateImposterCount(imposterCount, playerCount);
  if (!imposterCountResult.valid) return imposterCountResult;

  if (names !== undefined) {
    const namesResult = validateNames(names, playerCount);
    if (!namesResult.valid) return namesResult;
  }

  return { valid: true, error: null };
}
