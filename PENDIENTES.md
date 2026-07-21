# Pendientes — ortoptikaterapia.com

> Estado: **el código está terminado** (Sesiones 1–8). Lo que falta es data del mundo
> real y pasos de lanzamiento. El sitio corre en local (`pnpm run dev`) y está en
> GitHub; el deploy público espera al dominio.

---

## 🔴 Bloqueantes de lanzamiento

- [ ] **Comprar el dominio** `ortoptikaterapia.com` → recién ahí `vercel deploy --prod`
      (hoy solo hay staging protegido en Vercel, no público)
- [ ] **Datos reales de la doctora** (hoy son placeholders ⚠️ con borde punteado en
      `src/app/sobre-mi/page.tsx` y en el TrustBar):
  - [ ] Universidad y año del título de Optometría
  - [ ] Especialización/posgrado en Ortóptica y Terapia Visual (institución + año)
  - [ ] Colegiatura / registro profesional (entidad + número)
  - [ ] Años de experiencia (se usa en `/sobre-mi` y TrustBar "+X años")
  - [ ] Formación continua / cursos (opcional)
- [ ] **Horarios reales** de la clínica (hoy dicen "por confirmar" en `/contacto`)
- [ ] **Validación clínica del copy** por la doctora — las 5 landings de servicio
      (`src/lib/services-content.ts`) son **borrador**. Afirmaciones a revisar:
  - [ ] Estrabismo (endotropía/hipermetropía, intermitentes, diplopía súbita = urgencia)
  - [ ] Ambliopía (corrección → oclusión → terapia; plasticidad en adultos)
  - [ ] Terapia visual (insuficiencia de convergencia con evidencia CITT; NO trata dislexia/TDAH)
  - [ ] Visión binocular (4 disfunciones; prismas)
  - [ ] Optometría pediátrica (calendario de exámenes; miopía/pantallas; dilatación)

## 🟡 SEO / analítica

- [ ] **URL de embed de Google Maps** → pegar en `SITE_CONFIG.googleMapsEmbed`
      (`src/lib/constants.ts`; el iframe de `/contacto` se activa solo)
- [ ] **Coordenadas lat/lng** para el `geo` del schema MedicalBusiness (`src/lib/schema.ts`)
- [ ] **ID de Google Tag Manager** → reemplazar `GTM-XXXXXXX` en `src/lib/constants.ts`
      (mientras siga el placeholder, el layout no inyecta nada)
- [ ] **Crear Google Business Profile** (clave para SEO local en Ibagué)
- [ ] Al confirmar credenciales → añadir `alumniOf` y `hasCredential` a `personSchema()`
      en `src/lib/schema.ts` (hoy omitidos a propósito para no inventar)

## 🟢 Contenido (autoridad SEO nacional)

- [ ] **Blog: escribir ≥3 artículos** y quitar el `noindex`. Ya hay 8 títulos
      redactados en `PLAN-DESARROLLO.md`. (Único ítem accionable sin depender de terceros.)

## ⚪ Verificación final (con dominio ya comprado)

- [ ] Correr **Rich Results Test** de Google (requiere URL pública) para validar el JSON-LD
- [ ] `vercel deploy --prod` + añadir el dominio custom al proyecto Vercel

---

_Notas de operación: gestor de paquetes = **pnpm** (no correr `npm install`).
Repo: https://github.com/ulisesuarezv/ortoptika. Detalle de placeholders y decisiones
técnicas en `PLAN-DESARROLLO.md`._
