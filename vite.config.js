import { defineConfig } from "vite";
import prefixSelector from "postcss-prefix-selector";
import { htmlIncludes, prettyRoutes } from "./scripts/vite-plugins.js";

export const PAGES = ["home", "conecta", "quantum", "fenix"];
export const ROOT_CLASS = ".cg-page";

/**
 * Todo el CSS queda encapsulado bajo `.cg-page` para no chocar con los
 * estilos de GoHighLevel. `:root`, `html` y `body` pasan a ser `.cg-page`.
 */
const scopeCss = prefixSelector({
  prefix: ROOT_CLASS,
  transform(prefix, selector, prefixedSelector) {
    if (selector.startsWith(prefix)) return selector;
    if (/^(:root|html|body)$/.test(selector)) return prefix;
    if (/^(html|body)\s/.test(selector)) return selector.replace(/^(html|body)/, prefix);
    return prefixedSelector;
  },
});

export default defineConfig({
  root: "src/pages",
  publicDir: "../../public",
  css: { postcss: { plugins: [scopeCss] } },
  plugins: [htmlIncludes(), prettyRoutes(PAGES)],
  server: { port: 5173 },
});
