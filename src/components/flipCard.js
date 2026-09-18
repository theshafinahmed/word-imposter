/**
 * flipCard.js
 *
 * One job: the two-face flip-card shell (front face, back face, 3D flip
 * transform) used by the Card screen. This component only knows how to flip
 * between whatever front/back content it's given — it has no knowledge of
 * game state, word content, or button logic.
 */

import { el } from "../dom.js";

/**
 * @param {object} opts
 * @param {Node} opts.front - content for the face-down face
 * @param {Node} opts.back - content for the face-up face
 * @param {boolean} opts.faceUp - initial visual state
 * @returns {{ node: HTMLElement, setFaceUp: (faceUp: boolean) => void }}
 */
export function createFlipCard({ front, back, faceUp }) {
  const frontFace = el("div", { className: "card-face card-face--front" }, [front]);
  const backFace = el("div", { className: "card-face card-face--back" }, [back]);

  const flipCard = el("div", { className: `flip-card${faceUp ? " is-face-up" : ""}` }, [
    frontFace,
    backFace,
  ]);

  // Belt-and-suspenders long-press/context-menu suppression on the card.
  flipCard.addEventListener("contextmenu", (e) => e.preventDefault());

  const wrapper = el("div", { className: "card-perspective" }, [flipCard]);

  function setFaceUp(next) {
    flipCard.classList.toggle("is-face-up", next);
  }

  return { node: wrapper, setFaceUp };
}
