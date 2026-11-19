/**
 * Puente DOM ↔ WebGL sin re-renders: el scroll escribe aquí y useFrame lo lee.
 * p: progreso de la sección (0 = ojo entero al centro, 1 = despiece completo).
 * capas: posición en pantalla (px CSS) y radio aparente de cada capa, que
 * escribe la escena cada frame para colocar etiquetas en el DOM.
 */
const punto = () => ({ x: 0, y: 0, r: 0 });
export const ojoEstado = {
  p: 0,
  capas: { esclera: punto(), cristalino: punto(), iris: punto(), cornea: punto() },
};
