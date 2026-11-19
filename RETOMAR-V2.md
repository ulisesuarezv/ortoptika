# Retomar la v2 (rama feat/v2)

Estado al 19-nov-2026: home v2 completa y aprobada en `/lab/v2`. Lint y build en verde. `/lab/ojo` (página de la otra sesión) sigue funcionando con los cambios de `OjoEscena.tsx`.

`feat/ojo-3d` NO avanzó después de 2726687 (punto de partida de esta rama) y no tiene cambios sin guardar: `feat/v2` ya contiene todo el trabajo del ojo, no hay nada que integrar. Si alguien vuelve a tocar el ojo, que lo haga **sobre `feat/v2`** para evitar conflictos.

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

## Hecho el 19-nov (tarde): landings de servicio v2
- `/lab/v2/servicios/[slug]` (5) con `src/components/v2/servicio/LandingV2.tsx`: mismo copy y orden de `services-content.ts`, índice lateral fijo (`Indice.tsx`), foto de `SERVICE_PHOTOS`, otros servicios y cierre navy con `Pie` (extraído de Secciones).
- Pieza del ojo por servicio (`OjoServicio.tsx`): estrabismo se desvía y vuelve; ambliopía sigue al cursor con retraso; terapia visual recorre un ocho; visión binocular = los dos ojos convergiendo (DosOjosEscena); pediátrica sigue al cursor con pupila grande.
- Fuentes v2 y el `<style>` que oculta la cabecera v1 pasaron a `src/app/lab/v2/layout.tsx`.
- Enlaces internos de la v2 con `src/components/v2/rutas.ts` (`BASE = "/lab/v2"`; al publicar, `BASE = ""`).
- Al publicar: en `src/app/servicios/[slug]/page.tsx` cambiar `ServiceLanding` por `LandingV2` (metadata y JSON-LD se quedan igual).

## Siguiente: resto de páginas al mismo nivel
1. Landings de servicio: el usuario dijo "se ve bien" (19-nov), **pero el ojo 3D ya está sobreusado** (hero, dos ojos y ahora las 5 landings). **Primera tarea de la próxima sesión:** proponer ideas visuales que NO sean el ojo, en un tablero, antes de construir nada. Puntos de partida:
   - Pruebas reales del consultorio como interacción: Lang/estereograma (profundidad), cartilla que se desenfoca (acomodación), regla de convergencia o cordón de Brock, filtros rojo-verde.
   - "Ver como tu hijo ve": simular visión doble o un ojo borroso sobre una foto del consultorio.
   - Tipografía o diagramas como protagonistas (lámina técnica 2D, trazos de mirada) y más fotos reales.
   - Dejar el ojo 3D SOLO en la home y, como mucho, en un servicio.
2. `sobre-mi`, `contacto`, `blog`, `privacidad`, `not-found`.
3. Header/footer v2 globales y llevar la home de `/lab/v2` a `/`.
4. **Fotos con pacientes: AUTORIZADAS por el usuario (19-nov).** Ya están en el Consultorio de la home (sinoptóforo + 3 verticales). Usar `PHOTOS` de `src/lib/photos.ts` (alt, tamaños, versión -sm) y el componente `Foto` de `Secciones.tsx` (`<picture>`).

## Hecho el 19-nov (sesión 2): estrabismo sin el ojo
- Tablero de piezas sin ojo: `~/Desktop/KayaoCC/docs/ortoptika-v2/tablero-sin-ojo/`. El usuario eligió empezar por la 01 (cordón de Brock) y pidió **mantener el nivel de la home: usar más modelos 3D, no diagramas planos**.
- `src/components/v2/servicio/BrockEscena.tsx`: cordón de Brock 3D procedural (cuentas lacadas, luz de `OjoEstudio`, sombra de contacto); el OD se va hacia adentro y aparece la cuenta doble; hover sobre una cuenta la fija; encuadre automático por proporción; etiquetas en DOM proyectadas (NO usar `Html` de drei: da "synchronously unmount a root").
- Copy validado por la doctora (doc 4 completo): no tocarlo.
- (misma sesión) Ojos 3D reales (OjoModelo, R 0.4) en lugar de puntos: la escena se gira 180° para que miren a la luz y a la cámara (`mundo()` convierte puntos). Hero: ciclo solo naranja/verde (la azul saca la cuenta doble del cuadro).
- `BrockRecorrido.tsx`: sección navy sticky de 460svh tras el hero (solo estrabismo), mismo patrón que DosOjos de la home; 4 pasos + recuadro «Lo que se ve» (la X del cordón). La escena en modo "scroll" lee `brockScroll.p` y la cámara viaja entre `PLANOS`. **Copy de los pasos = borrador para la doctora** (ver PENDIENTES).
- Estado de las escenas en refs propias + registro `ETIQUETAS` por `useId` (el React Compiler no deja mutar objetos que llegan por props).
- Rendimiento (19-nov): todo lienzo 3D va por `src/components/three/Lienzo.tsx` (resolución adaptativa con PerformanceMonitor: dpr 2 y solo baja si ese equipo no da; respaldo `public/3d/respaldo/*.webp` si no hay WebGL). **Regla: una sola escena 3D dibujando a la vez** — la sección que toma la pantalla emite `ESCENA_PROTAGONISTA` (`src/components/v2/escenas.ts`) y las demás se pausan; activarla con `rootMargin "0px 0px -35% 0px"` y precalentarla en `requestIdleCallback`. Sombras de contacto con `frames={1}`. Medición: `perf3.mjs` (móvil 390, CPU ×4) → estrabismo de 26–205 frames lentos a 1.
- Siguientes piezas 3D: cartilla (ambliopía), tabla de Hart (terapia visual), pájaro y jaula / sinoptóforo (binocular), cuaderno (pediátrica).

## Pendientes abiertos
- Copy de las landings (services-content.ts) VALIDADO; el copy nuevo de la home v2 sigue siendo borrador.
- Faltan músculos extraoculares y retina en el modelo.
