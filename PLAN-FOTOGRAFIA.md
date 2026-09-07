# Fotografía del sitio — ortoptikaterapia.com

> Estado: **implementado (7-sep-2026)**. Las seis primeras fotos reales del
> consultorio están montadas, con sus recortes, su componente y su pipeline.
> Lo único abierto son las **autorizaciones firmadas** de las cuatro fotos con
> personas, que deben existir antes del `deploy --prod`. No confundir con la
> ronda de motion (Sesiones 1–4) ni con las Sesiones 1–8 de
> `PLAN-DESARROLLO.md`.

Hasta ahora el sitio tenía **una sola foto real**: el retrato de la doctora,
en Hero, AboutPreview y `/sobre-mi`. Todo lo demás era ilustración generada
(`Backdrop`) o el `img-placeholder` punteado. Estas seis fotos son la primera
capa fotográfica real del sitio.

---

## 0. Los originales

Están en **`assets/fotos-originales/`**, con la orientación corregida: cuatro
venían rotados y sin metadato EXIF, así que el navegador los habría mostrado
tumbados.

| Archivo | Rotación aplicada | Resultado |
|---|---|---|
| `01-nino-vasos-color.png` | +90° | 1500×2000 vertical |
| `02-sinoptoforo-recorte.png` | ninguna | 2000×1500 **con alfa** |
| `03-doctora-paciente-tarjetas.jpg` | +90° | 1500×2000 vertical |
| `04-instrumentos-bodegon.png` | ninguna | 2000×1500 horizontal |
| `05-nino-tabla-numeros.jpg` | +90° | 1500×2000 vertical |
| `06-sala-terapia.jpg` | **180°** | 2000×1500 horizontal |

**Esa carpeta está en `.gitignore` a propósito.** El repo es público: los
full-res con caras no se suben; sólo se publican los derivados de
`public/images/fotos/`, que es lo que el sitio consume.

---

## 1. Autorizaciones: lo único pendiente

Cuatro de las seis fotos muestran personas identificables. En Colombia
(Ley 1581 de 2012 y Decreto 1377 de 2013) publicar la imagen de un paciente
exige **autorización previa, expresa e informada**, y si es menor de edad, la
de quien ejerce la patria potestad.

| Foto | Personas | Formato que necesita |
|---|---|---|
| 06 sala de terapia | ninguna | — |
| 04 instrumental | ninguna | — |
| 02 sinoptóforo | adulto | A |
| 03 doctora + paciente | adulto mayor | A |
| 01 niño / vasos | menor | B |
| 05 niño / secuencias | menor | B |

**Decisión (7-sep-2026):** se implementaron las seis fotos completas, sin
esperar a los papeles y sin recortar caras. Las firmas se recogen en paralelo
con los formatos de `docs-doctora/3-Autorizacion-uso-de-imagen-Ortoptika.pdf`,
que incluye el instructivo y la tabla de qué foto necesita cuál. El sitio
**aún no está en producción**, así que la ventana para recogerlas es
exactamente esa: antes del `deploy --prod`.

---

## 2. Por qué se eligió cada una

**06 · Sala de terapia** — la más valiosa del lote. Plano general del gimnasio
visual, con el tapete puzzle **azul/lima que es literalmente la paleta de
marca**, balón, minitrampolín, tabla KITP, cuerda de Brock y panel LED.
Responde la objeción silenciosa de todo paciente nuevo: *"¿esto es un
consultorio de verdad o un cuarto con una silla?"*. Ninguna ilustración
sustituye eso, y por eso es la que va a sangre.

**04 · Instrumental** — la más versátil. Prismas, gafa de prueba, flippers,
regla RAF y transiluminador, con **el mug del logo dentro del encuadre**:
firma de marca en la propia foto. Es "producto" en el buen sentido —
instrumental serio sin resultar frío.

**02 · Sinoptóforo** — el mayor golpe visual, y el único que llega **con canal
alfa ya recortado**. Eso cambia su uso por completo: no necesita marco, flota
sobre el crema y sangra por el borde. Un sinoptóforo es el objeto más icónico
y menos conocido de la ortóptica; nadie sabe qué es, y por eso detiene el
scroll.

**03 · Doctora en consulta** — la única que muestra el **acto de atender**.
Como el Hero ya establece su cara con el retrato, aquí interesa más verla
trabajando: en el bloque «Sobre mí» tiene contexto real y resulta más creíble
que un recorte sobre fondo plano.

**01 y 05 · Niños en sesión** — las que convierten. Le dicen a una madre
*"aquí saben tratar a mi hijo"*. Ambas están tomadas desde atrás y arriba, lo
que además las hace menos invasivas de lo que sugiere el plano.

---

## 3. Encuadres ejecutados

Los aplica `scripts/optimize-photos.mjs` sobre el original, **antes** de
escalar, para fijar la composición y no depender del aspecto de la cámara.

| Salida | Origen | Recorte | Aspecto | Peso |
|---|---|---|---|---|
| `sala-terapia` | 06 | baja el techo, suelta el borde inferior | 16:9 | 103 KB / 36 KB |
| `instrumentos` | 04 | conserva el tercio izquierdo (mug con logo) | 3:2 | 69 KB / 26 KB |
| `sinoptoforo` | 02 | sin recorte, alfa conservado | 4:3 | 113 KB / 48 KB |
| `doctora-consulta` | 03 | vertical | 4:5 | 64 KB / 31 KB |
| `sesion-vasos` | 01 | vertical | 4:5 | 45 KB / 20 KB |
| `sesion-secuencias` | 05 | vertical | 4:5 | 63 KB / 30 KB |

