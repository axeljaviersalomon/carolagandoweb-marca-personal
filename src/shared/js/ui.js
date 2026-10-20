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

  // Fondo sólido cuando el hero sale de pantalla o el menú está abierto
  const hero = root.querySelector("[data-hero]");
  let overHero = Boolean(hero);
  const paint = () => nav.classList.toggle("is-solid", !overHero || nav.hasAttribute("data-open"));
  if (hero) {
    new IntersectionObserver(
      ([entry]) => {
        overHero = entry.isIntersecting;
        paint();
      },
      { rootMargin: "-68px 0px 0px 0px" },
    ).observe(hero);
  }
  paint();

  // Menú mobile
  const toggle = nav.querySelector(".nav__toggle");
  const panel = nav.querySelector(".nav__panel");
  const setOpen = (open) => {
    nav.toggleAttribute("data-open", open);
    paint();
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
