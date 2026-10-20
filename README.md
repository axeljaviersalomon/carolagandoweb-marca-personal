# carolagando.coach

Web de marca personal de Carola Gando. Cuatro páginas (`/`, `/conecta`, `/quantum`, `/fenix`) que se publican en GoHighLevel como bloques de código.

- Vista previa: https://axeljaviersalomon.github.io/carolagandoweb-marca-personal/ (se publica sola en cada push a `main`)
- Plan y decisiones: [`docs/PLAN.md`](docs/PLAN.md)
- Publicar en GHL y configurar workflows: [`docs/GHL.md`](docs/GHL.md)
- Sistema de diseño: [`docs/DESIGN.md`](docs/DESIGN.md)

## Uso

```bash
npm install
npm run dev        # http://localhost:5173 (rutas / /conecta /quantum /fenix)
npm run build      # dist/ghl/<pagina>.html para pegar en GHL
npm run preview    # sirve el build completo en http://localhost:4173
```

## Estructura

```
src/
  shared/
    partials/   nav, footer, formulario de aplicación, CTA fijo (<!-- @include nombre {...} -->)
    styles/     tokens, base, componentes
    js/         config (webhooks GHL), formularios, UI
  pages/
    home/       index.html + home.css + home.js
public/img/     imágenes (en GHL se reemplazan por las URLs de images.json)
scripts/        build por página (singlefile) y plugins de Vite
```

Sin framework: HTML, CSS y JS planos. Vite junta todo en un HTML por página.
