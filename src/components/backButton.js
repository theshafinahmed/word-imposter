/**
 * backButton.js
 *
 * One job: render the top-left back chevron used on every screen except
 * Home, Confirm-identity, and End.
 */

import { el } from "../dom.js";

/**
 * @param {() => void} onClick
 * @returns {HTMLElement}
 */
export function createBackButton(onClick) {
  return el("button", {
    className: "back-button",
    type: "button",
    "aria-label": "Back",
    text: "‹",
    onClick,
  });
}
