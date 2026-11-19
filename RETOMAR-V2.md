# Retomar la v2 (rama feat/v2)

Estado al 19-nov-2026: home v2 completa en `/lab/v2` (commit 1fd40e3). Aprobada por el usuario.

## Cómo arrancar
- Worktree: `~/Desktop/Ortoptika-v2` (rama `feat/v2`). NO tocar `~/Desktop/Ortoptika` (otra sesión, ojo 3D en `feat/ojo-3d`, puerto 3311).
- Dev: `pnpm exec next dev -p 3312` → http://localhost:3312/lab/v2/
- Capturas: Playwright propio desde `~/.claude/skills/captura-web/node_modules` (el MCP lo usa la otra sesión). Revisar 1440×900 y 390×844.
- Antes de cerrar: `pnpm lint` y `pnpm build`.

## Sistema v2 (respetar en las páginas nuevas)
- Tipos: Instrument Serif (titulares, `--font-v2-serif`, cursiva para el énfasis) + Inter Tight (`--font-v2-sans`). Se cargan en `src/app/lab/v2/page.tsx`; al mover a producción, pasarlas a un layout.
- Paleta: navy #02223b, azul #0e4d7a, lima #a8cf45, crema #f6f2ea; textos #33506a / #4d6880 / #b9c9d6.
- Etiqueta de sección: 11px, mayúsculas, tracking 0.22em. Titulares en clamp grande, leading 0.95.
- Reveals con `src/components/v2/Aparece.tsx`. Scroll con rAF + sticky (ver HeroV2 / DosOjos), sin GSAP.
- Cursor NATIVO (aprobado). La v1 pone `cursor:none`: ver el `<style>` de lab/v2/page.tsx.
- Ojos en globals v1: h1/h2 en navy llevan color de slate → poner `text-white` explícito.
- 3D: `OjoModelo` + `OjoEstudio` de `components/three/OjoEscena.tsx` con `pose`/`mirar`; canvas con `frameloop` según IntersectionObserver.

## Siguiente: resto de páginas al mismo nivel
1. Landings `src/app/servicios/[slug]` (5): mismo copy/SEO de `services-content.ts` y JSON-LD; una pieza del ojo por servicio; índice lateral fijo.
2. `sobre-mi`, `contacto`, `blog`, `privacidad`, `not-found`.
3. Header/footer v2 globales y llevar la home de `/lab/v2` a `/`.
4. **Fotos con pacientes: AUTORIZADAS por el usuario (19-nov)** → se pueden usar `doctora-consulta`, `sesion-secuencias`, `sesion-vasos`, `sinoptoforo` (en `public/images/fotos`). Sumarlas también al Consultorio de la home.

## Pendientes abiertos
- Copy nuevo = borrador; validar con la doctora.
- Conflictos esperados en `OjoEscena.tsx` al integrar `feat/ojo-3d`.
- Faltan músculos extraoculares y retina en el modelo.
