# Retomar la v2 (rama feat/v2)

## ▶ EMPEZAR AQUÍ (20-nov-2026, lo más reciente)
Pediátrica ya tiene su pieza sin el ojo: **tablero de cuentas para planchar** (Hama/Perler; la doctora lo usa en TERAPIA y los niños copian un modelo). Foto de referencia: `~/Downloads/IMG_0540 2.HEIC` (no se copió a la carpeta de modelos: el usuario lo rechazó).
- `CuentasEscena.tsx` (hero "auto": las cuentas saltan del montón y arman el ojo; ciclo de 16 s) + `CuentasRecorrido.tsx` (sticky navy de 460svh, 4 pasos; en el 3 una cuenta queda «Fuera de lugar» y salta a su sitio). Respaldos `cuentas*.webp`.
- La figura de la foto era Stitch (Disney): NO se reproduce. El dibujo es un ojo en píxeles 21×13 con la paleta (`DIBUJO`).
- Copy del recorrido = BORRADOR. El usuario aprobó el paso 4; falta la doctora. No decir que la actividad «trata» la ambliopía (PEDIG 2008: actividades de cerca con el parche no mejoran el resultado). Preguntas abiertas para la doctora: edad mínima y tamaño de cuenta (Maxi 10 mm desde 3 años / Midi 5 mm desde 5 años, según Hama).
- Guardado en el commit 35b853a (lint y build en verde).
- Siguen pendientes: borrador de la barra para la doctora, los 3 ajustes visuales de la barra (ver abajo) y los objetos para ambliopía y terapia visual.

**Orden para la próxima sesión** (abrirla en `~/Desktop/Ortoptika-v2`, no en `~/Desktop/ortoptika`):
1. ~~Ajustes visuales de la barra~~ HECHO (20-nov, tarde): trípode con una pata atrás y dos abiertas a los lados; en el hero las gafas suben `SALTO` al pasar por el centro y dejan ver las perillas (el encuadre del hero reserva sitio arriba, así que la barra sale algo más pequeña: ~1075 px de ancho a 1440 frente a ~1250 antes); en el paso 4 la cámara se aleja y mira un poco abajo, y la luz más cercana entra entera. Respaldo `barra-luces.webp` regenerado.
2. HECHO (falta enviarlo): el mensaje está en `~/Desktop/KayaoCC/docs/ortoptika-v2/mensaje-doctora-barra-y-cuentas.md`. Tarea original: juntar en un solo mensaje para la doctora el copy en borrador: los pasos 1-3 de las cuentas (`CuentasRecorrido.tsx`, PASOS) y los 4 de la barra (`BarraRecorrido.tsx`), con las preguntas abiertas de cada uno.
3. Terapia visual: EN CURSO (20-nov, tarde). Objeto: **discos de luz reactivos** (FitLight; sin marca en el modelo). Fotos: `~/Downloads/IMG_0536 2.HEIC`, `IMG_0537`, `IMG_0538 2`, `IMG_0539 2` (no copiadas). Uno va en la pared como referencia y los del suelo se encienden de colores; el niño toca o pisa el del color de la referencia. Hecho: `DiscosEscena.tsx` (hero "auto": rondas con destello, tiempo de reacción en pastilla navy y juego con el cursor) y respaldo `discos.webp`. El usuario aprobó el hero («perfecto»). `DiscosRecorrido.tsx` (sticky navy de 460svh, 4 pasos: referencia en la pared · la mirada busca (aro lima de disco en disco) · el toque con onda y «Reacción 0,62 s» · rondas solas con «Últimas rondas»). La escena en modo "scroll" lee `discosScroll.p` y la cámara se sostiene en un plano por paso (`PLANOS`). Respaldo `discos-recorrido.webp`. **Copy del recorrido = BORRADOR, pendiente de la doctora** (ya está en el mensaje para ella). Los tiempos de las rondas automáticas son de demostración (0,48–0,90 s).
4. Ambliopía: HECHO (20-nov, noche). No hay objeto propio: tras una investigación (`~/Desktop/KayaoCC/docs/ortoptika-v2/ambliopia-research.md`) el usuario eligió la opción A: el tablero de cuentas como «lo que manda cada ojo». `AmbliopiaEscena.tsx`: la escena se dibuja a una textura (useFrame de prioridad 1 + createPortal) y un shader la parte en dos: el lado sano nítido y el ambliope borroso y apagado, con línea divisoria. En el hero la división sigue al cursor, como un comparador. `AmbliopiaRecorrido.tsx`: 4 pasos (cada ojo su imagen · el cerebro se queda con la nítida · primero las gafas · parche o atropina sobre el ojo sano → los dos ojos). Exporta las piezas del tablero desde `CuentasEscena.tsx`. Respaldos `ambliopia*.webp`. Copy = BORRADOR (ya en el mensaje para la doctora). Gotcha: la textura sale premultiplicada (mezcla normal sobre fondo transparente); no volver a multiplicar por alfa.
- Dev: `pnpm exec next dev -p 3312`. Capturas: script de Playwright en el scratchpad de la sesión (se pierde); rehacerlo desde `~/.claude/skills/captura-web/node_modules`, quitando el banner de cookies («Rechazar»). Respaldos sin WebGL: con `reducedMotion: "reduce"` la escena sale completa; ocultar todo menos el canvas para tener fondo transparente.

## EMPEZAR AQUÍ (anterior, 19-nov)
Estrabismo CERRADO el 19-nov: la doctora vio la página en vivo y aprobó el copy del recorrido del cordón. No hay nada a medias.

