# Sistema de diseño

Tokens en `src/shared/styles/tokens.css` (fuente de verdad). Este archivo explica las reglas.

## Dirección

Estética de la marca de Carola, tomada de su Instagram (@carolagandocoach, destacados) y de quantumprograma.com: fondo casi negro, humo violeta y magenta, Poppins, botones violeta con brillo. El sitio es **solo oscuro** (es parte de la identidad).

## Marcas

Hay **cuatro marcas** bajo el mismo dominio:

- **Carola** (`/`, `/sobre-mi`, `/mentorias`, `/contacto`): nav, footer e isotipo de Carola. Piezas comunes en `src/shared/styles/carola.css` y `src/shared/partials/carola/`.
- **Conecta, Quantum y Fénix**: cada uno con nav, wordmark tipográfico y footer propios (`src/shared/partials/<programa>/`). Redefinen los tokens de color en su CSS. Llevan la firma "Un programa de Carola Gando" (`partials/program-signature.html`) con link a `/` y a `/mentorias`.

Todas comparten solo `tokens.css` (tipografía, forma, espaciado, movimiento), `base.css`, `components.css`, `forms.js` y `ui.js`. Carola no linkea a los programas desde la nav: solo desde las tarjetas de Inicio y, como secundario, desde el footer.

Material reutilizado del WordPress (`Quantum Programa/public_html.zip`): foto de Carola con sus reflejos (`carola-ecos.webp`), fondos de humo (`humo-*.webp`), isotipo (`logo-cg.png`, `logo-cg-silver.webp`), mockup de Abundancia Infinita. Retrato recortado (`carola-retrato.webp`, 497×785) del funnel de Conecta. Bio y trayectoria copiadas de quantumprograma.com.

## Color

| Marca | Fondo | Acento | Origen |
|---|---|---|---|
| Carola | `#090915` | violeta `#8a2be2`, destacado `#c9a3ff`, magenta `#e0218a` solo en humo y brillos | Marca de Carola |
| Conecta | azul noche `#000816` | turquesa `#5dc5c2` / `#8fe0dd`, azul `#5381ff` | Marca existente de Conecta |
| Quantum | `#0b0618` | amarillo `#ffd84d` sobre violeta `#2b1060` | Marca existente de Quantum |
| Fénix | bordó casi negro `#12040b` | oro `#e8c26a` / `#f2d58c` (degradé del logo) sobre bordó `#5e0f30`, fuego `#e2552a` y chispa rosa `#ff6ad5` solo en detalles | Marca existente de Mentalidad de Fénix (@mentalidadefenix_) |

Neutros de Carola: superficies `#141128` / `#1c1735`, texto `#f4f1fa`, secundario `#cfc8de`, apagado `#9a92ad` (AA sobre el fondo). Cada programa define los suyos en su CSS.

## Tipografía

- **Poppins** (la de su marca) en todo: titulares en 500 con tracking negativo, la palabra destacada (`.accent`) en 300; texto en 300-400. Nada en 600-700: la jerarquía sale del peso y del aire, no del grosor.
- Mayúsculas solo en momentos de firma ("Tu momento es ahora", eyebrows), como en su web.
- Escala `--fs-*` fluida con `clamp`, con saltos que se distinguen a simple vista (375 → 1440 px):

  | Token | Tamaño | Uso |
  |---|---|---|
  | `--fs-xs` | 14 | Etiquetas en mayúsculas: eyebrows, kickers, `.label`, tags de formato |
  | `--fs-sm` | 15-16 | Texto secundario: ítems de listas, notas, labels de formularios |
  | `--fs-base` | 16-17 | Cuerpo |
  | `--fs-lg` | 18-21 | Bajadas (`.lead`), citas, preguntas de FAQ |
  | `--fs-xl` | 22-30 | h3 de listas y módulos |
  | `--fs-title` | 28-44 | Títulos de tarjeta protagonistas (formatos de mentoría, ofertas, escenarios) |
  | `--fs-2xl` | 32-56 | h2 |
  | `--fs-3xl` | 40-72 | Cierres y titulares de sección grandes |
  | `--fs-hero` | 39-88 | h1 de heros internos y de programas |

  Nada por debajo de 14px. Excepciones: el título de Inicio va a escala de cartel (hasta 8rem) y los nombres de los programas en sus portales hasta 4.5rem.
- Formularios: label en `--fs-sm` y `--ink-2`, campos de 48px con texto de 16px (menos hace zoom en iOS).
- Excepción de Fénix: su logo usa una condensada para "FENIX". Se recrea con **Bebas Neue** (solo en `/fenix`, cargada en su `<head>`) para el lockup del hero, el wordmark, las palabras fantasma (FUEGO, CENIZAS, RENACER), la cinta y los números. "MENTALIDAD DE" va en Poppins 300 en mayúsculas, como en el logo. El dorado es un degradé de texto (`--gold`) con un reflejo que lo cruza.

