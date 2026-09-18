/**
 * nativeAppFeel.js
 *
 * One job: apply the runtime (non-CSS, non-meta-tag) parts of the
 * native-app-feel restrictions checklist on app boot — orientation lock and
 * global context-menu suppression. The CSS-level restrictions (touch-action,
 * user-select, overscroll-behavior) live in style.css, and the meta tags
 * live in index.html; this module only covers what needs JavaScript.
 */

export function applyNativeAppFeel() {
  // Best-effort portrait lock; unsupported on many desktop browsers, so this
  // must fail silently rather than block the app.
  try {
    const orientation = screen.orientation;
    if (orientation && typeof orientation.lock === "function") {
      orientation.lock("portrait").catch(() => {
        // Locking can be rejected (e.g. not in fullscreen/standalone mode on
        // some platforms) — that's fine, the CSS layout is portrait-first
        // regardless.
      });
    }
  } catch (err) {
    // Screen Orientation API unavailable entirely (e.g. desktop Safari).
  }

  // Belt-and-suspenders on top of CSS -webkit-touch-callout suppression:
  // Android Chrome's long-press menu isn't always caught by CSS alone.
  document.addEventListener("contextmenu", (e) => e.preventDefault());
}
