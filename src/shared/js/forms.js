import { WEBHOOKS, WEBHOOK_MODE, CALENDAR_URL, CONTACT_EMAIL } from "./config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const RULES = {
  name: (v) => (v.trim().length >= 2 ? "" : "Contanos tu nombre."),
  email: (v) => (EMAIL_RE.test(v.trim()) ? "" : "Revisá el email, parece incompleto."),
  phone: (v) => (v.replace(/\D/g, "").length >= 8 ? "" : "Dejanos un WhatsApp con código de área."),
  organization: (v) => (v.trim().length >= 2 ? "" : "Contanos el nombre de la empresa."),
  message: (v) => (v.trim().length >= 10 ? "" : "Contanos un poco más, así te respondemos bien."),
};

// Formato elegido en la aplicación → tag interes:<...> en GHL
const FORMAT_TAGS = { "1a1": "mentoria-1a1", grupal: "mentoria-grupal", empresas: "empresas" };

// Páginas válidas para ?origen= (los programas lo mandan al linkear a /mentorias)
const ORIGINS = ["home", "sobre-mi", "mentorias", "contacto", "conecta", "quantum", "fenix"];

/**
 * Formularios propios que envían a un Inbound Webhook de GHL.
 * `data-form` define el webhook (apply | lead | contact) y `data-origin` la página.
 * Tags que llegan a GHL: pagina:<origen> + interes:<tipo> (+ data-tags extra).
 */
export function initForms(root) {
  root.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submit(form);
    });
    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => input.value && validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field")?.hasAttribute("data-invalid")) validateField(input);
      });
    });
    initFormat(form);
  });

  // Links "Elegir este formato": marcan el formato en la aplicación antes de saltar a ella
  root.querySelectorAll("[data-pick-format]").forEach((link) => {
    link.addEventListener("click", () => {
      const radio = root.querySelector(`form[data-form="apply"] input[name="format"][value="${link.dataset.pickFormat}"]`);
      if (!radio) return;
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

/** Muestra los campos `data-format-only` que corresponden al formato elegido. */
function initFormat(form) {
  const radios = form.querySelectorAll('input[name="format"]');
  if (!radios.length) return;
  const sync = () => {
    const format = form.querySelector('input[name="format"]:checked')?.value;
    form.querySelectorAll("[data-format-only]").forEach((field) => {
      field.hidden = field.dataset.formatOnly !== format;
    });
  };
  radios.forEach((radio) => radio.addEventListener("change", sync));
  sync();
}

function validateField(input) {
  const rule = RULES[input.name];
  if (!rule) return true;
  const message = rule(input.value);
  const field = input.closest(".field");
  field.toggleAttribute("data-invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  field.querySelector(".field__error").textContent = message;
  return !message;
}

async function submit(form) {
  const button = form.querySelector('[type="submit"]');
  const alert = form.querySelector(".form__alert");
  alert.hidden = true;

  const inputs = [...form.querySelectorAll("input[name], textarea[name]")].filter(
    (i) => i.name in RULES && !i.closest("[hidden]"),
  );
  const invalid = inputs.filter((input) => !validateField(input));
  if (invalid.length) {
    invalid[0].focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  // Honeypot: un bot completó el campo oculto. Se simula éxito sin enviar.
  if (data.company) return showSuccess(form);

  const kind = form.dataset.form;
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get("origen");
  const origin = ORIGINS.includes(fromUrl) ? fromUrl : form.dataset.origin || "home";
  const eventId = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const [firstName, ...rest] = data.name.trim().split(/\s+/);
  const format = kind === "apply" ? data.format || "1a1" : "";
  const interest = { apply: `interes:${FORMAT_TAGS[format]}`, contact: "interes:contacto" }[kind];
  const tags = [`pagina:${origin}`, interest, form.dataset.tags].filter(Boolean).join(",");

  const payload = {
    first_name: firstName,
    last_name: rest.join(" "),
    full_name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: (data.phone || "").trim(),
    goal: (data.goal || "").trim(),
    format,
    company_name: format === "empresas" ? (data.organization || "").trim() : "",
    message: (data.message || "").trim(),
    origin,
    tags,
    event_id: eventId,
    page_url: location.href,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
  };

  button.setAttribute("aria-busy", "true");
  try {
    await send(WEBHOOKS[kind], payload);
    // Contacto general no es un lead de venta: va como evento Contact
    const pixelEvent = kind === "contact" ? "Contact" : "Lead";
    window.fbq?.("track", pixelEvent, { content_name: `${kind}:${origin}` }, { eventID: eventId });
    showSuccess(form);
  } catch (err) {
    console.error("[cg] envío fallido", err);
    alert.textContent = `No pudimos enviar tus datos. Probá de nuevo o escribinos a ${CONTACT_EMAIL}.`;
    alert.hidden = false;
  } finally {
    button.removeAttribute("aria-busy");
  }
}

async function send(url, payload) {
  if (!url) {
    if (import.meta.env.DEV) {
      console.info("[cg] webhook sin configurar, envío simulado:", payload);
      await new Promise((r) => setTimeout(r, 700));
      return;
    }
    throw new Error("Webhook sin configurar (src/shared/js/config.js)");
  }

  if (WEBHOOK_MODE === "cors") {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return;
  }

  await fetch(url, { method: "POST", mode: "no-cors", body: new URLSearchParams(payload) });
}

function showSuccess(form) {
  const wrapper = form.parentElement;
  const success = wrapper.querySelector("[data-success]");
  if (!success) return;
  form.hidden = true;
  success.hidden = false;

  if (form.dataset.form === "apply" && CALENDAR_URL) {
    success.querySelector("[data-success-text]").textContent =
      "Elegí el día y horario para nuestra llamada de diagnóstico.";
    const frame = document.createElement("iframe");
    frame.className = "calendar-embed";
    frame.src = CALENDAR_URL;
    frame.title = "Agendar llamada con Carola Gando";
    frame.loading = "lazy";
    success.querySelector("[data-calendar]").append(frame);
  }
  success.focus({ preventScroll: true });
  success.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
}
