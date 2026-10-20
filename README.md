# carolagando.coach

Web de marca personal de Carola Gando. Siete páginas que se publican en GoHighLevel como bloques de código: las de Carola (`/`, `/sobre-mi`, `/mentorias`, `/contacto`) y las de sus programas, cada uno con marca propia (`/conecta`, `/quantum`, `/fenix`).

- Vista previa: https://axeljaviersalomon.github.io/carolagandoweb-marca-personal/ (se publica sola en cada push a `main`)
- Plan y decisiones: [`docs/PLAN.md`](docs/PLAN.md)
- Publicar en GHL y configurar workflows: [`docs/GHL.md`](docs/GHL.md)
- Sistema de diseño: [`docs/DESIGN.md`](docs/DESIGN.md)

## Uso

```bash
npm install
npm run dev        # http://localhost:5173 (rutas de producción: /, /mentorias, /conecta, ...)
npm run build      # dist/ghl/<pagina>.html para pegar en GHL
npm run preview    # sirve el build completo en http://localhost:4173
```

## Estructura

```
src/
  shared/
    partials/   carola/, conecta/, quantum/, fenix/ (nav y footer de cada marca), formularios,
                firma de programas, CTA fijo (<!-- @include carpeta/nombre {...} -->)
    styles/     tokens, base, componentes, carola (piezas de las páginas de Carola)
    js/         config (webhooks GHL), formularios, UI
  pages/
    <pagina>/   index.html + <pagina>.css + <pagina>.js (home, sobre-mi, mentorias, contacto,
                conecta, quantum, fenix)
public/img/     imágenes (en GHL se reemplazan por las URLs de images.json)
scripts/        build por página (singlefile) y plugins de Vite
```

Sin framework: HTML, CSS y JS planos. Vite junta todo en un HTML por página.
