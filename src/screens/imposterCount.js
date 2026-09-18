/**
 * imposterCount.js
 *
 * One job: render Screen 3 — Imposter Count picker.
 */

import { el, clear } from "../dom.js";
import { createStepper } from "../components/stepper.js";
import { createBackButton } from "../components/backButton.js";
import { getImposterCountRange } from "../logic/validation.js";
import { saveSetupState } from "../logic/persistence.js";

/**
 * @param {HTMLElement} root
 * @param {{ navigate: Function, playerCount: number, imposterCount: number }} ctx
 */
export function renderImposterCount(root, { navigate, playerCount, imposterCount }) {
  clear(root);

  // Persist on every render (mount + every stepper change).
  saveSetupState({ screen: "imposterCount", playerCount, imposterCount });

  const { min, max } = getImposterCountRange(playerCount);

  const rerender = (count) =>
    renderImposterCount(root, { navigate, playerCount, imposterCount: count });

  const screen = el("div", { className: "screen" }, [
    createBackButton(() => navigate("playerCount", { playerCount })),
    el("h2", { className: "header", text: "How many imposters?" }),
    el("div", { className: "picker-body" }, [
      createStepper({
        value: imposterCount,
        min,
        max,
        onChange: rerender,
      }),
      el("p", {
        className: "helper-text",
        text: `Between ${min} and ${max} imposters, so at least 2 players get the real word.`,
      }),
    ]),
    el("div", { className: "picker-actions" }, [
      el("button", {
        className: "btn btn-primary btn-block",
        type: "button",
        text: "Next",
        onClick: () => navigate("nameMode", { playerCount, imposterCount, mode: null }),
      }),
    ]),
  ]);

  root.append(screen);
}