## Material de Fénix

Del paquete de la marca (logos, fondos, flyers) y de las fotos y videos del retiro:

- `fenix-isotipo.webp` (dorado, 572×640) y `fenix-isotipo-sm.webp` (nav, footer, íconos). Es el mismo isotipo de Carola (`logo-cg.png`) en su versión dorada.
- `fenix-fuego*.webp`: recortes sin texto de la historia de Instagram (hero, lista de espera, tarjeta de Inicio). `fenix-humo.webp`: humo bordó del banner de la marca (sección El retiro).
- Fotos del retiro (`fenix-<escena>.webp`, 960×1280): en `/fenix` (El retiro, galería), en `/sobre-mi` ("Así se viven mis retiros": ronda, venda, charla, abrazo) y en Inicio ("Así se vive el cambio": celebración, guía, manos, sala, meditación; sin repetir las de Sobre mí).
- Testimonios en video (`fenix-testimonio-<n>.mp4`, 720p, ~3,7 MB, sin la charla previa) con poster `.webp`. Se cargan al hacer clic (`data-video`, ver `ui.js`). En GHL subirlos a la galería de medios y mapearlos en `images.json` como las imágenes. Inicio usa estos (tienen cara y frase): los de Vimeo no tienen miniatura pública porque el embed está restringido por dominio.

## Forma

- Botones: pill (`--r-pill`).
- Tarjetas: `--r-card` 20px. Bloques grandes: `--r-media` 28px.
- Campos: `--r-field` 12px.

## Espaciado

Base 4px: `--s-1` (4) … `--s-10` (128). Secciones con `--section-y`.

## Disposición

- Heros de páginas internas y programas **centrados en ambos ejes** (`.page-hero`, `.c-hero`, `.q-hero`, `.f-hero`). Sin imágenes en esos heros: la foto de Sobre mí va en Historia y el mockup de Quantum en El paquete.
- Inicio es la excepción: hero a pantalla completa, alineado a la izquierda y arriba (sin centrado vertical: el texto arranca cerca de la nav, la bajada en 2 renglones), con el título grande cruzándose con la foto de Carola anclada abajo a la derecha (fundida por izquierda, arriba y abajo). En mobile la foto va debajo del texto.
- Orden de Inicio: hero, prueba (tira de fotos reales + números grandes sin tarjeta), mentorías (la oferta principal va antes que los programas: panel con el título arriba y los tres formatos en columnas, etiqueta chica y nombre en `--fs-title`), programas como portales que se apilan (`position: sticky`, cada uno con su paleta), testimonios con cara (el primero grande, los otros dos apilados), cierre.
- Títulos de sección centrados con `.section-head` (título + bajada). Las secciones partidas (formularios, Formación, Para quién) quedan en dos columnas.
- Preguntas frecuentes en una columna centrada.
- Orden de los programas: problema, experiencia/prueba, oferta, recurso gratis, quién guía, preguntas, cierre. La nav lista las secciones en ese orden y resalta la visible.

## Movimiento

- Entrada del hero (sube y se enfoca: `cg-fade` con blur) y humo con deriva lenta.
- Tarjetas con `data-glow`: luz que sigue al puntero (solo mouse) y elevación con `translate` (no `transform`, que lo usa el reveal).
- Dolores de Conecta: entrada escalonada con escala, barra degradé que se dibuja en la base y número fantasma que gira en hover.
- Números de Inicio cuentan hasta su valor al entrar (`data-count`).
- Hero de Inicio ligado al scroll, solo CSS (`view-timeline: --hero` + `animation-range: exit`): el texto sube y se desvanece, la foto se hunde en el humo. Solo desktop, dentro de `@supports (animation-timeline: view())`; sin soporte queda quieto.
- Grano fino (SVG `feTurbulence`, 7%, `overlay`) sobre el humo del hero y del cierre de Inicio.
- **Transición entre páginas** (las 7, en `components.css` y `ui.js`): fundido a negro y vuelta.
  - Salida: `initPageTransitions` intercepta los clics a links internos de otra página, baja una cortina negra (`.page-veil`, 0,4 s) y recién ahí navega. Corre en todos los navegadores: la `@view-transition` nativa se cancela si el CSS de la página nueva llega tarde (en GHL el fragmento se inyecta al final del Footer Tracking). Seguridad: si la navegación no ocurre en 4 s la cortina se levanta, y al volver con Atrás (bfcache) también.
  - Con soporte (Chrome, Edge, Safari) además corre `@view-transition { navigation: auto; }` con keyframes propios: `::view-transition-old(root)` queda arriba y se funde sobre el negro de la nueva, sin destello.
  - Entrada: `:root::after` (→ `.cg-page::after`) es una cortina negra fija que se levanta sola con `cg-curtain-up` en cuanto el contenido se pinta. Es CSS puro: no depende del JS ni de que el fragmento llegue a tiempo, y como termina en `opacity: 0` nunca deja la pantalla en negro.
  - En GHL, para que no se vea el fondo de GHL antes del fragmento, poner el fondo de la página en `#090915` en el builder.
  - `vite.config.js` deja los selectores `::view-transition*` sin el prefijo `.cg-page` (viven en el documento).
