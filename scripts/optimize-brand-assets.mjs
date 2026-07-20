/**
 * Regenera los assets de marca optimizados (WebP) a partir de los PNG fuente.
 * Uso: node scripts/optimize-brand-assets.mjs  (desde la raíz del proyecto)
 *
 * Para reemplazar la foto de la doctora o el logo: sobrescribir el PNG fuente
 * en public/images/ y volver a ejecutar este script. El sitio consume SOLO los
 * .webp generados (next/image va con `unoptimized` por el static export).
 */
import sharp from "sharp";

const ROOT = new URL("../public/images/", import.meta.url).pathname;

// Foto de la doctora (1080x1080 ~1MB → 900px WebP con alpha, ~70KB)
await sharp(`${ROOT}dra-yeimmy-barragan.png`)
  .resize(900, 900)
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile(`${ROOT}dra-yeimmy-barragan.webp`);

// Variante móvil de la foto (el hero la pinta a ~19rem en móvil; servir los
// 900px ahí desperdicia ~35KB en el camino crítico del LCP)
await sharp(`${ROOT}dra-yeimmy-barragan.png`)
  .resize(560, 560)
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile(`${ROOT}dra-yeimmy-barragan-sm.webp`);

// Icono ojo+cerebro (header; base del favicon en Sesión 6)
await sharp(`${ROOT}brand/logo-mark-eye-brain.png`)
  .resize({ width: 480 })
  .webp({ nearLossless: true })
  .toFile(`${ROOT}brand/logo-mark-eye-brain.webp`);

// Logo completo (footer)
await sharp(`${ROOT}brand/logo-ortoptika-full.png`)
  .resize({ width: 640 })
  .webp({ nearLossless: true })
  .toFile(`${ROOT}brand/logo-ortoptika-full.webp`);

// Variantes pequeñas a tamaño de render real (header ~36px alto, footer 160px
// ancho): las versiones grandes pesaban 48/110KB y competían con el LCP.
await sharp(`${ROOT}brand/logo-mark-eye-brain.png`)
  .resize({ width: 160 })
  .webp({ nearLossless: true })
  .toFile(`${ROOT}brand/logo-mark-eye-brain-sm.webp`);
await sharp(`${ROOT}brand/logo-ortoptika-full.png`)
  .resize({ width: 320 })
  .webp({ nearLossless: true })
  .toFile(`${ROOT}brand/logo-ortoptika-full-sm.webp`);

// Wordmark "ORTOPTIKA" recortado del logo completo (lockup del header).
// Las coordenadas dependen del arte del PNG fuente: si cambia, reajustar.
await sharp(`${ROOT}brand/logo-ortoptika-full.png`)
  .extract({ left: 0, top: 810, width: 2000, height: 330 })
  .trim()
  .resize({ width: 560 })
  .webp({ nearLossless: true })
  .toFile(`${ROOT}brand/logo-wordmark.webp`);

console.log("Assets de marca regenerados en public/images/**/*.webp");
