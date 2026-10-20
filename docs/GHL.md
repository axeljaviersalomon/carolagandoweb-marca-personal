# GoHighLevel: cómo publicar y qué configurar

## 1. Prueba técnica (hacer primero, apenas haya acceso)

Antes de cargar las 4 páginas, publicar la Home en una página de prueba y validar:

- [ ] **Bloque custom code**: pegar `dist/ghl/home.html` completo. Ver si GHL tiene límite de caracteres (el archivo pesa ~50 KB).
- [ ] **Ancho completo**: la sección, fila y columna de GHL a ancho completo y sin padding, para que el diseño ocupe toda la pantalla.
- [ ] **CSS**: que nada de GHL pise los estilos (todo está bajo `.cg-page`) y que nuestro CSS no rompa elementos nativos de GHL.
- [ ] **JS**: que el `<script type="module">` inline se ejecute (las animaciones aparecen, el menú mobile abre).
- [ ] **SEO**: ver el código fuente publicado (`Ctrl+U`) y confirmar que el texto de la página está en el HTML (indexable), no cargado después.
- [ ] **Webhook**: crear el workflow con trigger "Inbound Webhook", pegar la URL en `src/shared/js/config.js` → `WEBHOOKS.apply`, rebuild, enviar el form y verificar que llega el contacto con todos los campos.
  - Si GHL lee bien el envío `no-cors` (form-urlencoded), dejarlo. Si no, probar `WEBHOOK_MODE = "cors"` (JSON).
- [ ] **Pixel**: con Meta Pixel Helper, que el `PageView` y el `Lead` disparen una sola vez.
- [ ] **Rutas**: que la página quede en `/` y las otras en `/conecta`, `/quantum`, `/fenix`.

## 2. Publicar una página

```bash
npm run build            # todas
npm run build home       # solo una
```

1. Subir las imágenes nuevas de `public/img/` a la galería de medios de GHL.
2. Copiar la URL de cada una en `images.json`:
   ```json
   { "/img/carola.webp": "https://assets.cdn.filesafe.space/.../carola.webp" }
   ```
3. `npm run build` (avisa qué imágenes no tienen URL de GHL todavía).
4. Pegar `dist/ghl/<pagina>.html` en el bloque custom code de esa página. Reemplazar todo el contenido anterior.
5. Commit + push. El repo es la fuente de verdad: nunca editar el código dentro de GHL.

## 3. Configuración en GHL

### Workflows

| Workflow | Trigger | Acciones |
|---|---|---|
| Mentoría: aplicación | Inbound Webhook (`WEBHOOKS.apply`) | Crear/actualizar contacto, aplicar tags del campo `tags`, crear oportunidad en pipeline Mentoría (Aplicó), aviso interno a Carola, CAPI `Lead` con `event_id` |
| Lead magnet | Inbound Webhook (`WEBHOOKS.lead`) | Crear/actualizar contacto, tags, mail con el acceso al recurso gratis, CAPI `Lead` |
| Llamada agendada | Appointment booked (calendario Mentoría) | Mover oportunidad a "Llamada agendada", CAPI `Schedule` |
| Compra | Order submitted / payment received | Tag `compro:<producto>`, dar acceso en Memberships, mail con acceso, CAPI `Purchase` |

### Campos que manda el form

`first_name`, `last_name`, `full_name`, `email`, `phone`, `goal`, `origin`, `tags` (separados por coma), `event_id`, `page_url`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.

Crear un custom field "Objetivo" para `goal`.

### Pagos

Payments → Integrations → Mercado Pago (Public Key + Access Token **nuevos**, ver la alerta de `docs/PLAN.md`) → configurar el webhook en Mercado Pago.

### Calendario

Crear el calendario "Llamada de diagnóstico" y pegar su URL de widget en `CALENDAR_URL` (`src/shared/js/config.js`). Después de aplicar, el form muestra el calendario embebido.
