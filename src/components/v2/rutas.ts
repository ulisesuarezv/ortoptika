/**
 * Rutas internas de la v2. BASE era "/lab/v2" mientras la v2 vivía en el
 * laboratorio; ya publicada, es "" (se deja el helper por si vuelve a hacer
 * falta un prefijo).
 */
export const BASE = "";
export const rutaV2 = (p: string) => `${BASE}${p}`;
export const servicioV2 = (slug: string) => rutaV2(`/servicios/${slug}/`);

/** Enlaces de la cabecera (escritorio). `id` marca la página actual. */
export const ENLACES = [
  { id: "servicios", href: `${rutaV2("/")}#servicios`, t: "Servicios" },
  { id: "sobre-mi", href: rutaV2("/sobre-mi/"), t: "Yeimmy" },
  { id: "contacto", href: rutaV2("/contacto/"), t: "Consultorio" },
] as const;
export type EnlaceId = (typeof ENLACES)[number]["id"];