**Siguiente tarea:** el usuario tiene **elementos nuevos del consultorio** para usarlos como modelos 3D dedicados en las secciones que faltan (ambliopía, terapia visual, visión binocular, pediátrica).
1. Pedir las fotos y referencias si aún no están en `~/Desktop/KayaoCC/docs/ortoptika-v2/consultorio-modelos/` (ver el README de esa carpeta): fotos de varios ángulos, medidas aproximadas, y a qué servicio va cada objeto.
2. Asignar un objeto por servicio. La lista de abajo («Siguientes piezas 3D») era la propuesta ANTES de conocer estos objetos: los objetos reales del consultorio tienen prioridad.
3. Seguir la receta de estrabismo: escena procedural en R3F con la luz de `OjoEstudio`, materiales lacados, `Lienzo` y `encuadrar()`, más un recorrido con scroll si la pieza lo amerita. Mostrar primero una captura fija y luego el recorrido. El copy nuevo va SIEMPRE a la doctora.
4. Plantilla a copiar: `BrockEscena.tsx` + `BrockRecorrido.tsx` (respetar las reglas de rendimiento de abajo).

Para enseñarle a la doctora en local: `pnpm build` y luego `python3 -m http.server 3313 --bind 0.0.0.0 -d out` → `http://localhost:3313/lab/v2/servicios/<slug>/` (o la IP local de la Mac en el celular, mismo wifi).

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
- `BrockRecorrido.tsx`: sección navy sticky de 460svh tras el hero (solo estrabismo), mismo patrón que DosOjos de la home; 4 pasos + recuadro «Lo que se ve» (la X del cordón). La escena en modo "scroll" lee `brockScroll.p` y la cámara viaja entre `PLANOS`. Copy de los pasos **APROBADO por la doctora (19-nov)**.
- Estado de las escenas en refs propias + registro `ETIQUETAS` por `useId` (el React Compiler no deja mutar objetos que llegan por props).
- Rendimiento (19-nov): todo lienzo 3D va por `src/components/three/Lienzo.tsx` (resolución adaptativa con PerformanceMonitor: dpr 2 y solo baja si ese equipo no da; respaldo `public/3d/respaldo/*.webp` si no hay WebGL). **Regla: una sola escena 3D dibujando a la vez** — la sección que toma la pantalla emite `ESCENA_PROTAGONISTA` (`src/components/v2/escenas.ts`) y las demás se pausan; activarla con `rootMargin "0px 0px -35% 0px"` y precalentarla en `requestIdleCallback`. Sombras de contacto con `frames={1}`. Medición: `perf3.mjs` (móvil 390, CPU ×4) → estrabismo de 26–205 frames lentos a 1.
- Siguientes piezas 3D (propuesta previa; ahora mandan los objetos reales del consultorio, ver EMPEZAR AQUÍ): cartilla (ambliopía), tabla de Hart (terapia visual), pájaro y jaula / sinoptóforo (binocular), cuaderno (pediátrica).

## Pendientes abiertos
- Copy de las landings (services-content.ts) y del recorrido del cordón VALIDADO;
- ¿Faltan o sobran servicios? (PENDIENTES): confirmarlo con la doctora; el copy nuevo de la home v2 sigue siendo borrador.
- Faltan músculos extraoculares y retina en el modelo.

## Hecho el 19-nov (sesión 3): visión binocular sin el ojo — barra de luces + gafas rojo/azul
- Objetos reales del consultorio: barra **Bernell EYEPORT II** (36", 12 LED alternos) + gafas reversibles rojo/azul. Manual oficial: https://s3.amazonaws.com/cdn.bernell.com/downloads/BRMJLEPV2-Individual.pdf (texto extraíble con PDFKit). Sin marcas en el modelo.
- `BarraLucesEscena.tsx`: modelo procedural (sección barrida con puntas redondeadas, cápsula, perillas, trípode). **Filtro real**: cada lente con `MultiplyBlending` + disco del color de fondo detrás de la escena en los mismos rayos (si no, sobre el lienzo transparente el filtro no tiñe nada). Halos de LED adelantados hacia la cámara (no se cortan contra la barra).
- Hero de visión binocular: la barra va HORIZONTAL a todo el ancho bajo el texto (`horizontal` en LandingV2: titular a la izquierda, lead a la derecha). Encuadre móvil = solo el tramo central (`tramo()`).
- `BarraRecorrido.tsx`: sticky navy de 460svh, 4 pasos (barra · gafas · giro vertical/diagonal con gafas invertidas · barra a la nariz con la X de la franja). **Copy = BORRADOR, pendiente de la doctora.**
- Gotcha: tras mover la cámara en useFrame, `camera.updateMatrixWorld()` antes de `project()`, o proyecta con la matriz vieja.

### EMPEZAR AQUÍ (próxima sesión, tras el 19-nov sesión 3)
1. Pasar a la doctora el borrador del recorrido de la barra (texto en `BarraRecorrido.tsx`, PASOS). Preguntas abiertas: ¿«el cerebro deja de usar un ojo» es correcto para el paso 2? ¿usa la barra a ~70 cm? ¿hace el ejercicio de la nariz (paso 4) en consulta?
2. Ajustes visuales que quedaron anotados: el trípode del hero (la pata que viene hacia la cámara parece un palo; abrir las patas a los lados), el panel queda tapado cuando las gafas pasan por el centro, y en el paso 4 del recorrido el LED más cercano sale cortado por abajo.
3. Siguientes servicios sin el ojo (ambliopía, terapia visual, pediátrica): pedir al usuario los objetos reales del consultorio para cada uno.
