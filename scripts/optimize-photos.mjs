/**
 * Genera las fotos web (WebP) a partir de los originales del consultorio.
 * Uso: node scripts/optimize-photos.mjs  (desde la raíz del proyecto)
 *
 * Por qué existe: el sitio es `output: "export"` con `images.unoptimized`,
 * así que next/image NO optimiza nada en build — cada archivo se sirve tal
 * cual quede en public/. Todo el recorte y la compresión pasan por aquí,
 * igual que en scripts/optimize-brand-assets.mjs.
 *
 * Entrada:  assets/fotos-originales/   (gitignoreado: full-res, con caras)
 * Salida:   public/images/fotos/       (lo único que se publica)
 *
 * De cada foto salen DOS anchos, consumidos con <picture> + <source media>:
 *   nombre.webp     → escritorio
 *   nombre-sm.webp  → móvil (<= 640px de viewport)
 *
 * Los originales vienen del teléfono sin metadato EXIF de orientación; ya se
 * guardaron rotados a mano en assets/fotos-originales/, así que aquí NO se
 * vuelve a rotar. Si se añade una foto nueva, revisar su orientación ANTES
 * de meterla en esa carpeta.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = new URL("../assets/fotos-originales/", import.meta.url).pathname;
const OUT = new URL("../public/images/fotos/", import.meta.url).pathname;

/**
 * `crop` recorta ANTES de escalar, para fijar el encuadre (no la relación de
 * aspecto del original). `width` es el ancho de escritorio; `widthSm` el de
 * móvil. `alpha` conserva transparencia (sólo el recorte del sinoptóforo).
 */
const PHOTOS = [
  {
    // Plano general del gimnasio visual. Se recorta a 16:9 bajando el techo y
    // soltando el borde inferior, donde asoma el maletín de LEDs.
    in: "06-sala-terapia.jpg",
    out: "sala-terapia",
    crop: { left: 0, top: 120, width: 2000, height: 1125 },
    width: 1600,
    widthSm: 800,
  },
  {
    // Bodegón de instrumentos a 3:2. El recorte respeta el tercio izquierdo:
    // ahí está el mug con el logo, que hace de firma de marca dentro de la foto.
    in: "04-instrumentos-bodegon.png",
    out: "instrumentos",
    crop: { left: 0, top: 100, width: 2000, height: 1333 },
    width: 1200,
    widthSm: 640,
  },
  {
    // Sinoptóforo: el original ya viene recortado del fondo. Se conserva el
    // canal alfa para poder flotarlo sobre el crema sin marco.
    in: "02-sinoptoforo-recorte.png",
    out: "sinoptoforo",
    alpha: true,
    width: 1200,
    widthSm: 640,
  },
  {
    // Verticales a 4:5, el mismo aspecto que ya usan Hero y AboutPreview.
    in: "03-doctora-paciente-tarjetas.jpg",
    out: "doctora-consulta",
    crop: { left: 0, top: 125, width: 1500, height: 1875 },
    width: 900,
    widthSm: 560,
  },
  {
    in: "01-nino-vasos-color.png",
    out: "sesion-vasos",
    crop: { left: 0, top: 60, width: 1500, height: 1875 },
    width: 900,
    widthSm: 560,
  },
  {
    in: "05-nino-tabla-numeros.jpg",
    out: "sesion-secuencias",
    crop: { left: 0, top: 100, width: 1500, height: 1875 },
    width: 900,
    widthSm: 560,
  },
];

await mkdir(OUT, { recursive: true });

for (const photo of PHOTOS) {
  for (const [suffix, width] of [
    ["", photo.width],
    ["-sm", photo.widthSm],
  ]) {
    let img = sharp(`${SRC}${photo.in}`);
    if (photo.crop) img = img.extract(photo.crop);

    const file = `${OUT}${photo.out}${suffix}.webp`;
    const { size } = await img
      .resize({ width })
      .webp(
        photo.alpha
          ? { quality: 82, alphaQuality: 90 }
          : { quality: 80, alphaQuality: 100 },
      )
      .toFile(file);

    console.log(
      `${photo.out}${suffix}.webp`.padEnd(28),
      `${width}px`.padStart(7),
      `${(size / 1024).toFixed(0)} KB`.padStart(8),
    );
  }
}
