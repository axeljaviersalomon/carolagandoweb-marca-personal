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
