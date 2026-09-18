/**
 * main.js
 *
 * One job: the app bootstrap and screen router. Owns which screen is
 * currently shown and dispatches navigation; all actual game-state
 * transitions are delegated to gameState.js — this file never reimplements
 * game logic.
 */

import "./style.css";
import { applyNativeAppFeel } from "./nativeAppFeel.js";
import {
  hasInProgressRound,
  loadRoundState,
  hasInProgressSetup,
  loadSetupState,
} from "./logic/persistence.js";
import { createNewRound } from "./logic/gameState.js";

import { renderHome } from "./screens/home.js";
import { renderPlayerCount } from "./screens/playerCount.js";
import { renderImposterCount } from "./screens/imposterCount.js";
import { renderNameMode } from "./screens/nameMode.js";
import { renderNameEntry } from "./screens/nameEntry.js";
import { renderConfirmIdentity } from "./screens/confirmIdentity.js";
import { renderCard } from "./screens/card.js";
import { renderEnd } from "./screens/end.js";

const root = document.getElementById("app");

const SCREENS = {
  home: renderHome,
  playerCount: renderPlayerCount,
  imposterCount: renderImposterCount,
  nameMode: renderNameMode,
  nameEntry: renderNameEntry,
  confirmIdentity: renderConfirmIdentity,
  card: renderCard,
  end: renderEnd,
};

function navigate(screen, params = {}) {
  if (screen === "startRound") {
    startRound(params);
    return;
  }

  const renderScreen = SCREENS[screen];
  if (!renderScreen) {
    console.error(`word-imposter: unknown screen "${screen}"`);
    return;
  }

  renderScreen(root, { ...params, navigate });
}

/**
 * Bridges the setup wizard (Screens 2-5, held in plain JS params — Bishal's
 * persistence layer only covers state from round-creation onward) into an
 * actual round via gameState.js, then hands off to Confirm-identity.
 */
function startRound({ playerCount, imposterCount, mode, names }) {
  try {
    const roundState = createNewRound({ playerCount, imposterCount, mode, names });
    navigate("confirmIdentity", { roundState });
  } catch (err) {
    // createNewRound throws a display-ready message on invalid input; this
    // shouldn't normally happen since the UI only ever offers valid values,
    // but surface it instead of silently failing.
    window.alert(err.message);
    navigate("home");
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((err) => {
        console.warn("word-imposter: service worker registration failed", err);
      });
    });
  }
}

function boot() {
  applyNativeAppFeel();
  registerServiceWorker();

  if (hasInProgressRound()) {
    const roundState = loadRoundState();
    if (roundState) {
      // Always resume through the Confirm-identity checkpoint, never
      // straight into a card — this preserves the trust-based handoff even
      // across an accidental refresh.
      navigate("confirmIdentity", { roundState });
      return;
    }
  }

  if (hasInProgressSetup()) {
    const setupState = loadSetupState();
    if (setupState) {
      // Resume into whichever setup-wizard screen the user was on, with
      // whatever they'd filled in so far — per decision 3, the "round"
      // starts at player-count selection, so setup progress must survive a
      // refresh just like an in-progress round does.
      const { screen, ...fields } = setupState;
      navigate(screen, fields);
      return;
    }
  }

  navigate("home");
}

boot();
