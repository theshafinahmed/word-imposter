/**
 * card.js
 *
 * One job: render Screen 7 — Card screen (face-down / face-up-word /
 * face-up-imposter), wired to gameState.js for all state transitions.
 */

import { el, clear } from "../dom.js";
import { createMascot } from "../mascot.js";
import { createFlipCard } from "../components/flipCard.js";
import {
  getCurrentPlayer,
  revealCurrentPlayer,
  hideCurrentPlayer,
  isLastPlayer,
  peekNextPlayer,
  advanceToNextPlayer,
} from "../logic/gameState.js";

function buildFrontFace(name) {
  return el("div", { className: "card-face-inner" }, [
    el("p", { className: "card-player-name", text: name }),
    el("div", { className: "card-mascot-wrap" }, [createMascot(120)]),
    el("p", { className: "card-hint muted", text: "Tap Reveal to see your card." }),
  ]);
}

function buildBackFace(displayContent) {
  if (displayContent.isImposter) {
    return el("div", { className: "card-imposter-wrap" }, [
      el("p", { className: "card-imposter-message", text: "You are the Imposter" }),
      el("p", { className: "card-imposter-sub", text: "You don't get a word — try to blend in!" }),
    ]);
  }

  return el("div", {}, [
    el("p", { className: "card-label", text: "Your word" }),
    el("p", { className: "card-word-en", text: displayContent.english }),
    el("p", { className: "card-word-bn", text: displayContent.bangla }),
    el("hr", { className: "card-divider" }),
    el("p", { className: "card-description", text: displayContent.description }),
  ]);
}

/**
 * @param {HTMLElement} root
 * @param {{ navigate: Function, roundState: object }} ctx
 */
export function renderCard(root, { navigate, roundState }) {
  clear(root);

  let state = roundState;

  const initialPlayer = getCurrentPlayer(state);
  const frontFace = buildFrontFace(initialPlayer.name);
  const backFace = buildBackFace(initialPlayer.displayContent);
  const flip = createFlipCard({ front: frontFace, back: backFace, faceUp: initialPlayer.faceUp });

  const buttonArea = el("div", { className: "card-actions" });

  function renderButtons() {
    clear(buttonArea);
    const player = getCurrentPlayer(state);

    if (!player.faceUp) {
      buttonArea.append(
        el("button", {
          className: "btn btn-primary btn-block",
          type: "button",
          text: "Reveal",
          onClick: onReveal,
        })
      );
      return;
    }

    buttonArea.append(
      el("button", {
        className: "btn btn-secondary btn-block",
        type: "button",
        text: "Hide",
        onClick: onHide,
      })
    );

    if (player.revealed) {
      const last = isLastPlayer(state);
      const next = peekNextPlayer(state);
      buttonArea.append(
        el("button", {
          className: "btn btn-primary btn-block",
          type: "button",
          text: last ? "Finish" : `Hand it over to ${next.name}`,
          onClick: () => onHandoff(last),
        })
      );
    }
  }

  function onReveal() {
    state = revealCurrentPlayer(state);
    flip.setFaceUp(true);
    renderButtons();
  }

  function onHide() {
    state = hideCurrentPlayer(state);
    flip.setFaceUp(false);
    renderButtons();
  }

  function onHandoff(last) {
    if (last) {
      navigate("end", {});
      return;
    }
    state = advanceToNextPlayer(state);
    navigate("confirmIdentity", { roundState: state });
  }

  renderButtons();

  const screen = el("div", { className: "screen card-screen" }, [flip.node, buttonArea]);
  root.append(screen);
}
