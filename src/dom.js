/**
 * dom.js
 *
 * One job: a tiny helper for building DOM elements imperatively without a
 * templating engine, since this project deliberately has no UI framework.
 */

/**
 * Creates a DOM element.
 * @param {string} tag
 * @param {object} [props] - attributes/properties; `className`, `text`,
 *   `html`, and event handlers (`onClick`, etc.) are handled specially.
 * @param {(Node|string)[]} [children]
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props || {})) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "className") {
      node.className = value;
    } else if (key === "text") {
      node.textContent = value;
    } else if (key === "html") {
      node.innerHTML = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "disabled") {
      node.disabled = Boolean(value);
      if (value) node.setAttribute("aria-disabled", "true");
    } else {
      node.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (child === undefined || child === null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return node;
}

/** Removes all children from a container. */
export function clear(container) {
  container.replaceChildren();
}

/** Prevents the native long-press/right-click context menu on an element. */
export function preventContextMenu(node) {
  node.addEventListener("contextmenu", (e) => e.preventDefault());
  return node;
}
