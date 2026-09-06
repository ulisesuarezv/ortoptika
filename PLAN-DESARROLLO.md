# Plan de Desarrollo — ortoptikaterapia.com

Plan dividido en sesiones para cuidar el contexto. Cada sesión es autocontenida:
tiene un objetivo, entregables verificables y un criterio de "hecho". Al empezar
cada sesión, leer este archivo y la memoria del proyecto.

> ⚠️ **Este archivo no incluye una ronda de trabajo posterior** (motion:
> PageTransition/CustomCursor/useMagnetic, Hero rediseñado, motion en la
> home) hecha en septiembre 2026, que reutilizó la numeración "Sesión
> 1/2/3" para un objetivo DISTINTO al de las Sesiones 1–3 documentadas
> abajo. Ver memoria `ortoptika-motion-rediseno` y el commit `fe8b782` en
> `feat/sitio-ortoptika` para el detalle real de esa ronda antes de asumir
> que las Sesiones 1–8 de aquí abajo son el estado completo del motion del
> sitio.

## Datos base (fuente de verdad)
- Profesional: **Yeimmy Paola Barragan** — optómetra, especialista en ortóptica y terapia visual
- WhatsApp/teléfono: **+57 321 3394829**
- Ubicación: **Clínica Medicadiz – Sede Samaria, Cra. 12 sur #93-21, Consultorio 212, Ibagué, Tolima**
- Horarios: *por confirmar* (placeholder hasta entonces)
- Instagram: instagram.com/ortoptikaterapia
- Dominio: `ortoptikaterapia.com` (aún no comprado; usado como canonical asumido)
- Hosting: Vercel · Contacto: solo WhatsApp · Imágenes: placeholders · Animación: sutil

## Principios transversales (aplican a todas las sesiones)
- Prioridad #1: SEO local. Todo lo demás se subordina.
- Stack: Next.js 16 App Router · TypeScript · Tailwind · GSAP (sutil) · static export
- Contenido de salud (YMYL): prudente, sin promesas de curación ni cifras inventadas.
  Copy = borrador revisable por Ulises antes de producción.
- Mobile-first · Lighthouse 95+ · accesibilidad AA

---

## Sesión 1 — Scaffold + fundaciones
**Objetivo:** proyecto que arranca en local con estructura, tokens y datos reales.
- `create-next-app` (TS, Tailwind, App Router) + `next.config.ts` con `output: 'export'`
- Estructura de carpetas del brief (app/components/lib/hooks/styles/public)
- `lib/constants.ts` con SITE_CONFIG (datos reales de arriba)
- Sistema de diseño en Tailwind: paleta (teal/slate/crema/acento cálido), fuentes
  (heading + body vía next/font), escala tipográfica, radios, spacing
- `globals.css` con tokens · layout raíz con `<html lang="es">` y metadata global base
- Placeholder de Header, Footer, WhatsAppButton (estáticos, sin pulir)
**Hecho cuando:** `npm run dev` levanta una home en blanco con header/footer y build `next build` pasa.
> ✅ **Completada (2026-07-17).** Next.js 16.2 (App Router, TS, Tailwind v4 CSS-first, src/).
> `next.config.ts` con `output: 'export'` + `images.unoptimized` + `trailingSlash`. Estructura de
> carpetas creada. `lib/constants.ts` con SITE_CONFIG (datos reales) + `SERVICES` + `whatsappLink()`.
> Design system en `styles/globals.css` (@theme: teal/slate/crema/acento, fuentes Plus Jakarta + Inter
> vía next/font, escala tipográfica, radios, sombras, reduced-motion). `layout.tsx` con `lang="es"` y
> metadata global. Placeholders Header/Footer/WhatsAppButton. `npm run build` (export) pasa, genera `out/`.

## Sesión 2 — Sistema de componentes UI + layout real
**Objetivo:** biblioteca de componentes reutilizables y layout definitivo.
- `ui/`: Button, ServiceCard, FAQAccordion, TrustBar
- `layout/`: Header con nav responsive, Footer con contacto, WhatsAppButton flotante funcional
- `sections/`: Hero, ServicesGrid, AboutPreview, ContactSection (con markup semántico)
- Hook `useGSAP` + registro global de ScrollTrigger; animaciones sutiles base
**Hecho cuando:** componentes montables y visibles en la home, responsive, sin contenido final.
> ✅ **Completada (2026-07-17).** GSAP 3.15 instalado.
> `hooks/useGSAP.ts`: hook con `gsap.context()` scopeado a un ref, registro global único de
> ScrollTrigger, cleanup vía `ctx.revert()` y respeto a `prefers-reduced-motion` (si está activo no anima).
> `ui/`: **Button** (polimórfico button/Link/`<a>` externo, variantes primary/secondary/ghost, foco AA),
> **ServiceCard** (consume `SERVICES`, enlaza a `/servicios/[slug]`, con `ServiceIcon` placeholder por slug),
> **FAQAccordion** (`<button>` nativo, `aria-expanded`/`aria-controls`, sin dependencias),
> **TrustBar** (credenciales placeholder editables), **Reveal** (wrapper cliente que hace fade-up/stagger
> con ScrollTrigger, dejando las secciones como Server Components).
> `layout/`: **Header** con nav responsive + menú móvil accesible (Escape, bloqueo de scroll, cierre onClick),
> **Footer** (sin cambios, ya consumía `SITE_CONFIG`), **WhatsAppButton** flotante funcional con `whatsappLink()`.
> `sections/`: **Hero**, **ServicesGrid**, **AboutPreview**, **ContactSection** con markup semántico
> (`<section aria-labelledby>`, jerarquía de headings, `<dl>`, `<address>`), todo con contenido PLACEHOLDER.
> Secciones montadas en la home (`app/page.tsx`). `npm run lint` limpio y `npm run build` (export) pasa.
> Pendiente sesión 3: copy real, metadata por página y JSON-LD.

