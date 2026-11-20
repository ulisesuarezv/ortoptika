/**
 * Puentes DOM ↔ WebGL de las escenas: el scroll de cada sección escribe aquí y
 * el useFrame de la escena lo lee (sin re-renders).
 *
 * Viven APARTE de los archivos de escena a propósito: las secciones que
 * escriben el progreso se cargan de entrada, y si importaran estos objetos
 * desde *Escena.tsx arrastrarían three.js al JS inicial y anularían el
 * dynamic(..., { ssr: false }) de las escenas. Aquí no se importa nada de three.
 */
export const dosOjosEstado = { p: 0 };
export const brockScroll = { p: 0 };
export const ambliopiaScroll = { p: 0 };
export const barraScroll = { p: 0 };
export const cuentasScroll = { p: 0 };
export const discosScroll = { p: 0 };

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Guion del recorrido del cordón de Brock (lo usan la escena y su sección). */
export function guionBrock(p: number) {
  return {
    lineas: ss(0.2, 0.3, p),
    desv: ss(0.5, 0.58, p) * (1 - ss(0.76, 0.82, p)),
    fija: p < 0.84 ? 1 : p < 0.9 ? 0 : p < 0.95 ? 1 : 2,
  };
}
