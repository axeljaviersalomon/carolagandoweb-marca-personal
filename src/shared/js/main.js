import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import { initForms } from "./forms.js";
import { initCountUp, initNav, initPointerGlow, initReveal, initStickyCta, initVideos, initYear } from "./ui.js";

/** Punto de entrada compartido. Cada página lo importa desde su propio JS. */
export function boot() {
  const root = document.querySelector(".cg-page");
  if (!root) return;
  root.classList.add("cg-js");
  initNav(root);
  initReveal(root);
  initPointerGlow(root);
  initCountUp(root);
  initStickyCta(root);
  initVideos(root);
  initForms(root);
  initYear(root);
}
