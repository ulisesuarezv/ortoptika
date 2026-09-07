# Plan de fotografía — ortoptikaterapia.com

> Estado: **material recibido y analizado (7-sep-2026)**. Este documento es el
> plan; la ejecución va en una sesión aparte. No confundir con la ronda de
> motion (Sesiones 1–4) ni con las Sesiones 1–8 de `PLAN-DESARROLLO.md`.

Hoy el sitio tiene **una sola foto real**: el retrato de la doctora
(`public/images/dra-yeimmy-barragan.webp`), usado en Hero, AboutPreview y
`/sobre-mi`. Todo lo demás es ilustración generada (`Backdrop`) o el
`img-placeholder` punteado. Estas 6 fotos son la primera capa fotográfica
real del sitio.

---

## 0. Lo que ya se hizo en esta sesión

Los 6 originales están en **`assets/fotos-originales/`**, con la orientación
corregida (cuatro venían rotados: sin metadato EXIF, el navegador los habría
mostrado tumbados).

| Archivo | Rotación aplicada | Formato final |
|---|---|---|
| `01-nino-vasos-color.png` | +90° | 1500×2000 vertical |
| `02-sinoptoforo-recorte.png` | ninguna | 2000×1500 **con alpha** |
| `03-doctora-paciente-tarjetas.jpg` | +90° | 1500×2000 vertical |
| `04-instrumentos-bodegon.png` | ninguna | 2000×1500 horizontal |
| `05-nino-tabla-numeros.jpg` | +90° | 1500×2000 vertical |
| `06-sala-terapia.jpg` | 180° | 2000×1500 horizontal |

**Esa carpeta está en `.gitignore` a propósito.** El repo es público y varias
de estas fotos muestran menores y pacientes identificables: al carpeta de
originales no se sube nada, y a `public/images/fotos/` sólo entran los
derivados que tengan autorización o que no muestren caras.

---

## 1. Bloqueante legal antes de publicar personas

Cuatro de las seis fotos muestran personas identificables. En Colombia
(Ley 1581 de 2012, habeas data) publicar la imagen de un paciente exige
**autorización escrita**, y si es menor de edad, la de quien ejerce la patria
potestad. Esto ya estaba anotado en `PENDIENTES.md` para los testimonios;
aplica igual a las fotos.

| Foto | Personas | ¿Se puede publicar hoy? |
|---|---|---|
| 04 instrumentos | ninguna | **Sí, sin fricción** |
| 06 sala de terapia | ninguna | **Sí, sin fricción** |
| 01 niño / vasos | menor, cara casi oculta | Sólo recortada (ver §3) |
| 05 niño / tabla | menor, perfil visible | Sólo recortada (ver §3) |
| 02 sinoptóforo | adulto, cara visible | Sólo recortada al equipo, o con autorización |
| 03 doctora + paciente | adulto mayor, perfil visible | Requiere autorización |

Por eso el plan se parte en dos fases: **Fase A no depende de nadie**, Fase B
espera papeles.

---

## 2. Análisis foto por foto

### 06 · Sala de terapia — **la más valiosa del lote**
Plano general del gimnasio visual: tapete puzzle **azul/lima que es
literalmente la paleta de marca**, balón de pilates, minitrampolín, tabla de
letras KITP, cuerda de Brock, espejo, panel LED. Sin personas, horizontal,
luz natural.

Es la foto que responde la objeción silenciosa de todo paciente nuevo:
*"¿esto es un consultorio de verdad o un cuarto con una silla?"*. Ninguna
ilustración puede sustituirla.

- **Uso:** banda **full-bleed** ("a sangre", de borde a borde) entre
  `AboutPreview` y `ContactSection` en la home, y repetida en `/contacto`
  junto al mapa.
- **Tamaño:** `100vw` × `clamp(320px, 45vh, 520px)`, `object-cover` con
  `object-position: 50% 65%` para que el suelo azul/lima domine el encuadre.
