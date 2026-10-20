# Sistema de diseño

Tokens en `src/shared/styles/tokens.css` (fuente de verdad). Este archivo explica las reglas.

## Dirección

Estética de la marca de Carola, tomada de su Instagram (@carolagandocoach, destacados) y de quantumprograma.com: fondo casi negro, humo violeta y magenta, Poppins, botones violeta con brillo. El sitio es **solo oscuro** (es parte de la identidad). Una sola marca en las 4 páginas: nav, footer, tipografía y forma son comunes. Cada página cambia **solo el acento** y su imagen principal.

Material reutilizado del WordPress (`Quantum Programa/public_html.zip`): foto de Carola con sus reflejos (`carola-ecos.webp`), fondos de humo (`humo-*.webp`), isotipo (`logo-cg.png`, `logo-cg-silver.webp`), mockup de Abundancia Infinita. Bio y trayectoria copiadas de quantumprograma.com.

## Color

| Página | Acento | Origen |
|---|---|---|
| Home | violeta `#8a2be2`, destacado `#c9a3ff`, magenta `#e0218a` solo en humo y brillos | Marca de Carola / Quantum |
| Conecta | turquesa `#5dc5c2` sobre azul noche `#050d24` | Marca existente de Conecta |
| Quantum | violeta `#2b1060` + amarillo `#ffd84d` | Marca existente de Quantum |
| Fénix | brasa `#d2401c` / `#ff8a3d` | Nueva (fuego, fénix) |

Neutros: fondo `#090915` (el mismo de quantumprograma.com), superficies `#141128` / `#1c1735`, texto `#f4f1fa`, secundario `#cfc8de`, apagado `#9a92ad` (AA sobre el fondo).

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
- Una sola cinta en movimiento por página (países en la Home).
- Aparición al scroll con `data-reveal` (IntersectionObserver, nunca listeners de scroll). Escalonado con `style="--d: n"`.
- Hover en botones (relleno que sube) y tarjetas.
- Todo se desactiva con `prefers-reduced-motion`.

## Reglas

- Sin guiones largos en el copy.
- Máximo 1 eyebrow cada 3 secciones.
- Un solo label por intención de CTA (la aplicación siempre es "Aplicar a la mentoría"; en la nav, "Aplicar").
- Labels arriba del input, error abajo, nunca placeholder como label.
- Todo el CSS va bajo `.cg-page` (lo hace el build): no usar selectores globales fuera de eso.
