import { boot } from "../../shared/js/main.js";
import "./fenix.css";

boot();
// En el próximo microtask: así las constantes de abajo ya están inicializadas
queueMicrotask(() => document.querySelectorAll("[data-embers]").forEach(initEmbers));

/*
 * Brasas pre-dibujadas: un sprite por color con el núcleo y el halo ya
 * pintados. Dibujar con shadowBlur en cada cuadro obligaba a la placa de video
 * a desenfocar decenas de círculos 60 veces por segundo; copiar un sprite con
 * drawImage cuesta casi nada y se ve igual.
 */
const EMBER_COLORS = ["255 154 90", "242 213 140", "226 85 42", "255 200 120"];
const SPRITE = 64;
// El halo llega a ~7 radios del centro, como el shadowBlur = r * 6 de antes
const HALO = 7;
let sprites;

function emberSprites() {
  if (sprites) return sprites;
  sprites = EMBER_COLORS.map((color) => {
    const c = document.createElement("canvas");
    c.width = c.height = SPRITE;
    const g = c.getContext("2d");
    const h = SPRITE / 2;
    const core = 1 / HALO;
    const grad = g.createRadialGradient(h, h, 0, h, h, h);
    grad.addColorStop(0, `rgb(${color} / 1)`);
    grad.addColorStop(core, `rgb(${color} / 1)`);
    grad.addColorStop(core * 1.6, `rgb(${color} / 0.45)`);
    grad.addColorStop(0.45, `rgb(${color} / 0.12)`);
    grad.addColorStop(1, `rgb(${color} / 0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, SPRITE, SPRITE);
    return c;
  });
  return sprites;
}

/**
 * Brasas que suben y titilan en un <canvas>. Solo anima mientras está en
 * pantalla y con la pestaña visible; se apaga con prefers-reduced-motion.
 */
function initEmbers(canvas) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const art = emberSprites();
  let embers = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let visible = false;
  let last = 0;

  const spawn = (anywhere) => ({
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 10,
    r: 0.6 + Math.random() * 1.8,
    vy: 0.25 + Math.random() * 0.7,
    sway: Math.random() * Math.PI * 2,
    life: 0.5 + Math.random() * 0.5,
    sprite: art[Math.floor(Math.random() * art.length)],
  });

  const resize = () => {
    // Las brasas son puntos de luz difusos: 1,5x alcanza y ahorra memoria en pantallas 4K
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    // Más brasas en pantallas grandes, sin pasarse en mobile
    const count = Math.round(Math.min(70, width / 18));
    embers = Array.from({ length: count }, () => spawn(true));
  };

  const draw = (now) => {
    // Paso de tiempo normalizado a 60 fps: misma velocidad en monitores de 120/144 Hz
    const step = last ? Math.min((now - last) / 16.67, 3) : 1;
    last = now;
    ctx.clearRect(0, 0, width, height);
    for (const e of embers) {
      e.y -= e.vy * step;
      e.sway += 0.02 * step;
      e.x += Math.sin(e.sway) * 0.35 * step;
      // Se apagan a medida que suben
      const fade = Math.max(0, Math.min(1, e.y / height)) * e.life;
      if (fade > 0.01) {
        const size = e.r * HALO * 2;
        ctx.globalAlpha = fade * (0.7 + Math.random() * 0.3);
        ctx.drawImage(e.sprite, e.x - size / 2, e.y - size / 2, size, size);
      }
      if (e.y < -10) Object.assign(e, spawn(false));
    }
    frame = requestAnimationFrame(draw);
  };

  const run = () => {
    cancelAnimationFrame(frame);
    last = 0;
    if (visible && !document.hidden) frame = requestAnimationFrame(draw);
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    run();
  }).observe(canvas);
  document.addEventListener("visibilitychange", run);
}
