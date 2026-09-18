/**
 * home.js
 *
 * One job: render Screen 1 — Home. Entry point / brand moment, no state.
 */

import { el, clear } from "../dom.js";
import { createMascot } from "../mascot.js";

/**
 * @param {HTMLElement} root
 * @param {{ navigate: (screen: string, params?: object) => void }} ctx
 */
export function renderHome(root, { navigate }) {
  clear(root);

  const screen = el("div", { className: "screen screen--centered" }, [
    el("div", { className: "home-top" }, [
      el("h1", { className: "title", text: "Word Imposter" }),
      createMascot(160),
      el("p", { className: "home-tagline", text: "একজন লুকিয়ে আছে... Find the imposter." }),
    ]),
    el("div", { className: "home-actions" }, [
      el("button", {
        className: "btn btn-primary btn-block",
        type: "button",
        text: "Start",
        onClick: () => navigate("playerCount", { playerCount: 3 }),
      }),
    ]),
  ]);

  root.append(screen);
}
