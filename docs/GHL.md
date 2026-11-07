# GoHighLevel: cómo publicar y qué configurar

## 1. Prueba técnica (hacer primero, apenas haya acceso)

Antes de cargar las 7 páginas, publicar la Home en una página de prueba y validar:

- [x] **Código**: `dist/ghl/home.html` completo (57 KB) entra sin cortes en el Footer Tracking (7/11/2026).
- [x] **Ancho completo**: el fragmento queda fuera de las secciones de GHL y ocupa toda la pantalla.
- [x] **CSS**: GHL no pisa los estilos en la vista previa.
- [x] **JS**: el `<script type="module">` inline corre (animaciones y contadores), sin errores en consola.
- [x] **SEO**: ver el código fuente publicado (`Ctrl+U`) y confirmar que el texto de la página está en el HTML (indexable), no cargado después.
- [ ] **Webhook**: crear el workflow con trigger "Inbound Webhook", pegar la URL en `src/shared/js/config.js` → `WEBHOOKS.apply`, rebuild, enviar el form de `/mentorias` y verificar que llega el contacto con todos los campos.
  - Si GHL lee bien el envío `no-cors` (form-urlencoded), dejarlo. Si no, probar `WEBHOOK_MODE = "cors"` (JSON).
- [ ] **Pixel**: con Meta Pixel Helper, que el `PageView` y el `Lead` disparen una sola vez.
- [ ] **Rutas**: que la página quede en `/` y las otras en `/sobre-mi`, `/mentorias`, `/contacto`, `/conecta`, `/quantum`, `/fenix`.

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
4. En el builder de la página: icono `</>` (Tracking Code) → **Footer Tracking** → `Ctrl+A`, pegar `dist/ghl/<pagina>.html` → Save → guardar la página.
   - No se usa el elemento "Code": arrastrarlo al canvas no es confiable. El builder exige al menos una sección, así que cada página tiene una sección vacía que el fragmento oculta (`#__nuxt .c-section`).
   - Sitio en GHL: **Sites → Websites → "Carola Gando Web"**. Vista previa: `https://sites.leadconnectorhq.com/preview/<id>`.

   | Página | Slug | ID (builder y vista previa) |
   |---|---|---|
   | home | `/home` (raíz al conectar dominio) | `eSTy7TRgWLrErt4yYP0a` |
   | sobre-mi | `/sobre-mi` | `fMjtxfsR9SdFfItkqCMD` |
   | mentorias | `/mentorias` | `kjd4ka7Ppy69Zmp1alrQ` |
   | contacto | `/contacto` | `vS0TnwfxtMupVVE7Lgxj` |
   | conecta | `/conecta` | `CkjobmjuXuoYSS6DXZGf` |
   | quantum | `/quantum` | `5up0PqOvK0cDVvef4TK4` |
   | fenix | `/fenix` | `3aBtW4Mn7OslMHC8dUCC` |
5. Commit + push. El repo es la fuente de verdad: nunca editar el código dentro de GHL.

## 3. Configuración en GHL

### Workflows

| Workflow | Trigger | Acciones |
|---|---|---|
| Mentoría: aplicación | Inbound Webhook (`WEBHOOKS.apply`) | Crear/actualizar contacto, aplicar tags del campo `tags`, crear oportunidad en pipeline Mentoría (Aplicó), aviso interno a Carola, CAPI `Lead` con `event_id`. *(Pendiente: si empresas va al mismo pipeline o a uno aparte)* |
| Lead magnet | Inbound Webhook (`WEBHOOKS.lead`) | Crear/actualizar contacto, tags, mail con el acceso al recurso gratis (o confirmación de lista de espera según el tag), CAPI `Lead` |
| Contacto general | Inbound Webhook (`WEBHOOKS.contact`) | Crear/actualizar contacto, tag `interes:contacto`, aviso interno con el `message`, CAPI `Contact` con `event_id`. **No** entra al pipeline Mentoría |
| Llamada agendada | Appointment booked (calendario Mentoría) | Mover oportunidad a "Llamada agendada", CAPI `Schedule` |
| Compra | Order submitted / payment received | Tag `compro:<producto>`, dar acceso en Memberships, mail con acceso, CAPI `Purchase` |

### Campos que manda el form

`first_name`, `last_name`, `full_name`, `email`, `phone`, `goal`, `format`, `company_name`, `message`, `origin`, `tags` (separados por coma), `event_id`, `page_url`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.

Custom fields: "Objetivo" (`goal`), "Formato mentoría" (`format`: `1a1` | `grupal` | `empresas`) y "Mensaje" (`message`). `company_name` va al campo nativo de empresa.

### Tags que mandan los formularios

| Form | Página | Tags |
|---|---|---|
| Aplicación | `/mentorias` | `pagina:<origen>` + `interes:mentoria-1a1` | `interes:mentoria-grupal` | `interes:empresas` |
| Contacto | `/contacto` | `pagina:contacto`, `interes:contacto` |
| Clase gratis | `/conecta` | `pagina:conecta`, `lead:conecta-clase-gratis` |
| Lista de espera evento | `/conecta` | `pagina:conecta`, `lista-espera:conecta-evento` |
| Salto Cuántico | `/quantum` | `pagina:quantum`, `lead:salto-cuantico` |
| Lista de espera del retiro | `/fenix` | `pagina:fenix`, `lista-espera:fenix-retiro` |

`<origen>` es `mentorias`, salvo que se llegue desde un programa: la firma linkea a `/mentorias?origen=conecta|quantum|fenix` y el form usa ese valor.

### Pagos

Order forms de 2 pasos en `/conecta/comprar-curso` y `/quantum/comprar-paquete` (los botones de compra ya apuntan ahí).

Payments → Integrations → Mercado Pago (Public Key + Access Token **nuevos**, ver la alerta de `docs/PLAN.md`) → configurar el webhook en Mercado Pago.

### Calendario

Crear el calendario "Llamada de diagnóstico" y pegar su URL de widget en `CALENDAR_URL` (`src/shared/js/config.js`). Después de aplicar, el form muestra el calendario embebido.