- **Barra de progreso de lectura**: vertical, 3px, pegada al borde izquierdo (`.scroll-progress`, la crea `ui.js`). Se llena de arriba hacia abajo según el scroll, con brillo (`box-shadow` en capas) en el `--accent` de cada marca: violeta, turquesa, amarillo, oro. CSS con `animation-timeline: scroll(root block)` dentro de `@supports`; sin soporte, `ui.js` escribe `--progress` con `requestAnimationFrame` (único listener de scroll del sitio).
- **Volver arriba** (`.to-top`, lo crea `ui.js`): botón redondo de 48px abajo a la derecha, con `aria-label="Volver arriba"` y foco visible. Aparece cuando el hero sale de pantalla (IntersectionObserver) y, en mobile, sube por encima del CTA fijo cuando este está visible (`:has(.sticky-cta.is-visible)`). Scroll suave salvo con movimiento reducido.
- FAQ abre con transición de altura donde el navegador lo soporta (`::details-content`).
- Una sola cinta en movimiento por página, solo en los programas (`.marquee`: palabras en Conecta, `.f-marquee` en Fénix). Las páginas de Carola no llevan.
- Aparición al scroll con `data-reveal` (IntersectionObserver, nunca listeners de scroll). Escalonado con `style="--d: n"`.
- Hover en botones (relleno que sube) y tarjetas.
- Todo se desactiva con `prefers-reduced-motion` (también la transición entre páginas).

## Reglas

- Sin guiones largos en el copy.
- **Cortes de línea** (revisar en 375, 768 y 1440):
  - Títulos, preguntas de FAQ, botones y textos cortos de 2 a 4 líneas (bajadas, citas, ítems de listas cortas) en `text-wrap: balance`. Texto corrido (`p`, `li`, `dt`, `dd`, `a`…) en `pretty` (base.css).
  - El build une solo con `&nbsp;` (plugin `glueShortWords` en `scripts/vite-plugins.js`): "y, a, o, e, u, de, la, un" con la palabra siguiente, y un número con la palabra que sigue (`12&nbsp;años`). No hace falta escribirlos a mano.
  - A mano, `&nbsp;` donde el corte igual queda feo: nombres propios (`Carola&nbsp;Gando`), otras preposiciones (`por&nbsp;edición`) y las dos últimas palabras de un título que deja una sola abajo (`decidieron&nbsp;cambiar`), siempre que entren juntas en 375.
  - Palabras con guion (`e-book`) en `<span class="nowrap">`.
  - Emails con `<wbr />` antes de la `@` y sin `overflow-wrap: anywhere`: si entran van en una línea; si no, cortan en la `@`.
  - Medidas en `ch` generosas: un `max-width` chico con `balance` parte textos que entraban en una línea. Referencia: h1 20-22ch, h2 22ch, bajadas 54-60ch.
  - **Aire para la tinta** (`--ink-room: 0.25em`): todo texto que puede recortarse (dentro de `overflow: hidden` o con `background-clip: text` e interlineado menor a 1.3) lleva `padding-block: var(--ink-room)` compensado con `margin-block` negativo. Es proporcional a la letra y no mueve el layout. Hoy: `.hero__line` (Inicio) y `.f-gold` (Fénix).
  - Verificación: con el dev server andando, `npm run check:text` (`scripts/check-text.mjs`, Playwright) recorre las 7 páginas en 375, 768 y 1440 y marca palabras cortadas, viudas de una palabra, renglones que terminan en "y/a/de/la/un", texto recortado y scroll horizontal. `-- --verbose` lista los renglones de cada texto. Tiene que dar 0.
- Máximo 1 eyebrow cada 3 secciones.
- Un solo label por intención de CTA (la aplicación siempre es "Aplicar a la mentoría"; en la nav, "Aplicar"; elegir formato en `/mentorias`, "Elegir este formato").
- La nav siempre tiene fondo (vidrio oscuro) y queda fija arriba. `data-hero` solo controla el CTA fijo en mobile (`sticky-cta` + `data-sticky-hide` donde se oculta). `/contacto` no lleva CTA fijo.
- Labels arriba del input, error abajo, nunca placeholder como label.
- Todo el CSS va bajo `.cg-page` (lo hace el build): no usar selectores globales fuera de eso.
