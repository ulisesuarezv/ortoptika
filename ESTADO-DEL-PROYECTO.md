# Estado del proyecto — ortoptikaterapia.com

> **Punto de entrada para una sesión nueva.** Última actualización: 7-sep-2026.
> El sitio está **en producción** en https://ortoptikaterapia.com (el apex;
> `www` redirige ahí). Este documento dice dónde está todo, qué falta y qué
> no hay que romper. Los otros tres documentos del repo
> (`PLAN-DESARROLLO.md`, `PENDIENTES.md`, `PLAN-FOTOGRAFIA.md`) siguen siendo
> válidos: este los indexa, no los sustituye.

---

## 1. Qué es esto

Sitio de **Ortoptika Terapia**, consultorio de ortóptica y terapia visual de la
optómetra Yeimmy Paola Barragan, en la Clínica Medicadiz – Sede Samaria de
Ibagué (Tolima). Objetivo comercial: que la encuentren pacientes de Ibagué
**y de toda Colombia** — la ortóptica es un servicio escaso en el país y ella
atiende sólo presencialmente, así que la estrategia SEO tiene dos capas
(local + nacional). Canal único de conversión: **WhatsApp**, sin formularios.

**En producción:** https://ortoptikaterapia.com

## 2. Stack y reglas que no se negocian

| | |
|---|---|
| Framework | Next.js 16 App Router, **`output: "export"`** (estático) |
| Estilos | Tailwind v4 |
| Motion | GSAP + ScrollTrigger, siempre dentro de `Reveal` / `Parallax` |
| Gestor | **pnpm** — nunca `npm install` |
| Hosting | Vercel, proyecto `ortoptika`, plan Hobby |

**Reglas del proyecto, aprendidas a golpes:**

1. **No marcar páginas ni secciones enteras como `use client`.** La animación
   vive en wrappers cliente aislados (`Reveal`, `Parallax`, `MagneticLink`);
   las páginas siguen siendo Server Components.
2. **Static export ⇒ `images.unoptimized`.** `next/image` **no optimiza nada**
   en build. Toda imagen pasa por un script con sharp
   (`scripts/optimize-photos.mjs`, `scripts/optimize-brand-assets.mjs`) y se
   sirve con `<picture>` en dos anchos.
3. **Rotación/offset estático de Tailwind y animación GSAP nunca en el mismo
   nodo DOM.** GSAP fija `rotate: none` / `translate: none` inline sobre el
   nodo que anima y mata la clase de Tailwind para siempre. Si un elemento
   necesita las dos cosas, van en dos nodos anidados.
4. **Nada de datos inventados.** Si un dato no está confirmado, se **omite**
   del JSON-LD en vez de aproximarse. Un schema incompleto es mejor que uno
   falso.
5. **No se publica la cédula/ReTHUS de la doctora.** Sólo el registro
   profesional 1368 CTNPO, por pedido explícito suyo.

## 3. Mapa del repo

```
src/lib/constants.ts        FUENTE DE VERDAD: contacto, dirección, horarios,
                            credenciales, GTM, redes, Maps. Empieza por aquí.
src/lib/services-content.ts Todo el copy de las 5 landings (~7.700 palabras)
src/lib/photos.ts           Registro de fotos: src, alt, pie, flag `personas`
src/lib/schema.ts           JSON-LD (MedicalBusiness + Person)
src/lib/metadata.ts         Helper de <title>/description/canonical/OG
src/components/ui/          Photo, Reveal, Parallax, Button, Backdrop…
src/components/sections/    Hero, ServicesGrid, AboutPreview, ConsultorioBand…
src/components/services/    ServiceLanding: plantilla única de las 5 landings
scripts/                    Generación de iconos y optimización de imágenes
assets/fotos-originales/    Originales full-res — GITIGNOREADO (hay pacientes)
docs-doctora/               PDFs para la doctora — GITIGNOREADO
```

**Carpetas ignoradas a propósito, no las subas:** `assets/fotos-originales/`
(el repo es público y hay menores y pacientes identificables) y
`docs-doctora/` (documentos comerciales y precios).

## 4. Infraestructura

- **Dominio:** registrado en **Hostinger**, DNS apuntando a Vercel. El
  **apex `ortoptikaterapia.com` es el principal**; `www` redirige a él (308).
  Coincide con `SITE_CONFIG.url`, canonical, sitemap y JSON-LD.
- **Deploy:** `main` está conectada. **Cada push a `main` publica en
  producción** en ~30 s, sin promover nada a mano. Trabajo que no deba verse
  todavía va en rama aparte.
- **Ojo:** en plan Hobby la protección de Vercel cubre *previews*, **no
  producción**. Todo lo que llegue a `main` es público de inmediato.
- **Analítica:** GTM `GTM-K829BB3C` en `SITE_CONFIG.gtmId`, con GA4 conectado
  dentro de GTM y verificado en Tiempo real. El `G-…` vive en GTM, no en el
  repo: para tocar etiquetas se entra a tagmanager.google.com, no al código.
- **Google Business:** ficha creada (`Ortoptika Terapia`, CID
  `10961633092813368645`). El mapa de `/contacto` y el `geo`/`hasMap` del
  JSON-LD salen de ahí.

## 5. Qué hay construido

8 páginas: home, `/sobre-mi`, `/contacto`, `/blog` (con `noindex` hasta tener
3 artículos), 404 y 5 landings de servicio (estrabismo, ambliopía, terapia
visual, visión binocular, optometría pediátrica).