## Sesión 3 — Home + Sobre mí (contenido + SEO)
**Objetivo:** dos primeras páginas completas con copy y schema.
- Home: hero, servicios resumidos, sobre-mí breve, trust signals, CTA WhatsApp
- `/sobre-mi`: trayectoria, formación, filosofía (crítico para E-E-A-T)
- `lib/metadata.ts` (helper) + `lib/schema.ts` (JSON-LD MedicalBusiness + Person)
- generateMetadata por página, internal linking
**Hecho cuando:** ambas páginas con copy borrador, metadata y JSON-LD válidos (Rich Results Test).
> ✅ **Completada (2026-07-17).**
> - **Home** (`app/page.tsx`): copy borrador real en Hero, ServicesGrid, AboutPreview y ContactSection
>   (tono empático a padres, sin promesas de curación ni cifras inventadas). FAQ de home con 3 preguntas
>   borrador (schema FAQPage se añade en sesiones 4-5). CTAs WhatsApp e internal links a `/sobre-mi` y servicios.
> - **`/sobre-mi`** (Server Component): hero, trayectoria, formación/credenciales, filosofía ("cómo trabajo"),
>   internal linking a los 5 servicios + home, y disclaimer YMYL ("no sustituye valoración profesional").
> - **`lib/metadata.ts`**: helper `buildMetadata({title,description,path,ogTitle,index})` → canonical + OpenGraph
>   + Twitter + robots centralizados.
> - **`lib/schema.ts`**: `medicalBusinessSchema()` + `personSchema()` (sólo datos reales de SITE_CONFIG;
>   nodos enlazados por `@id`) + helper `jsonLd()`. Horarios/geo/credenciales OMITIDOS a propósito (no inventar).
> - `generateMetadata`/`metadata` por página con títulos y canonicals únicos (verificado en `out/`). JSON-LD
>   presente en el HTML exportado. `npm run lint` limpio y `npm run build` (export) pasa.
> - **Revisar en Rich Results Test antes de producción** (dominio aún no comprado).
>
> **⚠️ PLACEHOLDERS de datos personales a rellenar (pedir a la doctora, verificados):**
> 1. Formación: universidad y año del título de Optometría.
> 2. Especialización/posgrado en Ortóptica y Terapia Visual: institución y año.
> 3. Colegiatura / registro profesional: entidad y número.
> 4. Años de experiencia (texto en /sobre-mi "Mi trayectoria" y en `TrustBar` "+X años").
> 5. Formación continua / cursos relevantes (opcional).
> 6. Foto real de la doctora (hero de home y /sobre-mi; hoy bloque placeholder).
> Al confirmarlos: rellenar `app/sobre-mi/page.tsx` (bloques marcados), `TrustBar` y añadir a
> `personSchema()` los campos `alumniOf` / `hasCredential` / `image` (hoy omitidos).

## Sesión 3.5 — Rediseño visual (dirección editorial / premium)
**Objetivo:** subir el sistema visual de "funcional/genérico" a editorial premium, y
re-aplicarlo a lo ya construido, ANTES de crear más páginas.
**Dirección:** editorial / premium — layouts con composición real (asimetría, no todo
centrado en columna), tipografía grande protagonista, jerarquía fuerte, detalles de marca,
color con intención. Sigue siendo apropiado para salud (público: padres preocupados),
rápido (Lighthouse 95+) y con animación SUTIL (el movimiento no cambia; sube el diseño).
- Revisar/enriquecer tokens en globals.css @theme (escala tipográfica más amplia, ritmo
  vertical, quizá una fuente display para headings, refinamiento de paleta)
- Rediseñar componentes ui/ y sections/ (Hero, ServicesGrid, AboutPreview, ContactSection,
  Header, Footer, ServiceCard, TrustBar, Button, FAQAccordion)
- Re-aplicar a Home y /sobre-mi sin tocar el copy borrador ya escrito
- Definir el lenguaje visual que heredarán las landings de servicio (Sesiones 4-5)
**Hecho cuando:** Home y /sobre-mi con el nuevo lenguaje editorial, componentes actualizados,
responsive, `npm run build` pasa. Aprobación visual de Ulises antes de seguir.

## Sesión 3.5 — Rediseño visual editorial (insertada)
**Objetivo:** subir el diseño de "plantilla genérica" a EDITORIAL / PREMIUM cálido,
apropiado para salud (padres). Sin tocar la arquitectura ni el copy borrador; la
animación sigue SUTIL (solo Reveal).
> ✅ **Completada (2026-07-18).**
> - **Tokens (`styles/globals.css`):** nueva **fuente display serif Fraunces** (`--font-display`,
>   variable opsz + itálica, vía next/font) para `h1`/`h2` → carácter cálido y de confianza;
>   Plus Jakarta pasa a eyebrows/UI (`h3`–`h6`) e Inter sigue en cuerpo. Escala tipográfica
>   **fluida con `clamp()`** en display (3xl–7xl, con line-heights pareados). Nuevos tokens:
>   `--color-line` (hairline de tinta), `--color-cream-deep`, `--radius-3xl`, `--shadow-lift`.
>   Clases utilitarias: `.eyebrow` (con regla de acento), `.accent-word` (palabra itálica teal
>   dentro de titulares), `.section-index` (índice sobredimensionado) y `.img-placeholder`
>   (placeholder editorial con dot-grid, proporción y marco fáciles de reemplazar).
> - **UI:** `Button` (píldora, elevación sutil, ghost con contorno), `ServiceCard` (índice
>   sobredimensionado, icono en chip teal, variante `featured` a 2 columnas), `FAQAccordion`
>   (hairlines, pregunta en serif, icono +/−), `TrustBar` (fila con separadores hairline).
> - **Layout:** `Header` (wordmark serif), `Footer` (banda CTA display "¿Hablamos…?" como
>   continuación del flujo). `WhatsAppButton` sin cambios.
> - **Sections:** `Hero` (rejilla asimétrica 7/5, titular 7xl con palabra acentuada, retrato
>   con chip de credencial flotante y arco de marca), `ServicesGrid` (encabezado asimétrico +
>   grid irregular con 1ª tarjeta destacada), `AboutPreview` (retrato recortado + índice 01 +
>   TrustBar), `ContactSection` (contacto en tarjeta cálida + FAQ ancho con índice 02).
> - **Páginas:** Home y `/sobre-mi` re-maquetadas **sin reescribir copy**; placeholders con
>   borde punteado + ⚠️ intactos. Siguen siendo Server Components (animación solo en Reveal).
> - **Verificado:** `npm run build` (export) pasa; screenshots desktop + móvil (390px) revisados.
> - **Decisiones de composición para aprobar:** serif Fraunces como voz de marca; asimetría
>   70/30 en todas las secciones; índices tipográficos como recurso editorial; placeholders
>   con textura (no bloques planos). **Pendiente de validar rumbo por Ulises antes de Sesión 4.**
>
> **QA visual (2026-07-18) — 3 bugs encontrados y corregidos con Playwright:**
> 1. **ServiceCards invisibles:** el `Reveal` con `stagger` usaba `gsap.from(...)` que, junto a
>    stagger + ScrollTrigger, registraba el estado final con los hijos ya en `autoAlpha:0` y
>    animaba de 0 a 0 → las 5 tarjetas quedaban permanentemente ocultas. Reescrito a patrón
>    `gsap.set()` + `gsap.to()` en `ui/Reveal.tsx` (fiable). Verificado: op 0→1 con stagger.
> 2. **Titular del footer invisible (oscuro sobre oscuro):** las reglas de elemento (`h1,h2`,
>    `body`…) en `globals.css` estaban **fuera de `@layer`**; en Tailwind v4 el CSS sin capa gana
>    a las utilidades, así que `h2.text-white` del footer quedaba en color base. Envueltas en
>    `@layer base` → las utilidades de color vuelven a poder sobrescribir. (Landmine para las
>    landings de Sesión 4; resuelto de raíz.)
> 3. **Posiciones de ScrollTrigger stale por reflow de fuentes:** añadido
>    `document.fonts.ready.then(() => ScrollTrigger.refresh())` en `hooks/useGSAP.ts`.
> - Re-verificado tras los fixes: `npm run build` pasa; Home y /sobre-mi renderizan completas en
>   desktop (1440) y móvil (390), reveals disparan, placeholders ⚠️ intactos.

