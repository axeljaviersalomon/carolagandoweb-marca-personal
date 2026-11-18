import { defineConfig } from "vite";
import prefixSelector from "postcss-prefix-selector";
import { glueShortWords, htmlIncludes, prettyRoutes } from "./scripts/vite-plugins.js";

export const PAGES = ["home", "sobre-mi", "mentorias", "contacto", "conecta", "quantum", "fenix"];
export const ROOT_CLASS = ".cg-page";

/**
 * Todo el CSS queda encapsulado bajo `.cg-page` para no chocar con los
 * estilos de GoHighLevel. `:root`, `html` y `body` pasan a ser `.cg-page`.
 */
const scopeCss = prefixSelector({
  prefix: ROOT_CLASS,
  transform(prefix, selector, prefixedSelector) {
    if (selector.startsWith(prefix)) return selector;
    // Las transiciones entre páginas viven en el documento, no dentro de .cg-page
    if (selector.startsWith("::view-transition")) return selector;
    if (/^(:root|html|body)$/.test(selector)) return prefix;
    // `:root::after` → `.cg-page::after`
    if (selector.startsWith(":root")) return prefix + selector.slice(":root".length);
    if (/^(html|body)\s/.test(selector)) return selector.replace(/^(html|body)/, prefix);
    return prefixedSelector;
  },
});

export default defineConfig({
  root: "src/pages",
  publicDir: "../../public",
  css: { postcss: { plugins: [scopeCss] } },
  // glueShortWords va después de htmlIncludes: también procesa los partials
  plugins: [htmlIncludes(), glueShortWords(), prettyRoutes(PAGES)],
  server: { port: 5173 },
});
