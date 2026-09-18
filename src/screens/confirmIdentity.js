/**
 * confirmIdentity.js
 *
 * One job: render Screen 6 — Confirm-identity, the trust-based handoff
 * checkpoint shown before each player sees their card.
 */

import { el, clear } from "../dom.js";
import { getCurrentPlayer, hideCurrentPlayer } from "../logic/gameState.js";

/**
 * @param {HTMLElement} root
 * @param {{ navigate: Function, roundState: object }} ctx
 */
export function renderConfirmIdentity(root, { navigate, roundState }) {
  clear(root);

  const player = getCurrentPlayer(roundState);

  const screen = el("div", { className: "screen screen--centered confirm-screen" }, [
    el("p", { className: "confirm-name", text: `Are you ${player.name}?` }),
    el("p", { className: "muted confirm-hint", text: "Make sure no one else is looking." }),
    el("div", { className: "confirm-actions" }, [
      el("button", {
        className: "btn btn-primary btn-block",
        type: "button",
        text: "Yes, that's me",
        // Screen 7 always starts face-down, per spec — this also makes a
        // refresh-resume through this screen safe even if the persisted
        // state had faceUp: true from before the refresh.
        onClick: () => navigate("card", { roundState: hideCurrentPlayer(roundState) }),
      }),
    ]),
  ]);

  root.append(screen);
}
