/**
 * Comportamientos de interfaz compartidos. Todo con IntersectionObserver:
 * nada escucha el evento scroll.
 */

export function initReveal(root) {
  const items = root.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((el) => io.observe(el));
}

export function initNav(root) {
  const nav = root.querySelector("[data-nav]");
  if (!nav) return;

  const active = nav.dataset.active;
  nav.querySelectorAll(`[data-nav-link="${active}"]`).forEach((a) => a.setAttribute("aria-current", "page"));

  // La nav siempre tiene fondo; en los programas resalta la sección visible
  initScrollSpy(nav);

  // Menú mobile
  const toggle = nav.querySelector(".nav__toggle");
  const panel = nav.querySelector(".nav__panel");
  const setOpen = (open) => {
    nav.toggleAttribute("data-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    panel.hidden = !open;
  };
  toggle.addEventListener("click", () => setOpen(!nav.hasAttribute("data-open")));
  panel.addEventListener("click", (e) => e.target.closest("a") && setOpen(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && nav.hasAttribute("data-open") && setOpen(false));
}

/** Barra fija con el CTA en mobile: visible entre el hero y el formulario. */
export function initStickyCta(root) {
  const bar = root.querySelector("[data-sticky-cta]");
  const hero = root.querySelector("[data-hero]");
  const target = root.querySelector("[data-sticky-hide]");
  if (!bar || !hero) return;

  const state = { hero: true, target: false };
  const link = bar.querySelector("a");
  const update = () => {
    const show = !state.hero && !state.target;
    bar.classList.toggle("is-visible", show);
    bar.setAttribute("aria-hidden", String(!show));
    link.tabIndex = show ? 0 : -1;
  };
  new IntersectionObserver(([e]) => {
    state.hero = e.isIntersecting;
    update();
  }).observe(hero);
  if (target) {
    new IntersectionObserver(([e]) => {
      state.target = e.isIntersecting;
      update();
    }).observe(target);
  }
}

/** Videos de Vimeo: se carga el iframe recién al hacer clic. */
export function initVideos(root) {
  root.querySelectorAll("[data-vimeo]").forEach((button) => {
    button.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.src = `https://player.vimeo.com/video/${button.dataset.vimeo}?autoplay=1&dnt=1`;
      frame.title = button.getAttribute("aria-label") || "Video";
      frame.allow = "autoplay; fullscreen; picture-in-picture";
      frame.allowFullscreen = true;
      frame.className = "video-frame";
      button.replaceWith(frame);
    });
  });
}

export function initYear(root) {
  root.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

/** Links a anclas de la nav (programas): marca la sección que está en pantalla. */
function initScrollSpy(nav) {
  const links = [...nav.querySelectorAll('.nav__links a[href^="#"]')];
  const targets = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if (!targets.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.hash === `#${entry.target.id}`));
      });
    },
    // Una franja fina a media pantalla: solo una sección la cruza a la vez
    { rootMargin: "-45% 0px -50% 0px" },
  );
  targets.forEach((t) => io.observe(t));
}

/** Luz que sigue al puntero en tarjetas con [data-glow]. Solo con mouse. */
export function initPointerGlow(root) {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  root.querySelectorAll("[data-glow]").forEach((card) => {
    const glow = document.createElement("i");
    glow.className = "cg-glow";
    glow.setAttribute("aria-hidden", "true");
    card.prepend(glow);
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      glow.style.setProperty("--x", `${e.clientX - r.left}px`);
      glow.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  });
}

/** Números que cuentan hasta su valor al entrar en pantalla ([data-count]). */
export function initCountUp(root) {
  const items = root.querySelectorAll("[data-count]");
  if (!items.length || !("IntersectionObserver" in window)) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const format = new Intl.NumberFormat("es-AR");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target;
        const end = Number(el.dataset.count);
        const start = performance.now();
        const duration = 1600;
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          // ease-out exponencial: arranca rápido y se asienta despacio
          const eased = t === 1 ? 1 : 1 - 2 ** (-10 * t);
          el.textContent = format.format(Math.round(end * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 },
  );
  items.forEach((el) => {
    el.textContent = "0";
    io.observe(el);
  });
}
