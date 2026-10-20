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
| Fénix | `#0f0705` | brasa `#d2401c` / `#ff9a5a` | Nueva (fuego, fénix) |

Neutros de Carola: superficies `#141128` / `#1c1735`, texto `#f4f1fa`, secundario `#cfc8de`, apagado `#9a92ad` (AA sobre el fondo). Cada programa define los suyos en su CSS.

## Tipografía

- **Poppins** (la de su marca) en todo: titulares 500-600 con tracking negativo, texto 300-400.
- Mayúsculas solo en momentos de firma ("Tu momento es ahora", eyebrows), como en su web.
- Escala en `--fs-*` (fluida con `clamp`).

## Forma

- Botones: pill (`--r-pill`).
- Tarjetas: `--r-card` 24px. Bloques grandes: `--r-media` 32px.
- Campos: `--r-field` 14px.

## Espaciado

Base 4px: `--s-1` (4) … `--s-10` (128). Secciones con `--section-y`.

## Movimiento

- Entrada del hero (líneas que suben, foto que aparece) y humo con deriva lenta.
- Una sola cinta en movimiento por página (`.marquee`: países en Sobre mí, palabras en Conecta).
- Aparición al scroll con `data-reveal` (IntersectionObserver, nunca listeners de scroll). Escalonado con `style="--d: n"`.
- Hover en botones (relleno que sube) y tarjetas.
- Todo se desactiva con `prefers-reduced-motion`.

## Reglas

- Sin guiones largos en el copy.
- Máximo 1 eyebrow cada 3 secciones.
- Un solo label por intención de CTA (la aplicación siempre es "Aplicar a la mentoría"; en la nav, "Aplicar"; elegir formato en `/mentorias`, "Elegir este formato").
- Cada página define su `data-hero` (nav transparente encima) y su CTA fijo en mobile (`sticky-cta` + `data-sticky-hide` donde se oculta). `/contacto` no lleva CTA fijo.
- Labels arriba del input, error abajo, nunca placeholder como label.
- Todo el CSS va bajo `.cg-page` (lo hace el build): no usar selectores globales fuera de eso.
