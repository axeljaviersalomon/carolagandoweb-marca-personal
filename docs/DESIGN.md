# Sistema de diseño

Tokens en `src/shared/styles/tokens.css` (fuente de verdad). Este archivo explica las reglas.

## Dirección

Marca personal de una coach de transformación. Editorial, cálida y con energía. Una sola marca (Carola) en las 4 páginas: nav, footer, tipografía y forma son comunes. Cada página cambia **solo el acento** y su imagen principal.

## Color

| Página | Acento claro | Acento oscuro | Origen |
|---|---|---|---|
| Home | `#b0204f` rosa profundo | `#ee5f8b` | Identidad de Carola |
| Conecta | turquesa `#5dc5c2` sobre azul noche `#050d24` | igual | Marca existente de Conecta |
| Quantum | violeta `#2b1060` + amarillo `#ffd84d` | igual | Marca existente de Quantum |
| Fénix | brasa `#d2401c` / `#ff8a3d` | igual | Nueva (fuego, fénix) |

Neutros: fondo `#f3f2ee`, tinta `#17151a`, texto secundario `#66626b` (contraste AA sobre el fondo). Modo oscuro automático con `prefers-color-scheme`.

## Tipografía

- Display: **Bricolage Grotesque** (variable: `wdth` 75-100, `opsz`), 650-760, tracking negativo, `font-stretch` 84-90% en titulares grandes.
- Texto: **Geist** 400-600.
- Escala en `--fs-*` (fluida con `clamp`).

## Forma

- Botones: pill (`--r-pill`).
- Tarjetas: `--r-card` 28px. Bloques grandes e imágenes: `--r-media` 36px.
- Campos: `--r-field` 14px.
- El hero usa un arco (`999px 999px 36px 36px`) como firma visual.

## Espaciado

Base 4px: `--s-1` (4) … `--s-10` (128). Secciones con `--section-y`.

## Movimiento

- Entrada del hero (líneas que suben, arco que se revela).
- Aparición al scroll con `data-reveal` (IntersectionObserver, nunca listeners de scroll). Escalonado con `style="--d: n"`.
- Hover en botones (relleno que sube) y tarjetas.
- Todo se desactiva con `prefers-reduced-motion`.

## Reglas

- Sin guiones largos en el copy.
- Máximo 1 eyebrow cada 3 secciones.
- Un solo label por intención de CTA (la aplicación siempre es "Aplicar a la mentoría"; en la nav, "Aplicar").
- Labels arriba del input, error abajo, nunca placeholder como label.
- Todo el CSS va bajo `.cg-page` (lo hace el build): no usar selectores globales fuera de eso.
