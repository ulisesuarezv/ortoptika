/**
 * Rutas internas de la v2. Mientras la v2 vive en /lab/v2, los enlaces entre
 * páginas ya rediseñadas apuntan al laboratorio; al publicar, BASE pasa a "".
 * Solo se prefijan las rutas que ya existen en la v2.
 */
export const BASE = "/lab/v2";
export const rutaV2 = (p: string) => `${BASE}${p}`;
export const servicioV2 = (slug: string) => rutaV2(`/servicios/${slug}/`);
