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
- Escala contenida en `--fs-*` (fluida con `clamp`). Heros con `--fs-hero` (máx. 68px), cierres con `--fs-3xl`.
- Formularios: label 13px en `--ink-2`, campos de 48px con texto de 16px (menos hace zoom en iOS).
- Excepción de Fénix: su logo usa una condensada para "FENIX". Se recrea con **Bebas Neue** (solo en `/fenix`, cargada en su `<head>`) para el lockup del hero, el wordmark, las palabras fantasma (FUEGO, CENIZAS, RENACER), la cinta y los números. "MENTALIDAD DE" va en Poppins 300 en mayúsculas, como en el logo. El dorado es un degradé de texto (`--gold`) con un reflejo que lo cruza.

## Material de Fénix

Del paquete de la marca (logos, fondos, flyers) y de las fotos y videos del retiro:

- `fenix-isotipo.webp` (dorado, 572×640) y `fenix-isotipo-sm.webp` (nav, footer, íconos). Es el mismo isotipo de Carola (`logo-cg.png`) en su versión dorada.
- `fenix-fuego*.webp`: recortes sin texto de la historia de Instagram (hero, lista de espera, tarjeta de Inicio). `fenix-humo.webp`: humo bordó del banner de la marca (sección El retiro).
- Fotos del retiro (`fenix-<escena>.webp`, 960×1280): en `/fenix` (El retiro, galería) y en `/sobre-mi` ("Así se viven mis retiros").
- Testimonios en video (`fenix-testimonio-<n>.mp4`, 720p, ~3,7 MB, sin la charla previa) con poster `.webp`. Se cargan al hacer clic (`data-video`, ver `ui.js`). En GHL subirlos a la galería de medios y mapearlos en `images.json` como las imágenes.

## Forma

- Botones: pill (`--r-pill`).
- Tarjetas: `--r-card` 20px. Bloques grandes: `--r-media` 28px.
- Campos: `--r-field` 12px.

## Espaciado

Base 4px: `--s-1` (4) … `--s-10` (128). Secciones con `--section-y`.

## Disposición

- Heros de páginas internas y programas **centrados en ambos ejes** (`.page-hero`, `.c-hero`, `.q-hero`, `.f-hero`). Solo Inicio mantiene hero en dos columnas con la foto. Sin imágenes en esos heros: la foto de Sobre mí va en Historia y el mockup de Quantum en El paquete.
- Títulos de sección centrados con `.section-head` (título + bajada). Las secciones partidas (formularios, Formación, Para quién) quedan en dos columnas.
- Preguntas frecuentes en una columna centrada.
- Orden de los programas: problema, experiencia/prueba, oferta, recurso gratis, quién guía, preguntas, cierre. La nav lista las secciones en ese orden y resalta la visible.

## Movimiento

- Entrada del hero (sube y se enfoca: `cg-fade` con blur) y humo con deriva lenta.
- Tarjetas con `data-glow`: luz que sigue al puntero (solo mouse) y elevación con `translate` (no `transform`, que lo usa el reveal).
- Dolores de Conecta: entrada escalonada con escala, barra degradé que se dibuja en la base y número fantasma que gira en hover.
- Números de Inicio cuentan hasta su valor al entrar (`data-count`).
- FAQ abre con transición de altura donde el navegador lo soporta (`::details-content`).
- Una sola cinta en movimiento por página (`.marquee`: países en Sobre mí, palabras en Conecta).
- Aparición al scroll con `data-reveal` (IntersectionObserver, nunca listeners de scroll). Escalonado con `style="--d: n"`.
- Hover en botones (relleno que sube) y tarjetas.
- Todo se desactiva con `prefers-reduced-motion`.

## Reglas

- Sin guiones largos en el copy.
- Máximo 1 eyebrow cada 3 secciones.
- Un solo label por intención de CTA (la aplicación siempre es "Aplicar a la mentoría"; en la nav, "Aplicar"; elegir formato en `/mentorias`, "Elegir este formato").
- La nav siempre tiene fondo (vidrio oscuro) y queda fija arriba. `data-hero` solo controla el CTA fijo en mobile (`sticky-cta` + `data-sticky-hide` donde se oculta). `/contacto` no lleva CTA fijo.
- Labels arriba del input, error abajo, nunca placeholder como label.
- Todo el CSS va bajo `.cg-page` (lo hace el build): no usar selectores globales fuera de eso.
