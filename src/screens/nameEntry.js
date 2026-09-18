/**
 * nameEntry.js
 *
 * One job: render Screen 5 — Name Entry (Named mode only).
 *
 * Inputs are built once and mutate the `names` array in place on input,
 * updating only the Next button/helper text (not re-rendering the whole
 * screen) so focus and cursor position are never lost while typing.
 */

import { el, clear } from "../dom.js";
import { createBackButton } from "../components/backButton.js";
import { MAX_NAME_LENGTH } from "../logic/validation.js";
import { saveSetupState } from "../logic/persistence.js";

/**
 * @param {HTMLElement} root
 * @param {{ navigate: Function, playerCount: number, imposterCount: number, mode: "named", names: string[] }} ctx
 */
export function renderNameEntry(root, { navigate, playerCount, imposterCount, mode, names }) {
  clear(root);

  // Persist on mount, and again on every keystroke below (this screen
  // mutates `names` in place rather than re-rendering, so the mount-time
  // save alone wouldn't capture later edits).
  saveSetupState({ screen: "nameEntry", playerCount, imposterCount, mode, names });

  function isAllFilled() {
    return names.every((name) => name.trim().length > 0);
  }

  const helperText = el("p", {
    className: "helper-text",
    text: "Fill in all names to continue.",
    style: isAllFilled() ? "display:none" : "",
  });

  const nextButton = el("button", {
    className: "btn btn-primary btn-block",
    type: "button",
    text: "Next",
    disabled: !isAllFilled(),
    onClick: () => navigate("startRound", { playerCount, imposterCount, mode, names }),
  });

  function refreshNextState() {
    const filled = isAllFilled();
    nextButton.disabled = !filled;
    helperText.style.display = filled ? "none" : "";
  }

  const fields = names.map((name, index) =>
    el("div", { className: "name-field" }, [
      el("label", {
        className: "name-field-label",
        for: `name-input-${index}`,
        text: `Player ${index + 1}`,
      }),
      el("input", {
        className: "name-field-input",
        id: `name-input-${index}`,
        type: "text",
        maxlength: String(MAX_NAME_LENGTH),
        placeholder: "Enter name",
        value: name,
        oninput: (e) => {
          names[index] = e.target.value;
          saveSetupState({ screen: "nameEntry", playerCount, imposterCount, mode, names });
          refreshNextState();
        },
      }),
    ])
  );

  const screen = el("div", { className: "screen" }, [
    createBackButton(() => navigate("nameMode", { playerCount, imposterCount, mode })),
    el("h2", { className: "header", text: "Enter player names." }),
    el("div", { className: "name-list" }, fields),
    helperText,
    nextButton,
  ]);

  root.append(screen);
}