Dos pesos por fila: escritorio / móvil. Todos por debajo del presupuesto que
se fijó (120 KB la banda a sangre, 70 KB las de columna).

## 4. Pipeline técnico (restricción real del proyecto)

El sitio es **static export** (`output: "export"` en `next.config.ts`) con
`images.unoptimized`. Eso significa que **`next/image` no optimiza nada en
build**: cada archivo se sirve tal cual se deja en `public/`. Todo el trabajo
de compresión hay que hacerlo antes, igual que se hizo con la marca.

- `scripts/optimize-photos.mjs`, gemelo de
  `scripts/optimize-brand-assets.mjs`: lee `assets/fotos-originales/`, aplica
  recorte + resize y escribe WebP en `public/images/fotos/`.
- **Dos anchos por foto**, como ya hace el Hero: `-sm` (640px, para móvil) y
  el completo (1600px full-bleed / 1200px media columna), servidos con
  `<picture>` + `<source media="(max-width: 640px)">`.
- Calidad 80–82 en WebP. Objetivo: **< 120 KB** la full-bleed, < 70 KB las de
  columna. Hoy la página más pesada del sitio no llega a 300 KB; estas fotos
  no pueden triplicarla.
- `loading="lazy"` + `decoding="async"` en todo lo que no esté sobre el
  pliegue; la banda de la sala va `lazy` (está a media página).
- `alt` descriptivo y clínico, no decorativo ("Gimnasio visual del
  consultorio: tapete de equilibrio, minitrampolín y tabla de letras"), que
  además alimenta el SEO de imágenes.

**Gotcha del proyecto a respetar:** cuando una foto lleve rotación o desfase
estático de Tailwind (`rotate-*`, `translate-*`) **y** animación de entrada,
tienen que vivir en **dos nodos DOM distintos** — GSAP fija `rotate: none` /
`translate: none` inline sobre el nodo que anima y mata la clase de Tailwind
para siempre. Ya nos mordió en `ServicesGrid` y `TrustBar`.

---

## 5. El componente

`src/components/ui/Photo.tsx` — server component, sin estado:

- Emite el `<picture>` con los dos anchos y el `alt` obligatorio.
- Props: `variant` (`"frame" | "bleed" | "cutout"`), `aspect`, `caption?`.
- `frame` reutiliza la clase `.photo-frame` existente (el gradiente de marca
  que se ve mientras carga la imagen sirve de placeholder sin CLS).
- `cutout` no pinta marco ni fondo: es para el sinoptóforo con alpha.
- El hover y la entrada los ponen los wrappers cliente ya existentes
  (`Reveal`, `Parallax`), no este componente — así `Photo` no arrastra
  `use client` a las páginas que lo usen.

---

## 6. Dónde quedó cada foto

| Foto | Ubicación | Tratamiento |
|---|---|---|
| Sala de terapia | Home, banda a sangre entre «Sobre mí» y contacto | `bleed` + `Parallax` 12, velo lateral navy, texto encima |
| Sala de terapia | `/servicios/terapia-visual`, banda antes de «Proceso» | `bleed` + `Parallax` 12, sin texto |
| Doctora en consulta | Home, bloque «Sobre mí» | `frame` en blob orgánico, pie al hover |
| Instrumental | `/sobre-mi`, dentro de «Cómo trabajo» | `frame` 21:9 en `lg`, corte editorial |
| Instrumental | `/servicios/vision-binocular`, columna de «Proceso» | `frame` 3:2 sticky |
| Sinoptóforo | `/servicios/estrabismo`, portada | `cutout` con alfa, sangra por la derecha, `Parallax` 20 |
| Niño / vasos | `/servicios/ambliopia`, columna de «Proceso» | `frame` 4:5 sticky |
| Niño / secuencias | `/servicios/optometria-pediatrica`, columna de «Proceso» | `frame` 4:5 sticky |

`/contacto` se dejó sin foto a propósito: ya tiene el mapa real, y meterle una
séptima aparición del mismo material sólo diluye. Cuando llegue la foto de
fachada, ese es su sitio natural.

Dos fotos aparecen dos veces (sala e instrumental), en páginas distantes entre
sí. Es deliberado: con seis fotos y ocho ranuras, repetir en páginas que nadie
ve seguidas cuesta menos que dejar secciones sin fotografía.

## 7. Lo que sigue pendiente

1. **Autorizaciones firmadas** de las cuatro fotos con personas — formatos
   listos en `docs-doctora/3-Autorizacion-uso-de-imagen-Ortoptika.pdf`.
   Bloquea el `deploy --prod`, no el desarrollo.
2. Fotos que ninguna de estas seis cubre:
   - fachada / entrada de la Clínica Medicadiz (para «cómo llegar» y Google)
   - la doctora sola en el consultorio, plano medio horizontal
   - detalle de lámpara de hendidura o autorrefractómetro
   - una horizontal limpia para la imagen `og:` de redes
3. **Logo en vectorial** (SVG/AI/PDF), que sigue limitando la nitidez de la marca.
