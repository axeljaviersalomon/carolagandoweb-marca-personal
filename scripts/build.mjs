/**
 * Build por página → un HTML autocontenido (CSS y JS inline).
 *
 * Salida:
 *   dist/<ruta>/index.html  documento completo, para previsualizar con `npm run preview`
 *   dist/ghl/<pagina>.html  fragmento para pegar en el bloque "Custom code" de GHL
 *
 * Las imágenes se referencian como `/img/...`. Si `images.json` tiene una URL
 * de la galería de medios de GHL para esa ruta, se reemplaza en el fragmento.
 */
import fs from "node:fs";
import path from "node:path";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { PAGES } from "../vite.config.js";

const DIST = path.resolve("dist");
const TMP = path.join(DIST, ".tmp");
const only = process.argv.slice(2);
const pages = only.length ? PAGES.filter((p) => only.includes(p)) : PAGES;

const imageMap = fs.existsSync("images.json")
  ? JSON.parse(fs.readFileSync("images.json", "utf8"))
  : {};

fs.rmSync(DIST, { recursive: true, force: true });

for (const page of pages) {
  const entry = path.resolve("src/pages", page, "index.html");
  if (!fs.existsSync(entry)) {
    console.warn(`· ${page}: sin index.html, se omite`);
    continue;
  }

  await build({
    configFile: path.resolve("vite.config.js"),
    logLevel: "warn",
    plugins: [viteSingleFile({ removeViteModuleLoader: true })],
    build: {
      outDir: path.join(TMP, page),
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: { input: entry },
    },
  });

  const html = fs.readFileSync(path.join(TMP, page, page, "index.html"), "utf8");

  const route = page === "home" ? "" : page;
  const fullDir = path.join(DIST, route);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(path.join(fullDir, "index.html"), html);

  const fragment = toGhlFragment(html);
  const { html: mapped, missing } = mapImages(fragment);
  fs.mkdirSync(path.join(DIST, "ghl"), { recursive: true });
  fs.writeFileSync(path.join(DIST, "ghl", `${page}.html`), mapped);

  const kb = (Buffer.byteLength(mapped) / 1024).toFixed(1);
  console.log(`✓ ${page}: dist/ghl/${page}.html (${kb} KB)`);
  if (missing.length) console.log(`  imágenes sin URL de GHL en images.json: ${missing.join(", ")}`);
}

fs.cpSync(path.resolve("public"), DIST, { recursive: true });
fs.rmSync(TMP, { recursive: true, force: true });

/**
 * GHL inserta el código dentro de su propia página: no puede llevar
 * <html>, <head> ni <body>. Se conservan los <link> de fuentes, los <style>,
 * el contenido del body y los <script>.
 */
function toGhlFragment(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const links = head.match(/<link[^>]+fonts\.(googleapis|gstatic)[^>]*>/gi) ?? [];
  const styles = head.match(/<style[\s\S]*?<\/style>/gi) ?? [];
  const scripts = head.match(/<script[\s\S]*?<\/script>/gi) ?? [];
  return [...links, ...styles, body.trim(), ...scripts].join("\n");
}

function mapImages(html) {
  const missing = new Set();
  const out = html.replace(/\/img\/[\w./-]+/g, (src) => {
    if (imageMap[src]) return imageMap[src];
    missing.add(src);
    return src;
  });
  return { html: out, missing: [...missing] };
}
