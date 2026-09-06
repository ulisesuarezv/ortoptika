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

- [ ] **URL de embed de Google Maps** → pegar en `SITE_CONFIG.googleMapsEmbed`
      (la doctora no dio el enlace del pin ni las referencias de cómo llegar)
- [ ] **Coordenadas lat/lng** para el `geo` del schema MedicalBusiness
- [ ] **ID de Google Tag Manager** → sigue como placeholder `GTM-XXXXXXX`
- [ ] **Crear Google Business Profile** (ella no lo tiene; confirmó que no
      está en Doctoralia ni la menciona la web de Medicadiz)
- [ ] **URL de Facebook** — confirmó que lo usa activo, pero no dio el
      enlace (`SITE_CONFIG.social.facebook` queda en `null` hasta tenerlo)

## 🟢 Contenido (autoridad SEO nacional)

- [ ] **Blog: escribir ≥3 artículos** y quitar el `noindex`. Ya hay 8 títulos
      redactados en `PLAN-DESARROLLO.md`.

## 🟣 Fotografía y video (lo que más cambia el resultado visual)

Ninguno de estos puntos fue respondido en el cuestionario — sigue en cero:

- [ ] 6–10 fotos del consultorio y equipos (horizontales, luz natural)
- [ ] Fotos de la doctora trabajando (lámpara de hendidura, sesión de terapia)
- [ ] Video corto (30–60s) de presentación
- [ ] Logo en vectorial (SVG/AI/PDF) + versión para fondo oscuro
- [ ] 3–5 testimonios de pacientes (con autorización escrita; nunca de
      menores reconocibles)

## ⚪ Verificación final (con dominio ya comprado)

- [ ] Correr **Rich Results Test** de Google para validar el JSON-LD ampliado
- [ ] `vercel deploy --prod` + dominio custom en el proyecto Vercel
- [ ] Configurar `contacto@ortoptikaterapia.com` (hoy el sitio usa el Gmail
      de la doctora, `ortoptika.2020@gmail.com`, como respaldo de WhatsApp)

## 🎨 Diseño

- [ ] Sesión(es) dedicada(s) al diseño visual — pendiente de agendar,
      pedido explícito de Ulises (no urgente, en paralelo a lo anterior).
      Paleta actual (azul profundo, verde lima, navy) ya confirmada por la
      doctora, sin cambios.

---

_Notas de operación: gestor de paquetes = **pnpm** (no correr `npm install`).
Repo: https://github.com/ulisesuarezv/ortoptika. Detalle de placeholders y
decisiones técnicas en `PLAN-DESARROLLO.md`. Respuestas completas de la
doctora en `~/Downloads/Ortoptika-Preguntas-Doctora (2).docx`._
