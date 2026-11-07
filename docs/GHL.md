# GoHighLevel: cómo publicar y qué configurar

## 1. Prueba técnica (hacer primero, apenas haya acceso)

Antes de cargar las 7 páginas, publicar la Home en una página de prueba y validar:

- [x] **Código**: `dist/ghl/home.html` completo (57 KB) entra sin cortes en el Footer Tracking (7/11/2026).
- [x] **Ancho completo**: el fragmento queda fuera de las secciones de GHL y ocupa toda la pantalla.
- [x] **CSS**: GHL no pisa los estilos en la vista previa.
- [x] **JS**: el `<script type="module">` inline corre (animaciones y contadores), sin errores en consola.
- [x] **SEO**: ver el código fuente publicado (`Ctrl+U`) y confirmar que el texto de la página está en el HTML (indexable), no cargado después.
- [x] **Forms → GHL**: los forms mandan al Worker `cg-forms` (ver §3, "Setup del Worker"). Probado desde la vista previa el 7/11/2026: `/mentorias` (formato empresas) y `/contacto` crearon el contacto con nombre, email, teléfono, Business Name, tags separados y los custom fields cargados.
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

> **Regla: nada con cobro extra.** Usar siempre triggers, acciones y features de GHL sin costo adicional (nada marcado *Premium*, que cobra por ejecución, ni add-ons pagos). Si una opción paga concreta realmente vale la pena, se **propone** con su costo y la alternativa gratis, y se implementa solo con OK explícito. Nunca se arma por iniciativa propia, ni en borrador.

### Workflows

| Workflow | Trigger | Acciones |
|---|---|---|
| Mentoría: aplicación | Contact Tag (`interes:mentoria-1a1`, `interes:mentoria-grupal`, `interes:empresas`) | Crear oportunidad en pipeline Mentoría (Aplicó), aviso interno a Carola, CAPI `Lead`. *(Pendiente: si empresas va al mismo pipeline o a uno aparte)* |
| Lead magnet | Contact Tag (`lead:*`, `lista-espera:*`) | Mail con el acceso al recurso gratis (o confirmación de lista de espera según el tag), CAPI `Lead` |
| Contacto general | Contact Tag (`interes:contacto`) | Aviso interno con el custom field Mensaje, CAPI `Contact`. **No** entra al pipeline Mentoría |
| Llamada agendada | Appointment booked (calendario Mentoría) | Mover oportunidad a "Llamada agendada", CAPI `Schedule` |
| Compra | Order submitted / payment received | Tag `compro:<producto>`, dar acceso en Memberships, mail con acceso, CAPI `Purchase` |

**Cambio de enfoque (7/11/2026):** el trigger "Inbound Webhook" es **Premium** (cobra por ejecución), así que no se usa. Los forms mandan a un **Cloudflare Worker** (`worker/`), que crea o actualiza el contacto y le agrega los tags por la API v2 de GHL (sin costo). Los workflows de la tabla arrancan con el trigger gratis **"Contact Tag"** (p. ej. tag `interes:contacto` → workflow "Contacto general").

- Los 3 workflows con Inbound Webhook que se armaron primero quedaron en **borrador, nunca publicados**: borrarlos o rehacerlos con trigger "Contact Tag".
- Mapeo del Worker: `first_name`, `last_name`, `email`, `phone`, `company_name` (Business Name) y los custom fields `goal` → `objetivo`, `format` → `formato_mentora`, `message` → `mensaje`. Los campos vacíos no se mandan (no pisan datos). Los tags se **agregan** (no reemplazan) y solo se aceptan los prefijos `pagina:`, `interes:`, `lead:`, `lista-espera:`.
- Builder de una página: `https://app.gohighlevel.com/location/MroOvhFrUlGNpKkGwYJp/page-builder/<id>?source=website`.

#### Setup del Worker (hecho el 7/11/2026)

1. [x] GHL → Settings → Private Integrations → "Web Carola Gando" con scopes `contacts.write` y `contacts.readonly`. El token vive solo como secret del Worker (no se commitea ni se guarda en otro lado; si se pierde, se rota en GHL y se repite el `secret put`).
2. [x] En `worker/`: `npx wrangler login`, `npx wrangler secret put GHL_TOKEN` y `npx wrangler deploy`. Hay que correrlos **dentro de `worker/`**: desde otra carpeta wrangler no encuentra `wrangler.toml` y falla con "Required Worker name missing".
3. [x] URL: `https://cg-forms.javi23dsc.workers.dev` → `FORMS_ENDPOINT = "https://cg-forms.javi23dsc.workers.dev/submit"`. Los 7 fragmentos están repegados y verificados en la vista previa.
4. [ ] Al conectar el dominio, sumarlo a `ALLOWED_ORIGINS` en `worker/wrangler.toml` y volver a hacer deploy.

Prueba real (7/11/2026): el Worker responde 403 a otros orígenes y 400 a datos inválidos. Los envíos desde la vista previa de `/mentorias` y `/contacto` dieron 200 y en Contacts quedaron bien nombre, email, teléfono, Business Name, tags (`pagina:*`, `interes:*`), Contact source `web:<origen>` y los custom fields Objetivo, Formato mentoría y Mensaje. La key del custom field va **sin** el prefijo `contact.` (ej. `objetivo`). Logs del Worker: `npx wrangler tail` dentro de `worker/`.

Plan gratis de Workers: 100.000 requests/día por cuenta, compartidas entre todos los Workers de esa cuenta. Un form usa 2 (preflight + POST).

### Campos que manda el form

`first_name`, `last_name`, `full_name`, `email`, `phone`, `goal`, `format`, `company_name`, `message`, `origin`, `tags` (separados por coma), `event_id`, `page_url`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.

Custom fields (creados, carpeta Additional Info): "Objetivo" (`goal`, multilínea, `{{contact.objetivo}}`), "Formato mentoría" (`format`: `1a1` | `grupal` | `empresas`, una línea, `{{contact.formato_mentora}}`) y "Mensaje" (`message`, multilínea, `{{contact.mensaje}}`). `company_name` va al campo nativo de empresa.

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
