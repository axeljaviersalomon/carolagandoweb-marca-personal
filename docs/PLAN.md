# Plan: web de marca personal de Carola Gando

Decisiones cerradas en la sesión de grilling del 20-10-2026. Reemplaza a los proyectos `Carola/` (Next.js + Vercel + Brevo) y `funnels/` (Next.js + Cloudflare + Brevo), que quedan solo como referencia de copy y estructura.

## ⚠️ Importante y pendiente

- **Rotar el access token de producción de Mercado Pago.** El dump `Quantum Programa/u141077374_qIkc7.sql` lo tiene en texto plano (además de la public key, tokens de test y hashes de contraseñas) y está en OneDrive. Rotarlo desde el panel de desarrolladores de Mercado Pago **antes** de conectar MP en GHL, y usar las credenciales nuevas. Decidir si el `.sql` sale de OneDrive. Nunca subirlo a un repo (`.gitignore` ya excluye `*.sql` y `*.zip`).

## Sitio

Un solo dominio, `carolagando.coach` (todavía no comprado). Un dominio único concentra el Meta Pixel y las audiencias. Cuando se apague `quantumprograma.com`, hacer un 301 a `/quantum`.

| Ruta | Qué vende | Lead magnet / captura |
|---|---|---|
| `/` | Mentoría 1:1 (USD, el precio no se muestra). Recomienda las 3 subrutas | Aplicación a la mentoría |
| `/conecta` | Evento en vivo, grabaciones (curso) y e-book (próximamente) | Lista de espera del evento + primera clase gratis |
| `/quantum` | Paquete (Abundancia Infinita, Espiritualidad Práctica, Rol de las Relaciones, Salto Cuántico) + e-book. Solo el paquete, no programas sueltos | Salto Cuántico gratis (confirmar con la clienta que puede quedar gratis siempre) |
| `/fenix` | Retiro presencial de alto impacto (próxima edición a confirmar) + e-book y programa grabado (los dos por crear) | Lista de espera de la próxima edición |

Las 3 subrutas también promocionan la mentoría (misma mentoría, un solo flujo; el tag de origen dice de dónde vino).

## Infraestructura: todo en GoHighLevel

- **Páginas**: código propio (este repo) → `npm run build` → `dist/ghl/<pagina>.html` → bloque "Custom code" de una página de GHL. Nunca se edita en GHL. Ver `docs/GHL.md`.
- **Formularios**: propios, mínimos, con POST a un Inbound Webhook de un workflow de GHL. Honeypot anti-spam. Sin API key en el front.
- **Mentoría**: aplicación (nombre, email, WhatsApp, "¿qué querés lograr?" opcional) → calendario nativo de GHL para la llamada → link de pago por mail. Se cobra en USD fuera de la web. *(Pendiente confirmar si siempre hay llamada antes del link de pago.)*
- **Productos**: order form nativo de GHL de 2 pasos, en el mismo dominio (`/conecta/comprar-...`), cobrado con **Mercado Pago nativo de GHL** en ARS.
- **Entrega**: GHL Memberships (curso con login). Un workflow manda el acceso por mail al pagar.
- **WhatsApp**: no va en la web.
- **Edición**: el front lo edita solo el desarrollador. La clienta usa CRM, campañas y calendario en GHL.

## Segmentación (GHL)

- Tags: `pagina:home|conecta|quantum|fenix`, `interes:mentoria`, `lead:<producto>`, `compro:<producto>`, `lista-espera:<producto>`.
- Pipeline **Mentoría**: Aplicó → Llamada agendada → Llamada hecha → Ganada / Perdida.
- UTM: GHL las guarda en la atribución del contacto. El form propio además las manda en el payload.

## Tracking

- Meta Pixel en el header del sitio GHL + **Conversions API** desde workflows de GHL.
- Eventos: `Lead` (lead magnet y aplicación), `Schedule` (llamada agendada), `Purchase` (compra).
- El `Lead` del navegador lo dispara el JS del form con un `eventID` que también viaja al webhook (`event_id`) para deduplicar con CAPI.
- GA4 opcional.

## Migración desde WooCommerce (`quantumprograma.com`)