- **Recorte:** cortar la esquina inferior izquierda (maletín negro con LEDs)
  — encuadre 16:9 o 21:9 desde el borde derecho.
- **Motion:** `Parallax` suave (`amount={14}`) + entrada por `clip-path` wipe
  vertical. Nada de zoom: es un plano de contexto, tiene que sentirse estable.
- **Hover:** ninguno. No es clicable; el cursor `media` ya existente le da
  la afordancia sin necesidad de más.

### 04 · Bodegón de instrumentos — **la más versátil**
Caja de prismas, gafa de prueba, flippers ±, regla RAF de convergencia,
transiluminador y **el mug con el logo de Ortoptika**. Sin personas, luz
suave, fondo blanco. Es "producto" en el buen sentido: transmite
instrumental serio sin ser fría ni clínica.

- **Uso:** imagen de la sección **"Cómo es la valoración" / `proceso`** en las
  landings de servicio, y/o bloque de apoyo en `/sobre-mi`.
- **Tamaño:** media columna (`lg:col-span-6`), `aspect-[3/2]` dentro del
  `photo-frame` existente con su border-radius orgánico.
- **Recorte:** respetar el tercio izquierdo — ahí está el mug con el logo,
  que hace de firma de marca dentro de la propia foto.
- **Hover:** `scale(1.03)` + `saturate(1.06)` en 400ms, con la escala en un
  nodo interno (regla del proyecto: nunca en el mismo nodo que anima `Reveal`).

### 02 · Sinoptóforo recortado — **el mayor golpe visual**
Ya viene **con canal alfa**, recortado del fondo. Un sinoptóforo es el objeto
más icónico y menos conocido de la ortóptica: nadie sabe qué es, y por eso
detiene el scroll. Simétrico, frontal, con los dos LEDs rojos encendidos.

Que tenga alpha cambia todo: **no necesita marco**. Puede flotar directamente
sobre el fondo crema, sangrando por un borde, como hacen los sitios de
Awwwards con los objetos recortados.

- **Uso:** hero de `/servicios/vision-binocular` (o `estrabismo`), flotando a
  la derecha, grande y sangrado por el borde derecho.
- **Tamaño:** `max-width: 46rem` en `lg`, con `-mr-[8vw]` para que se salga
  del contenedor. En móvil baja a 20rem y se centra.
- **Motion:** entrada `scale 0.94 → 1` + `Parallax` lento (`amount={20}`,
  más que el resto: al no tener marco, el paralaje se lee como profundidad).
  Los dos LEDs admiten un glow pulsante muy sutil — apagado bajo
  `prefers-reduced-motion`.
- **Versión sin autorización:** recortar el **55% superior** (tubos, diales
  HYPER, escalas R/L). Sigue siendo igual de icónico y desaparece la cara.
  **Esta variante entra en Fase A.**

### 03 · Doctora atendiendo
La doctora (de espaldas/perfil) señalando tarjetas de percepción a un
paciente adulto mayor. Es la única foto que muestra el **acto de atender**:
dos personas, una mesa, un ejercicio. Vertical, encaja con el `aspect-[4/5]`
que ya usan Hero y AboutPreview.

- **Uso:** sustituir o acompañar el retrato en `AboutPreview`, o abrir la
  sección "cómo trabajo" de `/sobre-mi`.
- **Nota:** el retrato actual de la doctora es un recorte sobre fondo plano;
  esta foto tiene contexto real y es más creíble. Vale la pena la
  autorización.
- **Bloqueante:** paciente identificable.

### 01 y 05 · Niños en terapia — **las que convierten**
La 01 (vasos de colores apilados, clipboard con la carta de patrones) y la 05
(cuaderno de círculos + tabla naranja de secuencias). Son las que le dicen a
una madre *"aquí saben tratar a mi hijo"*. Ambas están tomadas desde atrás y
arriba, lo cual juega a favor.

- **Recorte que resuelve el problema legal:** en la 01, un cuadrado sobre
  **las manos y los vasos** deja fuera la cabeza por completo y queda más
  elegante que el plano entero. En la 05, un `4:5` sobre **el cuaderno y la
  tabla naranja** con la mano del niño entrando por el borde derecho.
