import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import { initForms } from "./forms.js";
import {
  initBackToTop,
  initCountUp,
  initLightbox,
  initNav,
  initPageTransitions,
  initPointerGlow,
  initPrefetch,
  initPrerenderReplay,
  initReveal,
  initScrollProgress,
  initStickyCta,
  initVideos,
  initYear,
} from "./ui.js";

/** Punto de entrada compartido. Cada página lo importa desde su propio JS. */
export function boot() {
  const root = document.querySelector(".cg-page");
  if (!root) return;
  root.classList.add("cg-js");
  initPrerenderReplay();
  initNav(root);
  initReveal(root);
  initPointerGlow(root);
  initCountUp(root);
  initStickyCta(root);
  initVideos(root);
  initLightbox(root);
  initForms(root);
  initYear(root);
  initPageTransitions(root);
  initPrefetch(root);
  initScrollProgress(root);
  initBackToTop(root);
}