Fotografía real en 8 ubicaciones — reparto completo en `PLAN-FOTOGRAFIA.md §6`.

## 6. Auditoría del 7-sep-2026

Revisión palabra por palabra de las 8 páginas más una pasada técnica sobre el
export estático.

**Limpio:**
- 1 solo `<h1>` por página; **cero imágenes sin `alt`**
- **Cero enlaces internos rotos**
- `lang="es"`, canonical y OG en todas; sitemap con las 8 URLs indexables
- `/blog` correctamente en `noindex, follow`
- Copy clínico sin erratas y bien cubierto: nada promete resultados, hay
  criterios de derivación explícitos y un desmentido claro sobre dislexia/TDAH

**Responsive** — 9 páginas × 5 anchos (320 / 390 / 768 / 1024 / 1280):
**cero desbordamiento horizontal**. Nav de escritorio bien oculta en móvil,
botón de menú 40×40, enlaces del menú móvil 44px, CTAs de 40 a 60px.

**Corregido en esta sesión** (commits `bd7e988` y `a1f8908`):
- Enlaces del footer a 28px de alto → 40px. Pasaban WCAG 2.5.8 (mínimo
  24px) pero se quedaban cortos para el pulgar en un sitio de tráfico
  mayoritariamente móvil.
- Las fotos de la sección «Proceso» usaban el titular de la sección como pie
  de foto, repetido justo debajo de ese mismo titular. En táctil el pie está
  siempre visible, así que se leía dos veces. Ahora cada foto tiene su pie
  propio en `photos.ts`.
- El 404 no declaraba descripción y heredaba la de la home.

## 7. Lo que queda — por prioridad

### 🔴 Bloqueantes reales

1. **Autorizaciones de uso de imagen.** Las 4 fotos con pacientes (dos de
   ellos menores) ya están publicadas **sin las firmas**. Formatos listos en
   `docs-doctora/3-Autorizacion-uso-de-imagen-Ortoptika.pdf`. Decisión tomada
   con el riesgo explicado; recogerlas es lo primero.
2. **Validación clínica del copy firmada.** Igual: el contenido ya está
   publicado. Documento en
   `docs-doctora/4-Validacion-clinica-del-contenido-Ortoptika.pdf`, con las 6
   afirmaciones citadas literalmente.
3. ~~Conflicto www / apex~~ → **RESUELTO el 7-sep-2026.** Se invirtió la
   redirección en Vercel: **`ortoptikaterapia.com` (apex) es ahora el dominio
   principal** y `www` redirige a él con 308, conservando ruta y query.
   Verificado: el apex sirve 200 y `www/servicios/estrabismo/` redirige a
   `ortoptikaterapia.com/servicios/estrabismo/`. Canonical, sitemap, JSON-LD y
   la ficha de Google apuntan ya todos al mismo sitio. **No se tocó código.**
   El flujo de datos de GA4 quedó declarado con la URL `www`: es sólo metadato
   del stream y no afecta a la medición.

### 🟡 Depende de la doctora

- **Logo en vectorial** (SVG/AI/PDF) — limita la nitidez de la marca
- **`contacto@ortoptikaterapia.com`** — hoy se publica su Gmail personal
- **Fotos que faltan:** fachada de la clínica (la necesita la ficha de
  Google), la doctora sola en plano medio horizontal, detalle de lámpara de
  hendidura, una horizontal limpia para `og:`, y el video de presentación
- **Testimonios** (3–5, con autorización escrita)
- **Terminar la ficha de Google Business:** descripción (ya redactada, ver
  historial), categorías, horario, fotos, verificación y **añadir la URL del
  sitio**, que ya existe

### ⚪ Trabajo nuestro, sin bloqueos

- **Blog: 3 artículos** para quitar el `noindex`. Hay 8 títulos redactados en
  `PLAN-DESARROLLO.md`. Es lo que más mueve la capa nacional de SEO.
- **Rich Results Test** de Google sobre la URL pública, para validar el JSON-LD
- **Meta titles y descriptions largos:** los 5 servicios tienen `<title>` de
  74–88 caracteres y descripciones de 196–221. Google trunca sobre 60 y ~155.
  No es un error, pero se pierde control de lo que se ve en el buscador.
- **Verificación de motion pendiente** desde las Sesiones 3–4 del rediseño:
  `prefers-reduced-motion: reduce` real y el `PageTransition` de punta a punta.
  El breakpoint `lg` ya quedó verificado en esta sesión.
- **`credenciales.aniosExperiencia: 22`** está hardcodeado y envejece solo.
  Convendría calcularlo desde el año de grado (2004).

## 8. El apellido va SIN tilde

**«Barragan», no «Barragán».** Confirmado por Ulises el 7-sep-2026. El sitio
ya lo publicaba bien; los cuatro PDF de `docs-doctora/` lo escribían con
tilde y se regeneraron corregidos. Si aparece con tilde en algo nuevo, es un
error.

## 9. Numeración de sesiones — cuidado

Hay **dos series de "Sesión N"** que se solapan y confunden:

- Las **Sesiones 1–8 de `PLAN-DESARROLLO.md`**: la construcción del sitio
  (jul–sep 2026), cerradas, incluida su propia «Sesión 8 — Motion pass».
- Las **Sesiones 1–4 del rediseño de motion** (sep 2026): otra ronda
  posterior e independiente, que reusó los mismos números en el chat y **no
  está en `PLAN-DESARROLLO.md`**. Su detalle real está en los commits
  `fe8b782` y `1c1244b`.

Si vuelves a numerar sesiones, di explícitamente a cuál serie te refieres.
