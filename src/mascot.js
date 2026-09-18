/**
 * mascot.js
 *
 * One job: render the "Inspector Egg" mascot (egg-shaped body, crimson
 * deerstalker cap, crimson magnifying glass, beige body, thick rounded
 * outline) as an inline SVG at a given height. Pure presentational asset,
 * no state.
 */

const CRIMSON = "#A31621";
const BEIGE = "#F0E4D0";
const OUTLINE = "#2B1E1A";

/**
 * @param {number} heightPx
 * @returns {SVGSVGElement}
 */
export function createMascot(heightPx) {
  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("viewBox", "0 0 200 240");
  svg.setAttribute("width", String(Math.round((heightPx * 200) / 240)));
  svg.setAttribute("height", String(heightPx));
  svg.setAttribute("aria-hidden", "true");
  svg.style.webkitUserDrag = "none";
  svg.style.userSelect = "none";
  svg.style.pointerEvents = "none";

  svg.innerHTML = `
    <!-- egg body -->
    <ellipse cx="100" cy="150" rx="70" ry="82" fill="${BEIGE}" stroke="${OUTLINE}" stroke-width="6" />
    <!-- deerstalker cap -->
    <path d="M45 95 Q100 40 155 95 L150 108 Q100 78 50 108 Z" fill="${CRIMSON}" stroke="${OUTLINE}" stroke-width="6" stroke-linejoin="round" />
    <path d="M60 100 L40 90 Q30 88 32 78 L48 82 Z" fill="${CRIMSON}" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round" />
    <path d="M140 100 L160 90 Q170 88 168 78 L152 82 Z" fill="${CRIMSON}" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round" />
    <!-- eyes -->
    <circle cx="78" cy="150" r="7" fill="${OUTLINE}" />
    <circle cx="122" cy="150" r="7" fill="${OUTLINE}" />
    <!-- smile -->
    <path d="M85 172 Q100 184 115 172" fill="none" stroke="${OUTLINE}" stroke-width="5" stroke-linecap="round" />
    <!-- magnifying glass -->
    <circle cx="150" cy="185" r="18" fill="none" stroke="${CRIMSON}" stroke-width="8" />
    <line x1="163" y1="198" x2="180" y2="215" stroke="${CRIMSON}" stroke-width="9" stroke-linecap="round" />
  `;

  return svg;
}