## Sesión 3.6 — Composición disruptiva + fondos SVG animados (insertada)
**Objetivo:** pasar de "editorial tímido / todo centrado" a composición nivel estudio
(asimetría real, rejillas rotas, superposiciones, escala extrema) + capas de fondo SVG
animadas, sin tocar copy, SEO ni arquitectura (Server Components + Reveal).
> ✅ **Completada (2026-07-18).**
> - **Tokens (`styles/globals.css`):** escala extrema `--text-8xl`/`--text-9xl` (clamp hasta
>   15rem); utilidades `.vertical-text` (meta en writing-mode), `.text-outline` y `.watermark`
>   (palabra/número gigante como gráfico de fondo). Keyframes ambiente `bg-drift`,
>   `bg-drift-reverse`, `bg-breathe`, `bg-wave` (+ clases `.anim-*`) — SOLO transform/opacity,
>   congeladas por el bloque global de prefers-reduced-motion.
> - **Fondos SVG (`ui/Backdrop.tsx`, Server Component reutilizable):** 4 variantes de capa
>   decorativa inline (aria-hidden, pointer-events-none, siempre detrás con contenido en z-10):
>   `blobs` (formas orgánicas teal/coral), `waves` (ondas hairline ≈ trayectorias ópticas),
>   `iris` (anillos concéntricos que respiran), `dots` (retícula con máscara radial). Props
>   `flip` y `tone="dark"` (footer). **`ui/Parallax.tsx`** (cliente): parallax ligero por scroll
>   (yPercent + scrub) para esas capas; respeta reduced-motion vía useGSAP.
> - **Composición Home:** Hero con titular fragmentado a escala extrema (itálica 2xl → 8xl →
>   accent 7xl → ", en Ibagué" en 12px tracking ancho), palabra-gráfico "ver" sangrando por la
>   derecha, retrato solapado rotado 1.5° con chip contra-rotado, meta vertical en el borde
>   (writing-mode). ServicesGrid anti-grid de 12 col: spans desiguales (7/5/4/4/4), tarjetas
>   que caen/suben de fila y la 05 girada −1.3°; watermark "áreas". AboutPreview con retrato
>   blob (border-radius orgánico) sangrando a la derecha y tarjeta de texto que cabalga encima
>   (z narrativo); watermark "cerca". ContactSection con "Hablemos" a ~25vw de fondo y tarjeta
>   rotada −1.5°. Footer con ondas dark.
> - **`/sobre-mi` re-compuesta:** nombre a 8xl con watermark "calma", retrato blob, índices
>   gigantes 01–04 como columna narrativa (01 sticky), credenciales como tarjetas escalonadas
>   con offsets/rotaciones alternas (dashed + ⚠️ INTACTOS), filosofía con numerales gigantes y
>   filas alternadas, servicios como índice editorial a lo ancho (filas hairline con flecha).
> - **Guardarraíles verificados:** copy borrador y placeholders ⚠️ sin cambios; páginas siguen
>   Server Components (cliente solo Reveal/Parallax/FAQ/Header); metadata y JSON-LD intactos;
>   sin librerías nuevas ni raster.
> - **QA visual (Playwright):** screenshots antes/después en `qa-screenshots/` (1440 y 390,
>   ambas páginas, scrolleando para disparar reveals). Sin overflow horizontal en 390, nada
>   invisible tras el scroll, 0 errores de consola. Con `prefers-reduced-motion: reduce`:
>   0 animaciones corriendo y 0 contenido oculto. `npm run lint` y `npm run build` (export) ✅.
> - **Nota QA:** en capturas full-page SIN scroll previo, lo de bajo el pliegue sale en
>   `autoAlpha:0` (los ScrollTrigger no se han disparado) — es artefacto de captura, no bug.
> - **Herencia para landings (sesiones 4-5):** usar `<Backdrop/>` + `<Parallax/>` + `.watermark`
>   + índices gigantes + grid 12 col con spans desiguales; sección tipo: `relative
>   overflow-hidden` → capa fondo z-0 → contenido `relative z-10`.