- ~80 contactos (20 clientes Woo + 62 invitados ShopMagic) → importar a GHL con `compro:<producto>`.
- Mandarles mail con el acceso nuevo (Memberships).
- Apagar el WP recién cuando la entrega de GHL esté probada. Después, 301 a `/quantum`.

## Precios

Todo en ARS salvo la mentoría (USD). Hoy no coinciden: Woo cobra ARS 23.499 por programa y el funnel de Conecta mostraba 15 USD. Los define la clienta antes de lanzar.

## Orden de construcción

1. ✅ Repo, build singlefile, sistema de diseño compartido.
2. ✅ Home.
3. ✅ Rediseño (ver abajo): páginas de Carola + Conecta, Quantum y Fénix con marca propia. Quantum y Fénix con copy placeholder (`TODO(clienta)` en el HTML).
4. Prueba técnica en GHL (cuando haya acceso) → `docs/GHL.md`.

## Pendientes de la clienta

- Dominio `carolagando.coach`.
- Precios en ARS de cada producto.
- Fotos reales en alta resolución (hoy solo hay un recorte de 497×785 px).
- Copy de Quantum y Fénix; testimonios escritos (frase corta de cada uno).
- Confirmar que Salto Cuántico puede ser gratis de forma permanente.
- Habilitar `carolagando.coach` en Vimeo → Privacidad → "Dónde se puede insertar" (los videos de testimonios hoy solo se ven en `quantumprograma.com`).

## Rediseño: Carola exclusiva + programas independientes (decidido e implementado 20-10-2026)

Pedido: el sitio de Carola es solo de ella. Conecta, Quantum y Fénix funcionan casi como sitios independientes, con marca propia, bajo el mismo dominio. Reemplaza los pasos 3 a 5 de "Orden de construcción".

### Sitio de Carola: páginas separadas

| Ruta | Contenido |
|---|---|
| `/` Inicio | Hero, números, las 3 tarjetas de programas (debajo de los números, con menos peso que el CTA de aplicar), resumen de mentorías con link, testimonios |
| `/sobre-mi` | Historia, formación y reconocimientos, escenarios, cinta de países |
| `/mentorias` | 3 formatos: 1:1, grupal y empresas/charlas. Para quién, qué incluye, proceso en 3 pasos, testimonios, FAQ, formulario de aplicación |
| `/contacto` | Formulario corto (nombre, email, mensaje) + Instagram + email |

- Nav: Inicio · Sobre mí · Mentorías · Contacto · [Aplicar]. Sin links a los programas en la nav (solo en las tarjetas de Inicio y, como secundario, en el footer).
- Aplicación: suma el campo "Formato" (1:1 / grupal / empresas). Tag `interes:mentoria-1a1|mentoria-grupal|empresas`. Si elige empresas, aparece el campo "Empresa".
- Contacto: webhook nuevo `contact` en `src/shared/js/config.js`, tag `interes:contacto`, workflow de GHL "Contacto general". No entra al pipeline Mentoría.

### Programas con marca propia

- Nav, logo y footer propios por programa. Comparten solo tokens, `base.css`, `components.css`, `forms.js` y `ui.js`.
- Firma "Un programa de Carola Gando" con link a `/` y una mención a la mentoría (link a `/mentorias`).
- Actualizar `docs/DESIGN.md`: se elimina la regla "una sola marca en las 4 páginas".

### Impacto técnico

- `vite.config.js`: `PAGES` suma `sobre-mi`, `mentorias`, `contacto`.
- Partials: los actuales `nav` y `footer` pasan a ser de Carola; se crean los de cada programa (o un partial parametrizado por marca).
- GHL: 7 páginas de custom code en vez de 4. Actualizar `docs/GHL.md`.
- `data-hero` y sticky CTA definidos por página.

### Orden

1. Base compartida: partials por marca y páginas nuevas en `PAGES`.
2. Carola: `/` → `/sobre-mi` → `/mentorias` → `/contacto`.
3. Conecta, Quantum, Fénix con marca propia.
4. `docs/DESIGN.md` y `docs/GHL.md`.

### Pendientes de la clienta (nuevos)

- Mentoría grupal: duración, cupos, frecuencia.
- Empresas/charlas: qué ofrece y en qué formatos; si pasa por llamada como la 1:1.
- Pipeline aparte para empresas o el mismo de Mentoría.
