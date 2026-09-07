# Pendientes — ortoptikaterapia.com

> Estado: **dominio comprado** y **credenciales/horarios reales ya en el código**
> (sesión 9: respuestas de la doctora en `Ortoptika-Preguntas-Doctora.docx`).
> Lo que falta ahora es sobre todo material (fotos/video/testimonios) y
> aprobación de textos clínicos — ya no bloquea nada de programación.

---

## 🔴 Bloqueantes de lanzamiento

- [x] ~~Comprar el dominio `ortoptikaterapia.com`~~ → **comprado**. Falta
      `vercel deploy --prod` + añadir el dominio custom al proyecto Vercel.
- [x] ~~Datos reales de la doctora~~ → **cargados** en
      `src/lib/constants.ts` (`SITE_CONFIG.credenciales`) y reflejados en
      `/sobre-mi`, TrustBar y JSON-LD (`alumniOf`/`hasCredential` en
      `src/lib/schema.ts`). Nota: por pedido explícito de la doctora **no se
      publica su número de cédula/ReTHUS**, solo el registro 1368 CTNPO.
- [x] ~~Horarios reales~~ → **cargados** (`SITE_CONFIG.horarios`): martes a
      jueves, 8:00–12:00 y 14:00–18:00. Lunes, viernes y fin de semana
      cerrado. Reflejado en `/contacto`, `ContactSection` y
      `openingHoursSpecification` del schema.
- [ ] **Validación clínica del copy** por la doctora — sigue **pendiente**
      (ella no respondió los puntos 2.5/2.6 del cuestionario). Las 5 landings
      de servicio (`src/lib/services-content.ts`) siguen siendo **borrador**.
      Decisión: dejarlas así y pedirle que las revise antes de ir a
      producción — puntos críticos a confirmar:
  - [ ] Estrabismo (endotropía/hipermetropía, intermitentes, diplopía súbita = urgencia)
  - [ ] Ambliopía (corrección → oclusión → terapia; plasticidad en adultos)
  - [ ] Terapia visual — evidencia CITT en insuficiencia de convergencia; disclaimer TDAH/dislexia
  - [ ] Visión binocular (4 disfunciones; prismas)
  - [ ] Optometría pediátrica (calendario de exámenes; norma colombiana)
  - [ ] ¿Faltan o sobran servicios de los 5 actuales? (sin respuesta)

## 🟡 SEO / analítica

- [x] ~~URL de embed de Google Maps~~ → **cargada** en
      `SITE_CONFIG.googleMapsEmbed`, construida desde el CID de la ficha
      (`10961633092813368645`) para que el pin salga rotulado con el nombre
      del negocio. El iframe de `/contacto` ya la usa.
- [x] ~~Coordenadas lat/lng~~ → **4.4252077, -75.1763545** (verificadas en el
      pin real de Maps). Ya salen en el `geo` del MedicalBusiness, junto con
      `hasMap`.
- [x] ~~ID de Google Tag Manager~~ → **`GTM-K829BB3C`** cargado en
      `SITE_CONFIG.gtmId`. El guard `hasRealGtmId()` ya deja pasar la
      inyección; contenedor creado el 7-sep-2026. Falta publicar etiquetas
      dentro de GTM (p. ej. GA4) desde su interfaz, no desde el código.