## Sesión 4 — Landings de servicio (parte 1: 3 de 5)
**Objetivo:** estrabismo, ambliopía, terapia-visual.
- Plantilla de página de servicio reutilizable (qué es → proceso → para quién → FAQ)
- Copy educativo por servicio + FAQAccordion con FAQPage schema
- Service + FAQPage JSON-LD, generateMetadata por cluster de keywords
**Hecho cuando:** 3 landings completas, enlazadas desde ServicesGrid, schema validado.
> ✅ **Completada (2026-07-18, junto con Sesión 5 en una sola sesión).**
> - **Arquitectura:** una ruta dinámica `app/servicios/[slug]/page.tsx` con
>   `generateStaticParams` + `dynamicParams=false` (prerenderiza los 5 slugs en el export;
>   cualquier otro slug → 404). Contenido tipado en **`lib/services-content.ts`**
>   (`ServiceContent`: hero fragmentado, qué es + señales, tipos/causas, tratamiento,
>   proceso, para quién, FAQ, keywords, tema visual). Composición en
>   **`components/services/ServiceLanding.tsx`** (Server Component).
> - **Plantilla disruptiva con variación por servicio** vía `theme` (watermark propio,
>   variante de Backdrop de hero y secciones, `flip` que espeja la composición):
>   hero con titular fragmentado (itálica → 8xl → accent) + watermark sangrando + meta
>   vertical + breadcrumb; 01 qué-es con índice sticky y tarjeta de señales rotada;
>   02 tipos como tarjetas escalonadas anti-grid (lado alternado según flip); 03
>   tratamiento con filas hairline; 04 proceso con numerales watermark y offsets
>   alternados; 05 para-quién + nota YMYL; 06 FAQ + CTA + enlaces cruzados a los otros
>   4 servicios (internal linking).
> - **SEO:** `generateMetadata` con `buildMetadata()` + `keywords` por cluster; canonical
>   `/servicios/<slug>/` (con trailing slash, coherente con `trailingSlash: true`).
>   JSON-LD **Service** (provider → MedicalBusiness por `@id`) + **FAQPage** con las
>   mismas FAQ visibles, verificados en `out/`. `lib/schema.ts` ganó `serviceSchema()` y
>   `faqPageSchema()`.
> - **Copy YMYL:** ~1.100-1.400 palabras/landing, tono a padres, condicional, sin cifras
>   ni promesas; afirmaciones clínicas listadas para revisión de la doctora (ver la
>   lista entregada al cierre de la sesión y la memoria del proyecto).

## Sesión 5 — Landings de servicio (parte 2) + Contacto + Blog
**Objetivo:** cerrar el árbol de páginas.
- visión-binocular, optometría-pediátrica (misma plantilla)
- `/contacto`: mapa Google Maps embebido, dirección, horarios, WhatsApp, schema con geo
- `/blog`: ruta y layout preparados, **noindex** hasta tener ≥3 artículos
- `not-found.tsx`
**Hecho cuando:** las 8 páginas navegables y completas.
> ✅ **Completada (2026-07-18).** Las 8 páginas del sitio navegables:
> home, /sobre-mi, 5 landings de servicio, /contacto, /blog y 404.
> - **`/contacto`:** solo WhatsApp (sin formulario, según brief). Tarjeta de datos rotada
>   que solapa el mapa, horarios como placeholder ⚠️ "por confirmar", Instagram y
>   teléfono. **Iframe de Google Maps listo**: renderiza cuando se pegue la URL en
>   `SITE_CONFIG.googleMapsEmbed` (hoy placeholder editorial con link "Abrir en Google
>   Maps" por búsqueda de la dirección). JSON-LD MedicalBusiness sin geo (coords aún
>   sin confirmar — no se inventaron).
> - **`/blog`:** ruta y layout preparados sin artículos, con **noindex**
>   (`buildMetadata({index:false})`, verificado `noindex, follow` en `out/`). Al publicar
>   ≥3 artículos: quitar noindex y añadir al sitemap (sesión 6).
> - **`not-found.tsx`:** 404 con lenguaje del sitio (watermark "404" gigante, dots),
>   sin Reveal (contenido visible al instante), links a home y a los 5 servicios.
> - **QA (Playwright, sobre `out/` servido):** estrabismo, ambliopía y contacto revisados
>   a fondo en 1440 y 390 (screenshots `qa-screenshots/s45-*`); el resto de páginas con
>   chequeo automático. En todas: overflow horizontal 0, ningún h1/h2/h3/p/li/dt/dd
>   oculto tras scroll, 0 errores de consola (solo warnings benignos de preload de
>   next/font). `prefers-reduced-motion: reduce`: 0 animaciones corriendo, 0 oculto.
>   Los 5 enlaces de ServicesGrid responden 200. 2 fixes de QA: leyenda del mapa
>   solapada por la tarjeta (pl en lg) y h1 de 404/blog apilando una palabra por línea
>   (max-w retirado). `npm run lint` y `npm run build` (export) ✅.
> - **Placeholders nuevos/pendientes:** URL de embed de Google Maps
>   (`SITE_CONFIG.googleMapsEmbed`), horarios reales, coords geo para el schema.

