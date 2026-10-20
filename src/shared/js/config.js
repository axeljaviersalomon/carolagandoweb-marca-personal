/**
 * Configuración de integraciones con GoHighLevel.
 *
 * WEBHOOKS: URL del trigger "Inbound Webhook" de cada workflow de GHL.
 * No es una API key: solo dispara ese workflow, por eso puede ir en el front.
 * Mientras esté vacía, en dev el envío se simula y en producción se muestra
 * un error con el email de contacto (nunca se pierde el lead en silencio).
 *
 * TODO(GHL): completar cuando exista la cuenta.
 */
export const WEBHOOKS = {
  apply: "", // Workflow "Mentoría: aplicación"
  lead: "", // Workflow "Lead magnet" (Salto Cuántico, lista de espera, etc.)
};

/**
 * Cómo se envía al webhook. "no-cors" + form-urlencoded es una request simple:
 * no depende de que GHL responda con headers CORS, pero no permite leer la
 * respuesta. Validar en la prueba técnica de GHL (docs/GHL.md) y cambiar a
 * "cors" si GHL lo permite, para poder detectar errores del servidor.
 */
export const WEBHOOK_MODE = "no-cors";

// Calendario nativo de GHL para agendar la llamada después de aplicar.
export const CALENDAR_URL = ""; // TODO(GHL): p. ej. https://api.leadconnectorhq.com/widget/booking/XXXX

export const CONTACT_EMAIL = "carolagando.coach@gmail.com";
