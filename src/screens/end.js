/**
 * end.js
 *
 * One job: render Screen 8 — End screen. Clears round state on "Start New
 * Round" per decision: an explicit tap here is a deliberate reset, unlike a
 * mid-round refresh which must preserve progress.
 */

import { el, clear } from "../dom.js";
import { createMascot } from "../mascot.js";
import { restartRound } from "../logic/gameState.js";

/**
 * @param {HTMLElement} root
 * @param {{ navigate: Function }} ctx
 */
export function renderEnd(root, { navigate }) {
  clear(root);

  const screen = el("div", { className: "screen end-screen" }, [
    createMascot(150),
    el("h2", { className: "end-title", text: "All done!" }),
    el("p", { className: "end-subtext", text: "Everyone's seen their card. Time to talk it out!" }),
    el("div", { className: "end-actions" }, [
      el("button", {
        className: "btn btn-primary btn-block",
        type: "button",
        text: "Start New Round",
        onClick: () => {
          restartRound();
          navigate("home");
        },
      }),
    ]),
  ]);

  root.append(screen);
}
