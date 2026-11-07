/**
 * Cloudflare Worker: recibe los formularios de la web y crea/actualiza el
 * contacto en GoHighLevel por la API v2 (sin costo extra, a diferencia del
 * trigger Premium "Inbound Webhook").
 *
 * POST /submit/<apply|lead|contact>  (JSON, mismo payload que arma forms.js)
 *   1. contacts/upsert  → crea o actualiza por email/teléfono.
 *   2. contacts/<id>/tags → AGREGA los tags (el upsert los reemplazaría).
 * Los workflows de GHL arrancan con el trigger gratis "Contact Tag".
 *
 * Config (worker/wrangler.toml + secret):
 *   GHL_TOKEN        secret: token de Private Integration (scopes contacts.write, contacts.readonly)
 *   GHL_LOCATION_ID  var
 *   ALLOWED_ORIGINS  var, orígenes separados por coma
 */

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const KINDS = ["apply", "lead", "contact"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Solo tags con estos prefijos: evita que alguien cree tags arbitrarios desde afuera
const TAG_RE = /^(pagina|interes|lead|lista-espera):[a-z0-9-]{1,40}$/;
const MAX_LEN = 2000;

// Campo del form → key del custom field en GHL (Settings → Custom Fields)
const CUSTOM_FIELDS = { goal: "objetivo", format: "formato_mentora", message: "mensaje" };

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
    const cors = allowed.includes(origin)
      ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
      : {};

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: cors["Access-Control-Allow-Origin"] ? 204 : 403,
        headers: {
          ...cors,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const json = (status, body) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    const kind = new URL(request.url).pathname.match(/^\/submit\/([a-z]+)$/)?.[1];
    if (request.method !== "POST" || !KINDS.includes(kind)) return json(404, { error: "not_found" });
    if (!cors["Access-Control-Allow-Origin"]) return json(403, { error: "origin" });

    let data;
    try {
      data = await request.json();
    } catch {
      return json(400, { error: "json" });
    }

    const contact = buildContact(data, env.GHL_LOCATION_ID);
    if (!contact) return json(400, { error: "invalid" });
    const tags = String(data.tags || "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => TAG_RE.test(t))
      .slice(0, 6);

    try {
      const upsert = await ghl(env, "POST", "/contacts/upsert", contact);
      const id = upsert?.contact?.id;
      if (!id) throw new Error("upsert sin id");
      if (tags.length) await ghl(env, "POST", `/contacts/${id}/tags`, { tags });
      return json(200, { ok: true });
    } catch (err) {
      console.error(`[cg-forms] ${kind}:`, err.message);
      return json(502, { error: "ghl" });
    }
  },
};

/** Arma el body del upsert. Omite los campos vacíos para no pisar datos existentes. */
export function buildContact(data, locationId) {
  const str = (v) => String(v ?? "").trim().slice(0, MAX_LEN);
  const email = str(data.email).toLowerCase();
  if (!EMAIL_RE.test(email) || str(data.first_name).length < 1) return null;

  const contact = { locationId, email };
  const set = (key, value) => {
    if (value) contact[key] = value;
  };
  set("firstName", str(data.first_name).slice(0, 100));
  set("lastName", str(data.last_name).slice(0, 100));
  set("phone", str(data.phone).slice(0, 40));
  set("companyName", str(data.company_name).slice(0, 200));
  set("source", data.origin ? `web:${str(data.origin).slice(0, 30)}` : "");

  const customFields = Object.entries(CUSTOM_FIELDS)
    .map(([field, key]) => ({ key, field_value: str(data[field]) }))
    .filter((f) => f.field_value);
  if (customFields.length) contact.customFields = customFields;
  return contact;
}

async function ghl(env, method, path, body) {
  const res = await fetch(GHL_API + path, {
    method,
    headers: {
      Authorization: `Bearer ${env.GHL_TOKEN}`,
      Version: GHL_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} HTTP ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}