- **Uso:** dos tarjetas dentro de una sección "Así es una sesión" en
  `/servicios/terapia-visual` y `/servicios/optometria-pediatrica`.
- **Tamaño:** `aspect-square` (01) y `aspect-[4/5]` (05), en un par asimétrico
  con la segunda desplazada `lg:translate-y-10`.
- **Hover:** revelado de un pie de foto que sube desde abajo
  (`translateY(100%) → 0`) sobre un velo navy al 70%.

---

## 3. Decisión de encuadre — resumen

| Foto | Recorte | Aspecto final | ¿Fase A? |
|---|---|---|---|
| 06 sala | quitar esquina inf. izq. | 16:9 | ✅ |
| 04 instrumentos | conservar mug | 3:2 | ✅ |
| 02 sinoptóforo | 55% superior (sin cara) | ~16:10 con alpha | ✅ |
| 01 niño/vasos | manos + vasos, sin cabeza | 1:1 | ✅ |
| 05 niño/tabla | cuaderno + tabla, sin cara | 4:5 | ✅ |
| 02 sinoptóforo completo | — | 4:3 con alpha | ⏳ autorización |
| 03 doctora + paciente | vertical, tal cual | 4:5 | ⏳ autorización |
| 01 / 05 completas | — | 4:5 | ⏳ autorización de padres |

---

## 4. Pipeline técnico (restricción real del proyecto)

El sitio es **static export** (`output: "export"` en `next.config.ts`) con
`images.unoptimized`. Eso significa que **`next/image` no optimiza nada en
build**: cada archivo se sirve tal cual se deja en `public/`. Todo el trabajo
de compresión hay que hacerlo antes, igual que se hizo con la marca.

- Nuevo `scripts/optimize-photos.mjs`, gemelo de
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

## 5. Componente nuevo a crear

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

## 6. Fases

### Fase A — sin bloqueos, ejecutable en la próxima sesión
1. `scripts/optimize-photos.mjs` + carpeta `public/images/fotos/`.
2. Componente `ui/Photo.tsx` con sus tres variantes.
3. **Banda de sala full-bleed** (foto 06) en la home, entre `AboutPreview` y
   `ContactSection`, con `Parallax` y entrada por wipe.
4. Foto 06 también en `/contacto`, junto al mapa.
5. **Bodegón (04)** en la sección `proceso` de las landings de servicio.
6. **Sinoptóforo recortado al equipo (02)** como cutout en el hero de
   `/servicios/vision-binocular`.
7. **Par de crops sin cara (01 + 05)** en una sección "Así es una sesión" de
   `/servicios/terapia-visual`.
8. QA: peso de página, CLS, `prefers-reduced-motion`, breakpoint `lg` — que
   es justamente lo que quedó pendiente de verificar en las Sesiones 3 y 4.

### Fase B — cuando lleguen las autorizaciones
9. Foto 03 (doctora atendiendo) en `AboutPreview` / `/sobre-mi`.
10. Sinoptóforo completo con el paciente, si se autoriza.
11. Fotos 01 y 05 completas, si los padres autorizan.
12. Fotos que **siguen faltando** y que ninguna de estas seis cubre:
    - fachada / entrada de la Clínica Medicadiz (para Google Business y
      "cómo llegar")
    - la doctora sola en el consultorio, plano medio horizontal (hoy sólo
      hay un recorte cuadrado)
    - detalle de la lámpara de hendidura o el autorrefractómetro
    - una foto horizontal limpia para la imagen `og:` de redes

### Qué pedirle a la doctora en paralelo
- Formato de **autorización de uso de imagen** firmado, uno por paciente
  (y por acudiente en el caso de los menores). Sin eso, la Fase B no arranca.
- Las 4 fotos que faltan del punto 12.
- El logo en vectorial, que sigue pendiente y limita la calidad del mug y del
  favicon.