## Sesión 5.5 — REBRAND a la identidad real (insertada)
**Objetivo:** sustituir la paleta inventada (teal/crema/ámbar) por la marca REAL
(azul #0E4D7A / lima #A8CF45 / navy #02223B) e integrar logo y foto de la doctora,
sin tocar copy, SEO ni la composición disruptiva.
> ✅ **Completada (2026-07-18).**
> - **Tokens (`styles/globals.css` @theme):** las tres escalas re-derivadas de la marca —
>   `primary-700 = #0E4D7A` (azul), `accent-500 = #A8CF45` (lima), `slate-ink-900 = #02223B`
>   (navy: texto principal Y fondo del footer). Neutros crema conservados (calidez).
>   Regla AA del lima respetada: solo formas/fondos/bloques o con texto navy encima;
>   para texto sobre claro existe `accent-700` (#596f1e, oliva oscuro).
> - **Fix de capas:** las clases custom (`.accent-word`, `.watermark`, `.eyebrow`…) estaban
>   SIN capa → ganaban a las utilidades de Tailwind y overrides como el `text-accent-300`
>   del `<em>` del footer eran inertes. Movidas a `@layer components` (mismo landmine que
>   la @layer base de la Sesión 3.5, ahora resuelto del todo).
> - **Botones:** `primary` pasa de coral/blanco a **lima + texto navy** (~9:1); `secondary`
>   azul de marca #0E4D7A + blanco. Acentos finos que eran coral (separadores «—», bullets)
>   → azul `primary-400` o lima oscuro; hairlines de acento (`border-l-2`) → lima 500.
> - **Logo:** Header con lockup horizontal = icono ojo+cerebro + wordmark "ORTOPTIKA"
>   REAL recortado del logo (el logo completo apilado sería ilegible a altura de header).
>   Footer con logo completo a color sobre tarjeta crema (la versión monocroma blanca
>   por filtro CSS se descartó: las cajas de la O/K se tragaban las letras).
> - **Foto real de la doctora** en Hero (con `preload`, es LCP), AboutPreview y /sobre-mi,
>   vía next/image `fill` + `object-cover` dentro de los marcos blob existentes, con nueva
>   clase `.photo-frame` (fondo radial de marca tras el PNG recortado). Alt descriptivos.
>   Placeholders de retrato eliminados; los ⚠️ de DATOS siguen intactos.
> - **Assets optimizados** (`scripts/optimize-brand-assets.mjs`, sharp): foto 991KB → 71KB
>   WebP 900px; logos → WebP 480/640px + wordmark recortado. Para reemplazar una imagen:
>   sobrescribir el PNG fuente y re-ejecutar el script (el sitio consume solo los .webp).
> - **Motivo de marca en fondos:** la variante `iris` de Backdrop gana el contorno
>   almendrado del ojo + arco de ceja en lima + pupila lima (eco directo del logo).
> - **QA (Playwright sobre `out/`):** Home y /sobre-mi en 1440 y 390 (screenshots
>   `qa-screenshots/s55-*`), footer/header con zoom, contacto y estrabismo comprobados;
>   las 8 rutas 200 con 0 errores de consola; overflow-x 0; reduced-motion: 0 animaciones
>   y 0 texto oculto; `grep` del CSS compilado: **0 hex de la paleta vieja**.
>   `npm run lint` y `npm run build` (export) ✅.
> - **Para Sesión 6:** usar `public/images/brand/logo-mark-eye-brain.png` como base del
>   favicon/apple-touch-icon; considerar `personSchema().image` con la foto ya real.

## Sesión 5.75 — Capa SEO nacional (insertada; ejecutada DESPUÉS de la Sesión 6)
**Objetivo:** ampliar el alcance de "solo Ibagué" a "Ibagué + Colombia" con el modelo de
DOS CAPAS (ver memoria `ortoptika-seo-estrategia`): la capa LOCAL intacta (NAP, sede,
/contacto hiper-local) y la capa NACIONAL apilada encima, sin prometer atención remota
(servicio 100% presencial en Ibagué).
> ✅ **Completada (2026-07-18).**
> - **Metadata reequilibrada nacional+local:**
>   - Home: título absoluto "Ortóptica y Terapia Visual en Colombia | Ortoptika — Ibagué"
>     (con `title.absolute` para esquivar el template del layout) + cluster de keywords
>     nacional/informacional + local. `SITE_CONFIG.descripcion` ahora "en Colombia, con
>     atención presencial en Ibagué…" (alimenta layout y MedicalBusiness).
>   - 5 landings: metaTitle con la condición + "Colombia" e Ibagué como señal secundaria
>     (ej. "Tratamiento de estrabismo en Colombia — ortóptica en Ibagué"); descriptions
>     con "presencial en Ibagué"; keywords nacionales e informacionales AÑADIDAS a las
>     locales ("qué es la ortóptica", "ojo vago tratamiento", "terapia visual en
>     Colombia"…), sin quitar ninguna local.
>   - **/contacto sin cambios: sigue hiper-local.** /sobre-mi: description gana ", Colombia".
>   - Canonicals idénticos (verificado en out/): mismas rutas, sitemap (8 URLs) y robots
>     intactos; /blog sigue noindex.
> - **Copy (afinado, no reescrito):** Hero home ", en Ibagué · Colombia"; TrustBar
>   "Presencial · pacientes de toda Colombia"; FAQ nueva en home "¿Atiendes a pacientes
>   de otras ciudades de Colombia?" (viajan a la cita presencial; WhatsApp orienta antes
>   del viaje); ServiceLanding: párrafo "¿Vives fuera de Ibagué?…" en el CTA final de las
>   5 landings; /sobre-mi: frase de familias que viajan. En NINGÚN caso se promete
>   valoración ni terapia a distancia; placeholders ⚠️ intactos.
> - **Schema:** `areaServed` ahora `[City Ibagué, Country Colombia]` en MedicalBusiness
>   y en los 5 Service (verificado en out/). `address`/sede única sin cambios; geo sigue
>   pendiente de coordenadas reales.
> - **OG images regeneradas** (los títulos de las OG no cambian — usan nombre de servicio,
>   no el metaTitle— pero el pie pasa de "Ibagué, Tolima" a "Ibagué · Colombia" en las 9;
>   verificadas visualmente legibles). Alt de las OG actualizado.
> - **QA:** `npm run lint` + `npm run build` (export) ✅; overflow-x 0 en 1440 y 390 en
>   las zonas de copy nuevo (screenshots `qa-screenshots/s575-*`).
>
> **📝 ESTRATEGIA DE BLOG — motor de autoridad NACIONAL (documentada, pendiente de escribir):**
> El blog es la vía principal para posicionar a nivel país (keywords informacionales sin
> ciudad). Sigue **noindex hasta publicar ≥3 artículos**; al publicarlos: quitar
> `index:false` en `app/blog/page.tsx` y añadir /blog/ (y los artículos) al sitemap.
> Estructura propuesta: `/blog/[slug]/` estático (MDX o contenido tipado como
> services-content), autora enlazada a `personSchema` (E-E-A-T), schema `Article`,
> internal links a la landing de servicio correspondiente y CTA WhatsApp suave.
> Reglas YMYL: sin promesas ni cifras inventadas; revisión clínica de la doctora.
> **Títulos objetivo (keyword nacional → landing que refuerzan):**
> 1. "¿Qué es la ortóptica y en qué se diferencia de la optometría?" (qué es la ortóptica → /terapia-visual)
> 2. "Señales de ojo vago en niños: cómo detectarlo a tiempo" (ojo vago niños señales → /ambliopia)
> 3. "¿El estrabismo en bebés se corrige solo? Cuándo consultar" (estrabismo bebés → /estrabismo)
> 4. "Terapia visual: qué es, para quién sirve y qué dice la evidencia" (qué es la terapia visual → /terapia-visual)
> 5. "Mi hijo ve bien pero le duele la cabeza al estudiar: visión binocular" (dolor de cabeza al estudiar → /vision-binocular)
> 6. "¿A qué edad debe ser el primer examen visual de un niño?" (primer examen visual niño → /optometria-pediatrica)
> 7. "Más allá del parche: cómo se trata hoy la ambliopía" (parche ojo vago → /ambliopia)
> 8. "Insuficiencia de convergencia: la causa invisible de la fatiga al leer" (insuficiencia de convergencia → /vision-binocular)

## Sesión 6 — SEO técnico + assets
**Objetivo:** cerrar el checklist SEO y los meta-assets.
- `app/sitemap.ts` + `app/robots.ts`
- OG images por página (`opengraph-image.tsx` o estáticas)
- Favicon + apple-touch-icon · canonical en todas · alt texts
- Google Tag Manager (contenedor pendiente de crear; dejar hook listo)
- Placeholders de imágenes de calidad, estructurados para reemplazo fácil
**Hecho cuando:** checklist SEO técnico del brief completo.
> ✅ **Completada (2026-07-18).**
> - **`app/sitemap.ts`:** home + /sobre-mi + 5 servicios + /contacto (8 URLs), con trailing
>   slash coherente con `trailingSlash: true` y dominio desde `SITE_CONFIG.url`. /blog queda
>   FUERA mientras siga noindex/vacío (al publicar ≥3 artículos: quitar noindex y añadirlo).
> - **`app/robots.ts`:** crawl completo (`Allow: /`) + referencia al sitemap. /blog NO se
>   bloquea aquí a propósito: su señal es el meta noindex por página (bloquearlo en robots
>   impediría que los crawlers lo vieran).
> - **Nota output:'export':** sitemap/robots/OG/iconos generados son route handlers y exigen
>   `export const dynamic = "force-static"`; el de `[slug]` además su propio
>   `generateStaticParams` (no hereda el del page). Ya aplicado en todos.
> - **Iconos** (`scripts/generate-icons.mjs`, regenerables): el line-art ojo+cerebro es
>   demasiado fino para 16px, así que el favicon usa una SILUETA simplificada que conserva
>   la forma: almendra azul #0E4D7A + iris lima + pupila navy. `favicon.ico` (16/32/48,
>   PNG-in-ICO), `icon.png` (512, con arco de ceja lima) y `apple-icon.png` (180, fondo navy
>   sólido + ojo blanco). Verificados visualmente a 16/32/180 y en el head servido (200 + decode).
> - **OG images** (1200×630, ~52-68KB): plantilla compartida en `lib/og.tsx` (ImageResponse
>   de next/og; fondo crema, logo real + wordmark, eyebrow con regla lima, titular Fraunces
>   navy, pie "Dra. … · Ibagué, Tolima"; lima solo como formas). `opengraph-image.tsx` en
>   raíz (home; la heredan 404), /sobre-mi, /contacto, /blog (necesaria: su buildMetadata
>   pisa la heredada) y /servicios/[slug] (una por servicio con su nombre). Fuentes TTF
>   locales en `assets/og-fonts/` (solo build, no se sirven).
> - **Canonical:** verificado en `out/` en las 9 páginas HTML (8 + blog), todas absolutas
>   con trailing slash.
> - **GTM:** `SITE_CONFIG.gtmId = "GTM-XXXXXXX"` (PLACEHOLDER) + `hasRealGtmId()`;
>   `components/layout/GoogleTagManager.tsx` (GtmScript afterInteractive + GtmNoScript)
>   montado en layout. Mientras siga el placeholder NO inyecta nada (verificado: 0
>   referencias a googletagmanager en out/). Al crear el contenedor: sustituir el ID.
> - **Schema:** `personSchema()` gana `image` (URL absoluta de la foto real). alumniOf /
>   hasCredential siguen omitidos (placeholders).
> - **QA:** `npm run lint` y `npm run build` (export) ✅; sitemap/robots/iconos/OG presentes
>   en `out/` y sirviendo 200; 0 errores de consola en la home servida.
> - **Placeholder NUEVO:** ID real de Google Tag Manager (crear contenedor y reemplazar
>   `GTM-XXXXXXX` en `lib/constants.ts`).

## Sesión 7 — Pulido, QA y deploy
**Objetivo:** listo para producción.
- Animaciones GSAP finales (reveals, stagger) — revisar que sean sutiles
- Auditoría Lighthouse (target 95+), Core Web Vitals, accesibilidad AA
- QA responsive (mobile/tablet/desktop) · revisión de copy final
- Deploy a Vercel · verificación de build export
**Hecho cuando:** sitio en producción en Vercel, Lighthouse 95+.
> ✅ **Completada (2026-07-18) como STAGING protegido** (dominio sin comprar y
> placeholders ⚠️ pendientes → NO es el lanzamiento público).
>
> **STAGING:** deployment de *preview* en Vercel (proyecto `ortoptika`, cuenta
> ulisesuarezv, plan Hobby) protegido con Vercel Authentication (302 a SSO +
> `X-Robots-Tag: noindex` — no indexable sin tocar robots/metadata reales).
> URL actual: https://ortoptika-7ml9e05cu-ulisesuarezvs-projects.vercel.app
> Acceso: logueado en Vercel, o con el secret de Protection Bypass del proyecto
> (Settings → Deployment Protection; añadir `?x-vercel-protection-bypass=<secret>`
> `&x-vercel-set-bypass-cookie=true` a la URL). El deployment de *production* se
> ELIMINÓ a propósito (ortoptika.vercel.app → 404): en Hobby la protección no
> cubre production, quedaba público e indexable. Cada `npx vercel deploy
> --target=preview` genera una URL nueva protegida.
>
> **Performance (fixes reales de esta sesión):**
> 1. **LCP roto de raíz:** los `Reveal` ocultaban (autoAlpha:0) el contenido del
>    hero ya pintado hasta que GSAP hidrataba → LCP 7.3-7.7s simulado. Ahora un
>    Reveal en (o por encima de) el viewport inicial NO anima; el reveal queda
>    para lo que entra por scroll. Foto del hero: `loading="eager"` +
>    `fetchPriority="high"` (el `preload` de next/image se sustituyó según docs).
> 2. **Trigger desacoplado:** `ScrollTrigger.create({onEnter})` dispara un tween
>    libre (antes el tween iba DENTRO del scrollTrigger y un refresh global —
>    p. ej. document.fonts.ready — podía revertirlo en vuelo → contenido
>    invisible intermitente).
> 3. **Fuentes:** preload reducido de 4 woff2 (221KB) a 2 (115KB). Plus Jakarta
>    (UI) e itálica Fraunces (accent-words/watermarks, familia aparte
>    `--font-display-italic`) van sin preload y con `display:"optional"` — el
>    swap tardío re-wrapeaba titulares fragmentados (CLS 0.25 medido). En frío
>    se ve el fallback métrico (Georgia itálica, digno); cacheado, Fraunces real.
> 4. **Assets:** logos a tamaño de render (header 48→11KB, footer 110→38KB) y
>    variante móvil de la foto del hero (70→38KB) vía `<picture>` nativo
>    (regenerables con `node scripts/optimize-brand-assets.mjs`).
>
> **Lighthouse (staging Vercel, con bypass):** Desktop home **100/100/100** ·
> Móvil (throttling slow-4G): Perf 77-95 según run (varianza de red del audit;
> mediana ~85-90), A11y **100**, Best Practices **100** en las 4 páginas
> auditadas (home, estrabismo, sobre-mi, contacto). **SEO marca 61 en staging
> por el noindex de la protección (correcto); en el build real da 100.**
> CWV: **CLS 0 en todo**, TBT ≤60ms, LCP observado real ~1.2-2.6s (el 3.5-4.5s
> es la simulación slow-4G de lantern; el umbral <2.5s se cumple en condiciones
> reales).
>
> **Accesibilidad AA:** contraste OK (fix: botón flotante WhatsApp pasaba texto
> blanco sobre verde 1.98:1 → texto navy ≈8:1, misma regla que el lima); tap
> targets <24px corregidos (footer, breadcrumb, links de /contacto con py);
> teclado verificado (menú móvil Enter/Escape + aria-expanded + scroll lock,
> FAQ con aria-controls, focus outline 3px); un h1 por página; reduced-motion:
> 0 animaciones y 0 contenido oculto.
>
> **QA responsive (390/768/1440, screenshots `qa-screenshots/s7-*`):** overflow
> horizontal 0, contenido oculto 0 tras scroll (10/10 runs), 0 errores de
> consola. Copy repasado: 1 errata corregida ("habéis"→"han", vosotros→ustedes);
> placeholders ⚠️ intactos y claramente marcados.
>
> **⚠️ Gotcha de QA con Playwright (para futuras sesiones):** en el browser de
> automatización (ventana ocluida) rAF se suspende y ScrollTrigger solo
> sincroniza cada ~200ms; scrollear con pasos <200ms de dwell hace que NINGÚN
> trigger dispare (falsos "contenido oculto"). Scrollear con dwell ≥250ms por
> paso. No afecta a usuarios reales (rAF activo en ventana visible).
>
> **PARA EL LANZAMIENTO PÚBLICO REAL (checklist):**
> 1. Comprar `ortoptikaterapia.com` y añadirlo al proyecto Vercel (custom domain
>    queda fuera de la protección automáticamente) + `npx vercel deploy --prod`.
> 2. Credenciales de la doctora (universidad/año, posgrado, registro, años de
>    experiencia) → `app/sobre-mi/page.tsx`, `TrustBar`, `personSchema()`.
> 3. Horarios reales → `SITE_CONFIG.horarios` (+ /contacto y schema).
> 4. URL de embed de Google Maps → `SITE_CONFIG.googleMapsEmbed` + coords geo.
> 5. Crear contenedor GTM → sustituir `GTM-XXXXXXX` en `lib/constants.ts`.
> 6. Validación clínica del copy por la doctora (lista de afirmaciones en la
>    memoria del proyecto).
> 7. Google Business Profile (pesa más que la web para el pack local).
> 8. Blog: ≥3 artículos → quitar noindex y añadir al sitemap.
> 9. Tras el deploy público: Rich Results Test (JSON-LD) y Search Console.

## Sesión 8 — Motion pass + Header (insertada)
**Objetivo:** devolver personalidad de movimiento sin regresar el rendimiento de la
Sesión 7 (el Reveal no anima nada en el viewport inicial → el hero se veía estático).
> ✅ **Completada (2026-07-18).**
> - **Entrada above-the-fold por CSS puro** (`styles/globals.css`): keyframes `enter-up`
>   (opacity+translate), `enter-shift` (SOLO translate — para candidatos a LCP: el span
>   8xl del titular y el retrato; un elemento con opacity:0 no pinta y retrasaría el
>   LCP) y `enter-fade`; delay por elemento vía `--enter-delay` (utilities
>   `[--enter-delay:...ms]`). Los keyframes usan la propiedad individual `translate`
>   (no `transform`) para no pisar los rotate/translate de Tailwind al terminar
>   (fill-mode both). Cascada en el Hero: eyebrow → titular fragmentado → foto →
>   descripción → CTAs → chip → meta vertical → watermark "ver". El bloque global de
>   reduced-motion ahora anula también `animation-delay`/`transition-delay` (sin eso,
>   `both` + delay dejaba contenido invisible durante el delay).
> - **Reveal enriquecido** (`ui/Reveal.tsx`): prop `from="up"|"left"|"right"`
>   (desplazamiento lateral sutil, la opacidad hace el trabajo) y stagger con curva
>   (`{each:0.12, ease:"power1.in"}`). Regla del viewport inicial INTACTA. Aplicado con
>   intención compositiva: AboutPreview (retrato desde la derecha, tarjeta desde la
>   izquierda), ContactSection (tarjeta izq / FAQ der), ServiceLanding (01 y 02 según
>   `flip`).
> - **Header** (`layout/Header.tsx`): indicador de página activa (usePathname +
>   `aria-current="page"`, subrayado lima fijo; hover con subrayado que crece desde la
>   izquierda); scroll-aware SIN CLS (la altura no cambia: gana fondo sólido/sombra/
>   borde y el logo se compacta por `transform: scale(.9)`); CTA rediseñado como
>   píldora navy con iris lima cuya pupila "parpadea" (scale-y) al hover — eco del
>   logo ojo, texto crema sobre navy (AA); menú móvil ahora es overlay `absolute top-full`
>   (no empuja layout) con transición opacity+translate+visibility, cascada de links por
>   transition-delay e `inert` cuando está cerrado (Escape/scroll-lock/aria intactos).
> - **FAQAccordion:** apertura animada con `grid-template-rows 0fr→1fr` + fade;
>   `inert` sustituye a `hidden` (mismo efecto para lectores/tab-order, permite
>   transición).
> - **Verificación:** `npm run lint` + `npm run build` (export) ✅. QA Playwright sobre
>   `out/` (dwell ≥250ms): entrada del hero anima de verdad (muestreo forzando frames:
>   watermark 0→1 escalonado, titular 16px→0) y termina todo en opacity 1; reveals
>   disparan al scroll (0 contenido oculto); **CLS medido 0** scrolleando en 1440 y 390;
>   menú móvil abre/cierra con `inert`+scroll-lock correctos; reduced-motion: 0
>   animaciones y 0 oculto; overflow-x 0. Screenshots `qa-screenshots/s8-*` (header
>   top/scrolled 1440 y 390, hero, menú, FAQ); "antes" = `s7-home-desktop/mobile.png`.
> - **Lighthouse local (out/ servido, mediana de 2 runs, antes → después):**
>   Desktop Perf 95 → 94 (jitter; LCP 1.5→1.5-1.7s), Móvil Perf 73 → 72.5 (LCP simulado
>   slow-4G 7.8→7.8s), **A11y 100, BP 100, CLS 0 y TBT ≤20ms en todos los runs**.
>   Sin regresión: las diferencias están dentro de la varianza run-a-run.
> - **Gotcha QA nuevo:** en ventana ocluida las animaciones CSS quedan *pending* (sin
>   frames de render no aplican su efecto y getComputedStyle da el valor base);
>   `page.screenshot()` fuerza un frame — para muestrear una animación CSS en vuelo,
>   intercalar screenshots. No afecta a usuarios reales.
>
> **Adenda (2026-07-20) — restyle del header con más carácter** (a petición de Ulises,
> tras aprobar el detalle del guiño del CTA): el header pasa a **barra flotante tipo
> píldora** (`layout/Header.tsx`). Arriba del todo es transparente y aéreo; al scrollear
> (o con el menú móvil abierto) la barra interior se despega de los bordes ganando
> superficie `bg-cream/85`, `shadow-lift`, `ring` hairline y `rounded-2xl` (blur). La
> **altura total del header es CONSTANTE** entre estados: el gutter vertical/horizontal
> está siempre reservado y solo cambian background/shadow/ring/radius/transform/color →
> **CLS medido 0** (1440). Nav links con tracking editorial, micro-lift al hover y el
> subrayado lima que crece desde la izquierda (activo fijo + `aria-current`). CTA: se
> mantiene el guiño del ojo (pupila `scale-y` al hover) + iris que crece un pelo y label
> que se desliza. Menú móvil = tarjeta `rounded-2xl` flotante coherente con la píldora
> (`inert`/scroll-lock/Escape intactos). `npm run lint` + `build` (export) ✅; QA
> Playwright: header top/scrolled 1440 y menú móvil 390 verificados, CLS 0, 0 errores de
> consola. El LOGO se mantiene (solo `scale-95` por transform al scrollear).
>
> **Adenda (2026-07-20) — REVERTIDA el mismo día.** El cambio de tipografías descrito
> abajo se implementó y luego se DESHIZO por decisión de Ulises (no le convenció): el
> sitio vuelve a **Fraunces (serif, h1/h2) + Plus Jakarta Sans (UI: h3-h6/eyebrows/nav) +
> Inter (cuerpo)** vía `next/font/google`, con la **Fraunces itálica como familia
> separada** (`--font-fraunces-italic` / `--font-display-italic`) para
> `.accent-word`/`.watermark`/`.section-index` y los `font-display italic` de
> Hero/TrustBar/ServiceCard/ServiceLanding/sobre-mi. Anti-CLS de la Sesión 7 intacta:
> exactamente **2 woff2 preloaded** (Fraunces normal + Inter); Plus Jakarta y la itálica
> van `preload:false` + `display:"optional"`. Se borraron los woff2 de Quicksand/Pilcrow y
> `src/fonts/`. Verificado (2026-07-20): `lint` + `build` (export) ✅, 2 woff2 preloaded, 0
> refs a Quicksand/Pilcrow ni a Google Fonts, **CLS 0** y 0 errores de consola en home
> (1440/390) y landing estrabismo; `.accent-word` vuelve a ser itálica Fraunces real
> (screenshots `qa-screenshots/revert-*`). El restyle del header (barra flotante píldora)
> se conservó. **Todo el sitio (Sesiones 1–8 + header + este revert) quedó en UN commit en
> la rama `feat/sitio-ortoptika`** (sin push ni deploy). El texto original de la adenda se
> mantiene abajo solo como registro histórico de lo que se deshizo.
>
> **Adenda (2026-07-20) — cambio de tipografías** (a petición de Ulises): se retiran
> Fraunces (serif) + Plus Jakarta + Inter y se adoptan **dos familias variables locales**
> (`next/font/local`, woff2 en `src/fonts/`, ambas preloaded + `display:"swap"`):
> **Quicksand** (300–700) como PRINCIPAL para titulares display (h1/h2, `--font-display`)
> y **Pilcrow Rounded** (400–900) como SECUNDARIA para subtítulos/UI/eyebrows/nav
> (`--font-heading`) y cuerpo (`--font-body`). Ninguna tiene itálica: los acentos de marca
> (`.accent-word`/`.watermark`/`.section-index`) pasan a **Quicksand en recto** (color +
> peso como contraste, `font-style: normal` explícito porque `.accent-word` va en `<em>`);
> se quitó la utilidad `italic` de los `font-display` en Hero/TrustBar/ServiceCard/
> ServiceLanding/sobre-mi. Solo 2 woff2 críticos (~88KB) → se mantiene la estrategia
> anti-CLS de la Sesión 7 (de hecho se simplifica: sin familia itálica aparte). `lint` +
> `build` (export) ✅; preloads presentes en `out/`, 0 refs a Google Fonts, overflow-x 0 en
> 390, 0 errores de consola; QA visual en home/estrabismo 1440 y home 390. **Pendiente
> opcional:** `lib/og.tsx` (imágenes OG) sigue en Fraunces/Plus Jakarta — actualizar para
> coherencia requiere meter TTF/OTF de Quicksand+Pilcrow en `assets/og-fonts/`.

## Después del lanzamiento (fuera del alcance de código, para más adelante)
- Comprar dominio y apuntar a Vercel
- Crear y verificar Google Business Profile (pesa más que la web para el pack local)
- Sustituir placeholders por fotos reales de la doctora y el consultorio
- Confirmar horarios reales
- Escribir artículos de blog y quitar el noindex
- Validación clínica del copy por la doctora

---

## Cómo retomar en cada sesión
1. Leer este archivo y la memoria del proyecto.
2. Identificar la sesión en curso y su criterio de "hecho".
3. Al terminar, marcar avances aquí mismo (checklist o nota) antes de cerrar.
