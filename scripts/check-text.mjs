/**
 * Revisa cortes de línea y texto recortado en las 7 páginas, en 375, 768 y 1440.
 *
 *   npm run dev                       (en otra terminal)
 *   npm run check:text                [-- --base http://localhost:5173] [-- --verbose]
 *
 * Recorre p, h1-h3, dt, dd, a, li, blockquote, figcaption, label, summary, button
 * y arma los renglones de cada texto. Marca:
 *   - palabra cortada entre dos renglones
 *   - viuda: último renglón con una sola palabra
 *   - renglón que termina en "y", "a", "de", "la", "un" (u otra palabra de una letra)
 *   - texto recortado: glifos fuera de un contenedor con overflow != visible o
 *     fuera de su caja cuando el color va con background-clip: text
 *   - scroll horizontal de la página
 * No cuenta como viuda: textos de 1 o 2 palabras, logotipos en dos renglones
 * (.wordmark, .f-lockup, .f-brand) ni el corte previsto en el <wbr> de un email.
 * Si la última palabra no entra junto a la anterior en el ancho disponible, se
 * informa aparte como inevitable (no suma al total).
 * Con --verbose lista todos los renglones de cada texto.
 * Usa Playwright: el del proyecto si está, si no el global (npm i -g playwright).
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  const globalRoot = execSync("npm root -g").toString().trim();
  ({ chromium } = require(`${globalRoot}/playwright`));
}

const args = process.argv.slice(2);
const BASE = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:5173";
const VERBOSE = args.includes("--verbose");
const PAGES = ["/", "/sobre-mi", "/mentorias", "/contacto", "/conecta", "/quantum", "/fenix"];
const WIDTHS = [375, 768, 1440];

/** Corre dentro de la página. */
function audit() {
  const SELECTOR = "p, h1, h2, h3, dt, dd, a, li, blockquote, figcaption, label, summary, button, legend";
  const BAD_END = new Set(["y", "a", "o", "e", "u", "de", "la", "un"]);
  const root = document.querySelector(".cg-page");
  const inner = SELECTOR.split(", ").map((s) => `:scope ${s}`).join(", ");
  // Solo bloques "hoja": si contienen otro elemento de la lista, se revisa el de adentro
  const blocks = [...root.querySelectorAll(SELECTOR)].filter((el) => !el.querySelector(inner));

  const LOCKUP = ".wordmark, .f-lockup, .f-brand";
  const scrollsX = (el) => {
    for (let n = el.parentElement; n && n !== root; n = n.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(n).overflowX)) return true;
    }
    return false;
  };

  const visible = (el) => {
    for (let n = el; n && n !== root; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden" || n.getAttribute("aria-hidden") === "true") return false;
      if (n.classList.contains("sr-only") || n.classList.contains("marquee")) return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  };

  // Bloque más cercano (dentro de el) que contiene el nodo de texto
  const blockOf = (node, el) => {
    for (let n = node.parentElement; n && n !== el; n = n.parentElement) {
      if (getComputedStyle(n).display !== "inline" || /flex|grid/.test(getComputedStyle(n.parentElement).display)) return n;
    }
    return el;
  };

  const describe = (el) => {
    const cls = [...el.classList].slice(0, 2).join(".");
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
  };

  // Cajas que recortan a un texto: overflow distinto de visible (sin contar scrollers) y
  // background-clip: text, desde el elemento del texto hasta .cg-page
  const clipCache = new Map();
  const clipBoxes = (from) => {
    if (clipCache.has(from)) return clipCache.get(from);
    const boxes = [];
    clipCache.set(from, boxes);
    for (let n = from; n && n !== root.parentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const r = n.getBoundingClientRect();
      const scrolls = /auto|scroll/.test(cs.overflowX + cs.overflowY);
      if ((cs.overflowX !== "visible" || cs.overflowY !== "visible") && !scrolls) {
        boxes.push({ r, x: cs.overflowX !== "visible", y: cs.overflowY !== "visible", why: `overflow en ${describe(n)}` });
      }
      if (cs.backgroundClip === "text" || cs.webkitBackgroundClip === "text") {
        boxes.push({ r, x: true, y: true, why: `background-clip: text en ${describe(n)}` });
      }
    }
    return boxes;
  };

  const issues = [];
  const notes = [];
  const texts = [];
  for (const el of blocks) {
    if (!visible(el)) continue;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const tokens = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || !visible(parent)) continue;
      const fs = parseFloat(getComputedStyle(parent).fontSize);
      // Las palabras unidas con &nbsp; cuentan como una sola
      for (const m of node.data.matchAll(/[^ \t\n\r]+/g)) {
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const rects = [...range.getClientRects()].filter((r) => r.width > 0.5);
        if (rects.length) tokens.push({ text: m[0].replace(/\u00a0/g, "·"), raw: m[0], rects, fs, node });
      }
    }
    if (!tokens.length) continue;

    // Renglones por posición vertical
    const lines = [];
    let current = null;
    const startLine = (r, t) => {
      current = { mid: r.top + r.height / 2, h: r.height, right: t.rects.at(-1).right, words: [t] };
      lines.push(current);
    };
    for (const t of tokens) {
      const r = t.rects[0];
      const mid = r.top + r.height / 2;
      if (current && Math.abs(mid - current.mid) < Math.max(r.height, current.h) * 0.5 && r.left >= current.right - 2) {
        current.words.push(t);
        current.right = t.rects.at(-1).right;
      } else {
        startLine(r, t);
      }
      const tops = new Set(t.rects.map((x) => Math.round(x.top / 4)));
      if (tops.size > 1) {
        issues.push({ type: "palabra cortada", el: describe(el), detail: t.text });
        startLine(t.rects.at(-1), t);
      }
    }

    const lineTexts = lines.map((l) => l.words.map((w) => w.text).join(" "));
    texts.push({ el: describe(el), lines: lineTexts });

    const lockup = el.closest(LOCKUP);
    if (lines.length >= 2 && !lockup) {
      const last = lines.at(-1).words;
      const plannedBreak = el.querySelector("wbr") && last[0].raw.startsWith("@");
      // Si el último renglón es otro bloque (un <span> en grid, una etiqueta en flex), no es viuda
      const prev = lines.at(-2).words.at(-1);
      const otherBlock = blockOf(last[0].node, el) !== blockOf(prev.node, el);
      // Inevitable: la última palabra no entra junto a la anterior en el ancho disponible
      const cs = getComputedStyle(el);
      const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const together = prev.rects.at(-1).width + last[0].rects[0].width + last[0].fs * 0.3;
      const widow = tokens.length > 2 && last.length === 1 && !plannedBreak && !otherBlock && !last[0].text.includes("·") && /\p{L}/u.test(last[0].raw);
      if (widow && together > width) {
        notes.push(`${describe(el)}: "${prev.text} ${last[0].text}" no entra en ${Math.round(width)}px`);
      } else if (widow) {
        issues.push({ type: "viuda", el: describe(el), detail: lineTexts.join(" / ") });
      }
      for (const l of lines.slice(0, -1)) {
        const w = l.words.at(-1).raw.split("\u00a0").at(-1).toLowerCase().replace(/[^\p{L}]/gu, "");
        if (BAD_END.has(w) || w.length === 1) {
          issues.push({ type: `termina en "${w}"`, el: describe(el), detail: lineTexts.join(" / ") });
        }
      }
    }

    // Recorte: la caja de la fuente (ascendentes, acentos y descendentes) tiene que entrar en la caja que recorta
    const inScroller = scrollsX(el);
    for (const t of tokens) {
      const boxes = clipBoxes(t.node.parentElement).map((b) => (inScroller ? { ...b, x: false } : b));
      for (const r of t.rects) {
        for (const b of boxes) {
          const tol = 0.5;
          // El tracking negativo deja la tinta del último glifo un poco a la derecha de su caja
          const right = r.right + t.fs * 0.05;
          const outY = b.y && (r.top < b.r.top - tol || r.bottom > b.r.bottom + tol);
          const outX = b.x && (r.left < b.r.left - tol || right > b.r.right + tol);
          if (outY || outX) {
            issues.push({
              type: "recortado",
              el: describe(el),
              detail: `"${t.text}" (${b.why}; texto ${Math.round(r.top)}-${Math.round(r.bottom)} / ${Math.round(r.left)}-${Math.round(right)}, caja ${Math.round(b.r.top)}-${Math.round(b.r.bottom)} / ${Math.round(b.r.left)}-${Math.round(b.r.right)})`,
            });
          }
        }
      }
    }
  }

  if (document.documentElement.scrollWidth > innerWidth + 1) {
    issues.push({ type: "scroll horizontal", el: "página", detail: `${document.documentElement.scrollWidth}px > ${innerWidth}px` });
  }

  const seen = new Set();
  const unique = issues.filter((i) => {
    const k = `${i.type}|${i.el}|${i.detail}`;
    return seen.has(k) ? false : seen.add(k);
  });
  return { issues: unique, notes, texts };
}

const browser = await chromium.launch();
let total = 0;
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
    });
    await page.waitForTimeout(250);
    const { issues, notes, texts } = await page.evaluate(audit);
    total += issues.length;
    console.log(`\n${path} @ ${width}px: ${issues.length ? `${issues.length} problema(s)` : "ok"}`);
    for (const i of issues) console.log(`  ✗ ${i.type} · ${i.el} · ${i.detail}`);
    for (const n of notes) console.log(`  · palabra sola inevitable · ${n}`);
    if (VERBOSE) for (const t of texts) console.log(`    ${t.el}: ${t.lines.join("  ⏎  ")}`);
  }
  await ctx.close();
}
await browser.close();
console.log(`\nTotal: ${total}`);
process.exitCode = total ? 1 : 0;
