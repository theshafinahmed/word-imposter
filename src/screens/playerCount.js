/**
 * playerCount.js
 *
 * One job: render Screen 2 — Player Count picker.
 */

import { el, clear } from "../dom.js";
import { createStepper } from "../components/stepper.js";
import { createBackButton } from "../components/backButton.js";
import { MIN_PLAYERS, MAX_PLAYERS } from "../logic/validation.js";
import { saveSetupState } from "../logic/persistence.js";

/**
 * @param {HTMLElement} root
 * @param {{ navigate: Function, playerCount: number }} ctx
 */
export function renderPlayerCount(root, { navigate, playerCount }) {
  clear(root);

  // Persist on every render, since a render happens on mount and on every
  // stepper change (not just on "Next") — so a refresh mid-interaction
  // resumes with the latest value.
  saveSetupState({ screen: "playerCount", playerCount });

  const rerender = (count) => renderPlayerCount(root, { navigate, playerCount: count });

  const screen = el("div", { className: "screen" }, [
    createBackButton(() => navigate("home")),
    el("h2", { className: "header", text: "How many players?" }),
    el("div", { className: "picker-body" }, [
      createStepper({
        value: playerCount,
        min: MIN_PLAYERS,
        max: MAX_PLAYERS,
        onChange: rerender,
      }),
      el("p", {
        className: "helper-text",
        text: `Minimum ${MIN_PLAYERS}, maximum ${MAX_PLAYERS} players.`,
      }),
    ]),
    el("div", { className: "picker-actions" }, [
      el("button", {
        className: "btn btn-primary btn-block",
        type: "button",
        text: "Next",
        onClick: () => navigate("imposterCount", { playerCount, imposterCount: 1 }),
      }),
    ]),
  ]);

  root.append(screen);
}
