/**
 * nameMode.js
 *
 * One job: render Screen 4 — Name Mode picker (Named vs Generic).
 */

import { el, clear } from "../dom.js";
import { createBackButton } from "../components/backButton.js";
import { saveSetupState } from "../logic/persistence.js";

/**
 * @param {HTMLElement} root
 * @param {{ navigate: Function, playerCount: number, imposterCount: number, mode: "named"|"generic"|null }} ctx
 */
export function renderNameMode(root, { navigate, playerCount, imposterCount, mode }) {
  clear(root);

  // Persist on every render (mount + every tile selection).
  saveSetupState({ screen: "nameMode", playerCount, imposterCount, mode });

  const rerender = (nextMode) =>
    renderNameMode(root, { navigate, playerCount, imposterCount, mode: nextMode });

  function tile(value, title, subtext) {
    return el(
      "button",
      {
        className: `tile${mode === value ? " selected" : ""}`,
        type: "button",
        onClick: () => rerender(value),
      },
      [
        el("p", { className: "tile-title", text: title }),
        el("p", { className: "tile-subtext", text: subtext }),
      ]
    );
  }

  function handleNext() {
    if (!mode) return;
    if (mode === "named") {
      navigate("nameEntry", {
        playerCount,
        imposterCount,
        mode,
        names: Array.from({ length: playerCount }, () => ""),
      });
    } else {
      navigate("startRound", { playerCount, imposterCount, mode });
    }
  }

  const screen = el("div", { className: "screen" }, [
    createBackButton(() => navigate("imposterCount", { playerCount, imposterCount })),
    el("h2", { className: "header", text: "How should players be identified?" }),
    el("div", { className: "tile-list" }, [
      tile("named", "Named", "Each player enters their own name."),
      tile("generic", "Generic", "Players are just called Player 1, Player 2, etc."),
    ]),
    el("div", { className: "picker-actions" }, [
      el("button", {
        className: "btn btn-primary btn-block",
        type: "button",
        text: "Next",
        disabled: !mode,
        onClick: handleNext,
      }),
    ]),
  ]);

  root.append(screen);
}