- [~] **Google Business Profile** — ficha ya creada (`Ortoptika Terapia`,
      Cra 12 sur #93-21, Ibagué). Falta terminar de completarla: descripción,
      categorías, horario, fotos y verificación.
- [ ] **URL de Facebook** — confirmó que lo usa activo, pero no dio el
      enlace (`SITE_CONFIG.social.facebook` queda en `null` hasta tenerlo)

## 🟢 Contenido (autoridad SEO nacional)

- [ ] **Blog: escribir ≥3 artículos** y quitar el `noindex`. Ya hay 8 títulos
      redactados en `PLAN-DESARROLLO.md`.

## 🟣 Fotografía y video (lo que más cambia el resultado visual)

> **7-sep-2026: llegaron las 6 primeras fotos.** Análisis, encuadres, uso por
> sección y fases de implementación en **`PLAN-FOTOGRAFIA.md`**. Originales
> (orientación ya corregida) en `assets/fotos-originales/`, carpeta
> gitignorada porque el repo es público y hay menores y pacientes visibles.

- [x] ~~6–10 fotos del consultorio y equipos~~ → **6 recibidas**: sala de
      terapia completa, bodegón de instrumentos, sinoptóforo recortado con
      alpha, doctora atendiendo y dos de niños en sesión.
- [ ] **Autorizaciones de uso de imagen firmadas** — las fotos ya están
      montadas; las firmas deben existir antes de que el sitio salga a
      producción (una por paciente; por acudiente si es menor).
- [ ] Faltan aún: fachada de la clínica, la doctora sola en plano medio
      horizontal, detalle de lámpara de hendidura, y una horizontal limpia
      para la imagen `og:` de redes.
- [x] ~~Montar las fotos en el sitio~~ → **hecho**: las 6 están publicadas
      (banda a sangre del consultorio en la home y en Terapia Visual, doctora
      en consulta en «Sobre mí», instrumental en `/sobre-mi` y Visión
      Binocular, sinoptóforo recortado en la portada de Estrabismo, y las dos
      sesiones infantiles en Ambliopía y Optometría Pediátrica). Pipeline en
      `scripts/optimize-photos.mjs`, componente `ui/Photo.tsx`.
- [ ] 🔴 **Recoger las autorizaciones firmadas antes del `deploy --prod`** —
      formatos listos en `docs-doctora/3-Autorizacion-uso-de-imagen-Ortoptika.pdf`
      (Formato A para los dos adultos, Formato B para los dos menores).
- [ ] Video corto (30–60s) de presentación
- [ ] Logo en vectorial (SVG/AI/PDF) + versión para fondo oscuro
- [ ] 3–5 testimonios de pacientes (con autorización escrita; nunca de
      menores reconocibles)

## ⚪ Verificación final (con dominio ya comprado)

- [ ] Correr **Rich Results Test** de Google para validar el JSON-LD ampliado
- [ ] `vercel deploy --prod` + dominio custom en el proyecto Vercel
- [ ] Configurar `contacto@ortoptikaterapia.com` (hoy el sitio usa el Gmail
      de la doctora, `ortoptika.2020@gmail.com`, como respaldo de WhatsApp)

## 🎨 Diseño (rediseño de motion — EN CURSO, no confundir con el rediseño
      visual de Sesiones 3.5/3.6 de `PLAN-DESARROLLO.md`, ya cerrado)

> ⚠️ Esta ronda usa su PROPIA numeración de "Sesión 1/2/3…" en el chat,
> independiente de las Sesiones 1–8 de `PLAN-DESARROLLO.md` (ese doc ya
> tiene su propia "Sesión 8 — Motion pass + Header", completada en julio).
> No están en `PLAN-DESARROLLO.md` todavía — ver commit `fe8b782` y memoria
> `ortoptika-motion-rediseno` para el detalle real de qué se hizo.

- [x] Sesión 1 — sistema de motion global: `PageTransition`, `CustomCursor`
      (variantes link/media), hook `useMagnetic` (en `Button`).
- [x] Sesión 2 — Hero con entrada palabra por palabra + cortina de marca.
- [x] Sesión 3 — motion en ServicesGrid/AboutPreview/ContactSection (`Reveal`
      gana prop `scale`), limpieza de comentarios obsoletos en `/sobre-mi`.
- [x] Sesión 4 — Header (botón de menú móvil magnético) y Footer (`Reveal`/
      `Parallax` en las secciones, CTA de WhatsApp magnético vía el nuevo
      `ui/MagneticLink.tsx`). Ver memoria `ortoptika-motion-rediseno` para el
      detalle y el porqué del componente nuevo (mantiene Footer como Server
      Component).
- [ ] Verificación real de navegador AÚN PENDIENTE (Sesiones 3 y 4): la
      herramienta de automatización usada en ambas sesiones tuvo el viewport
      fijo <1024px y la pestaña en segundo plano (rAF congelado), así que
      falta confirmar con un navegador real y en foco:
  - [ ] Breakpoint `lg` (≥1024px): rotación de la tarjeta 5 de ServicesGrid,
        grid de 4 columnas del TrustBar, offset `lg:-translate-y-4
        lg:translate-x-4` del CTA del Footer.
  - [ ] `prefers-reduced-motion: reduce` real (DevTools o SO).
  - [ ] `PageTransition` completa (el "parpadeo" entre páginas) navegando
        por los links del Header/Footer — no se pudo verificar de punta a
        punta por el rAF congelado.
      Paleta actual (azul profundo, verde lima, navy) ya confirmada por la
      doctora, sin cambios — este rediseño de motion no la toca.

---

_Notas de operación: gestor de paquetes = **pnpm** (no correr `npm install`).
Repo: https://github.com/ulisesuarezv/ortoptika. Detalle de placeholders y
decisiones técnicas en `PLAN-DESARROLLO.md`. Respuestas completas de la
doctora en `~/Downloads/Ortoptika-Preguntas-Doctora (2).docx`._
