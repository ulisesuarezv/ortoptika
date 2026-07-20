/**
 * Genera favicon + app icons de marca.
 * Uso: node scripts/generate-icons.mjs  (desde la raíz del proyecto)
 *
 * El logo real (line-art ojo+cerebro) es demasiado fino para 16/32px, así que
 * los iconos usan una SILUETA simplificada que conserva la forma almendrada
 * del ojo: almendra azul de marca + iris lima + pupila navy (mismos colores
 * que el lockup). A 180px+ (apple-icon) se añade el arco de ceja del logo.
 *
 * Salidas:
 *   src/app/favicon.ico   (16 + 32 + 48, PNG embebido en contenedor ICO)
 *   src/app/icon.png      (512px, hi-res para navegadores/PWA)
 *   src/app/apple-icon.png(180px, fondo navy sólido — iOS no admite alpha)
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const OUT = new URL("../src/app/", import.meta.url).pathname;

const BLUE = "#0E4D7A";
const LIME = "#A8CF45";
const NAVY = "#02223B";

/**
 * Ojo simplificado en un viewBox 0 0 64 64.
 * `brow` añade el arco de ceja del logo (solo legible en tamaños grandes).
 * `bg` pinta un fondo sólido (requerido por apple-touch-icon).
 */
function eyeSvg({ brow = false, bg = null } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  ${bg ? `<rect width="64" height="64" fill="${bg}"/>` : ""}
  ${
    brow
      ? `<path d="M6 18 Q32 2 58 18 Q34 10 6 18 Z" fill="${LIME}"/>`
      : ""
  }
  <path d="M2 ${brow ? 40 : 32} Q32 ${brow ? 16 : 6} 62 ${brow ? 40 : 32} Q32 ${brow ? 62 : 58} 2 ${brow ? 40 : 32} Z" fill="${bg === NAVY ? "#ffffff" : BLUE}"/>
  <circle cx="32" cy="${brow ? 40 : 32}" r="11" fill="${LIME}"/>
  <circle cx="32" cy="${brow ? 40 : 32}" r="5" fill="${NAVY}"/>
</svg>`;
}

async function png(svg, size) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

/** Empaqueta PNGs en un contenedor .ico (formato PNG-in-ICO, Vista+). */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // tipo icono
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits/px
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const flat = eyeSvg(); // 16-48px: sin ceja (se emborrona)
const icoSizes = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, data: await png(flat, size) })),
);
await writeFile(`${OUT}favicon.ico`, buildIco(icoSizes));

await writeFile(`${OUT}icon.png`, await png(eyeSvg({ brow: true }), 512));
await writeFile(
  `${OUT}apple-icon.png`,
  await png(eyeSvg({ brow: true, bg: NAVY }), 180),
);

console.log("Iconos regenerados en src/app/ (favicon.ico, icon.png, apple-icon.png)");
