/**
 * Comportamientos de interfaz compartidos. Todo con IntersectionObserver:
 * nada escucha el evento scroll, salvo el respaldo de la barra de progreso
 * en navegadores sin animation-timeline (con requestAnimationFrame).
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

/** Videos (Vimeo o MP4 propio): se cargan recién al hacer clic. */
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

  // Videos propios (MP4): se cargan recién al hacer clic, con el poster como fondo
  root.querySelectorAll("[data-video]").forEach((button) => {
    button.addEventListener("click", () => {
      const video = document.createElement("video");
      video.src = button.dataset.video;
      video.poster = button.querySelector("img")?.src ?? "";
      video.controls = true;
      video.playsInline = true;
      video.autoplay = true;
      video.className = "video-frame";
      video.setAttribute("aria-label", button.getAttribute("aria-label") || "Video");
      button.replaceWith(video);
      video.focus();
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

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Salida de la transición entre páginas: baja una cortina negra y recién ahí navega.
 * Corre siempre, no solo sin @view-transition: la transición nativa se cancela
 * si el CSS de la página nueva llega tarde (en GHL el fragmento se inyecta al
 * final), y así la salida es igual en todos los navegadores. Si la nativa sí
 * corre, funde el negro con la página nueva y evita cualquier destello.
 * La entrada (cortina que se levanta) es CSS puro: ver components.css.
 */
export function initPageTransitions(root) {
  if (reducedMotion()) return;

  const veil = document.createElement("div");
  veil.className = "page-veil";
  veil.setAttribute("aria-hidden", "true");
  root.append(veil);

  let safety;
  const lift = () => {
    clearTimeout(safety);
    veil.classList.remove("is-on");
  };

  root.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    // Anclas dentro de la misma página: scroll normal, sin cortina
    if (url.pathname === location.pathname && url.search === location.search) return;

    e.preventDefault();
    veil.classList.add("is-on");
    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      location.href = url.href;
    };
    veil.addEventListener("transitionend", go, { once: true });
    setTimeout(go, 480);
    // Seguridad: si la navegación no ocurre (o tarda demasiado), la cortina se levanta
    safety = setTimeout(lift, 4000);
  });

  // Volver con el botón Atrás restaura la página desde la caché: sin cortina
  addEventListener("pageshow", (e) => e.persisted && lift());
}

/** Barra vertical de progreso de scroll. CSS con animation-timeline; si no hay soporte, rAF. */
export function initScrollProgress(root) {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  root.append(bar);
  if (CSS.supports("animation-timeline: scroll()")) return;

  const doc = document.documentElement;
  let queued = false;
  const update = () => {
    queued = false;
    const max = doc.scrollHeight - innerHeight;
    bar.style.setProperty("--progress", max > 0 ? Math.min(scrollY / max, 1).toFixed(4) : "0");
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue, { passive: true });
  update();
}

/** Botón "volver arriba": aparece cuando el hero sale de pantalla. */
export function initBackToTop(root) {
  const hero = root.querySelector("[data-hero]") ?? root.querySelector("main > *");
  if (!hero || !("IntersectionObserver" in window)) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "to-top";
  button.setAttribute("aria-label", "Volver arriba");
  button.tabIndex = -1;
  button.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  root.append(button);

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
    // El foco vuelve al principio de la página (la marca de la nav)
    root.querySelector("[data-nav] a, a, button")?.focus({ preventScroll: true });
  });

  new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    button.classList.toggle("is-visible", show);
    button.tabIndex = show ? 0 : -1;
  }).observe(hero);
}

/**
 * Fotos ampliables: al hacer clic (o Enter) en una foto de contenido se abre
 * a pantalla completa y se puede pasar a la anterior o la siguiente con las
 * flechas, el teclado o deslizando. Quedan fuera las decorativas (alt=""),
 * las que están dentro de un link o botón y la foto del hero.
 */
export function initLightbox(root) {
  const imgs = [...root.querySelectorAll("main img:not([alt='']):not([data-no-zoom])")].filter(
    (img) => !img.closest("a, button, [data-hero]"),
  );
  if (!imgs.length) return;

  const box = document.createElement("dialog");
  box.className = "lightbox";
  box.setAttribute("aria-label", "Foto ampliada");
  box.innerHTML = `
    <figure class="lightbox__stage">
      <img class="lightbox__img" alt="" />
      <figcaption class="lightbox__cap"><span class="lightbox__count"></span><span class="lightbox__alt"></span></figcaption>
    </figure>
    <button class="lightbox__btn lightbox__close" type="button" aria-label="Cerrar">${icon("M6 6l12 12M18 6L6 18")}</button>
    <button class="lightbox__btn lightbox__prev" type="button" aria-label="Foto anterior">${icon("M15 5l-7 7 7 7")}</button>
    <button class="lightbox__btn lightbox__next" type="button" aria-label="Foto siguiente">${icon("M9 5l7 7-7 7")}</button>`;
  root.append(box);

  const big = box.querySelector(".lightbox__img");
  const count = box.querySelector(".lightbox__count");
  const alt = box.querySelector(".lightbox__alt");
  const single = imgs.length === 1;
  box.toggleAttribute("data-single", single);
  let index = 0;
  let opener = null;

  const show = (i, dir = 0) => {
    index = (i + imgs.length) % imgs.length;
    const img = imgs[index];
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    alt.textContent = img.alt;
    count.textContent = single ? "" : `${index + 1} / ${imgs.length}`;
    big.dataset.dir = dir > 0 ? "next" : dir < 0 ? "prev" : "";
    // Reinicia la animación de entrada de la foto
    big.classList.remove("is-in");
    void big.offsetWidth;
    big.classList.add("is-in");
  };

  const open = (i) => {
    opener = imgs[i];
    show(i);
    box.showModal();
  };
  const close = () => box.open && box.close();
  box.addEventListener("close", () => {
    opener?.focus({ preventScroll: true });
  });

  imgs.forEach((img, i) => {
    img.classList.add("is-zoomable");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `Ampliar foto: ${img.alt}`);
    img.addEventListener("click", () => open(i));
    img.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      open(i);
    });
  });

  box.querySelector(".lightbox__close").addEventListener("click", close);
  box.querySelector(".lightbox__prev").addEventListener("click", () => show(index - 1, -1));
  box.querySelector(".lightbox__next").addEventListener("click", () => show(index + 1, 1));
  // Clic en el fondo (fuera de la foto y los botones) cierra
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lightbox__stage")) close();
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(index + 1, 1);
    if (e.key === "ArrowLeft") show(index - 1, -1);
  });

  // Deslizar en pantallas táctiles
  let startX = null;
  box.addEventListener("pointerdown", (e) => e.pointerType !== "mouse" && (startX = e.clientX));
  box.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40 && !single) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
}

function icon(d) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}
