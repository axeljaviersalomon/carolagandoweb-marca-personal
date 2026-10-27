import { boot } from "../../shared/js/main.js";
import "./fenix.css";

boot();
document.querySelectorAll("[data-embers]").forEach(initEmbers);

/**
 * Brasas que suben y titilan en un <canvas>. Solo anima mientras está en
 * pantalla y se apaga con prefers-reduced-motion.
 */
function initEmbers(canvas) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const colors = ["255 154 90", "242 213 140", "226 85 42", "255 200 120"];
  let embers = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const spawn = (anywhere) => ({
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 10,
    r: 0.6 + Math.random() * 1.8,
    vy: 0.25 + Math.random() * 0.7,
    sway: Math.random() * Math.PI * 2,
    life: 0.5 + Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  });

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Más brasas en pantallas grandes, sin pasarse en mobile
    const count = Math.round(Math.min(70, width / 18));
    embers = Array.from({ length: count }, () => spawn(true));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    for (const e of embers) {
      e.y -= e.vy;
      e.sway += 0.02;
      e.x += Math.sin(e.sway) * 0.35;
      // Se apagan a medida que suben
      const fade = Math.max(0, Math.min(1, e.y / height)) * e.life;
      const flicker = 0.7 + Math.random() * 0.3;
      ctx.fillStyle = `rgb(${e.color} / ${fade * flicker})`;
      ctx.shadowColor = `rgb(${e.color} / ${fade})`;
      ctx.shadowBlur = e.r * 6;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
      if (e.y < -10) Object.assign(e, spawn(false));
    }
    frame = requestAnimationFrame(draw);
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);
    if (entry.isIntersecting) frame = requestAnimationFrame(draw);
  }).observe(canvas);
}
