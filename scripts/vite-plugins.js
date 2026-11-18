import fs from "node:fs";
import path from "node:path";

const PARTIALS_DIR = path.resolve("src/shared/partials");

/**
 * Reemplaza `<!-- @include nombre {"clave":"valor"} -->` por el contenido de
 * `src/shared/partials/nombre.html`. El nombre puede llevar carpeta
 * (`carola/nav` → `partials/carola/nav.html`). Dentro del partial, `{{clave}}`
 * se reemplaza por el valor recibido. Los includes pueden anidarse.
 */
export function htmlIncludes() {
  const pattern = /<!--\s*@include\s+([\w/-]+)\s*(\{.*?\})?\s*-->/g;

  function render(html, depth = 0) {
    if (depth > 10) throw new Error("@include: demasiados niveles de anidación");
    return html.replace(pattern, (_, name, json) => {
      const file = path.join(PARTIALS_DIR, `${name}.html`);
      if (!fs.existsSync(file)) throw new Error(`@include: no existe ${file}`);
      const params = json ? JSON.parse(json) : {};
      const body = fs
        .readFileSync(file, "utf8")
        .replace(/\{\{\s*(\w+)\s*\}\}/g, (__, key) => params[key] ?? "");
      return render(body, depth + 1);
    });
  }

  return {
    name: "cg-html-includes",
    transformIndexHtml: { order: "pre", handler: (html) => render(html) },
    handleHotUpdate({ file, server }) {
      if (path.normalize(file).startsWith(PARTIALS_DIR)) server.ws.send({ type: "full-reload" });
    },
  };
}

/**
 * En dev, sirve las rutas de producción: `/` → home, `/conecta` → conecta, etc.
 */
export function prettyRoutes(pages) {
  return {
    name: "cg-pretty-routes",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url.split("?")[0].replace(/\/$/, "");
        if (url === "") req.url = "/home/";
        else if (pages.includes(url.slice(1))) req.url = `${url}/`;
        next();
      });
    },
  };
}

/**
 * Cortes de línea: une con `&nbsp;` las palabras que nunca pueden quedar al
 * final de un renglón (y, a, o, e, u, de, la, un) con la palabra siguiente.
 * También une un número con la palabra que sigue (`12&nbsp;años`, `9&nbsp;países`).
 * Solo en texto visible: no toca etiquetas, atributos, <script>, <style> ni <title>.
 * Si la palabra siguiente arranca dentro de un <span>/<strong>/<em>/<a>, también.
 */
export function glueShortWords() {
  const WORDS = "y|a|o|e|u|de|la|un";
  const INLINE_OPEN = /^<(span|strong|em|b|i|a)\b/i;
  const RAW = /^<(script|style|title|textarea)\b/i;
  const glue = (text, nextIsInline) =>
    text
      .replace(
        new RegExp(String.raw`(?<=^|[\s¿¡("“]|&nbsp;)(${WORDS})[ \t\r\n]+(?=\S${nextIsInline ? "|$" : ""})`, "giu"),
        "$1&nbsp;",
      )
      .replace(/(?<=\d)[ \t\r\n]+(?=\p{L})/gu, "&nbsp;");

  return {
    name: "cg-glue-short-words",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const parts = html.split(/(<[^>]*>)/);
        let raw = null;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (part.startsWith("<")) {
            if (raw && part.toLowerCase() === `</${raw}>`) raw = null;
            else if (!raw && RAW.test(part)) raw = part.match(RAW)[1].toLowerCase();
            continue;
          }
          if (raw || !part.trim()) continue;
          parts[i] = glue(part, INLINE_OPEN.test(parts[i + 1] ?? ""));
        }
        return parts.join("");
      },
    },
  };
}
