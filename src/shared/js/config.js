/**
 * Configuración de integraciones con GoHighLevel.
 *
 * FORMS_ENDPOINT: URL del Cloudflare Worker `cg-forms` (carpeta worker/). Cada
 * form hace POST a `${FORMS_ENDPOINT}/<apply|lead|contact>` y el Worker crea o
 * actualiza el contacto con sus tags por la API de GHL (sin costo extra; no se
 * usa el trigger Premium "Inbound Webhook"). No lleva secretos: el token de GHL
 * vive solo en el Worker.
 * Mientras esté vacía, en dev el envío se simula y en producción se muestra
 * un error con el email de contacto (nunca se pierde el lead en silencio).
 */
export const FORMS_ENDPOINT = "https://cg-forms.javi23dsc.workers.dev/submit";

// Calendario nativo de GHL para agendar la llamada después de aplicar.
export const CALENDAR_URL = ""; // TODO(GHL): p. ej. https://api.leadconnectorhq.com/widget/booking/XXXX

export const CONTACT_EMAIL = "carolagando.coach@gmail.com";
