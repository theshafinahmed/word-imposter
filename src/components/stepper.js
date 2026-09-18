/**
 * stepper.js
 *
 * One job: render the shared +/- numeric stepper control used by both the
 * Player Count and Imposter Count screens.
 */

import { el } from "../dom.js";

/**
 * @param {object} opts
 * @param {number} opts.value
 * @param {number} opts.min
 * @param {number} opts.max
 * @param {(next: number) => void} opts.onChange
 * @returns {HTMLElement}
 */
export function createStepper({ value, min, max, onChange }) {
  const valueEl = el("span", { className: "stepper-value", text: String(value) });

  const decrementBtn = el("button", {
    className: "stepper-btn",
    type: "button",
    "aria-label": "Decrease",
    text: "−",
    disabled: value <= min,
    onClick: () => onChange(Math.max(min, value - 1)),
  });

  const incrementBtn = el("button", {
    className: "stepper-btn",
    type: "button",
    "aria-label": "Increase",
    text: "+",
    disabled: value >= max,
    onClick: () => onChange(Math.min(max, value + 1)),
  });

  return el("div", { className: "stepper-row" }, [decrementBtn, valueEl, incrementBtn]);
}
