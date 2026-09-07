/**
 * Registro único de la fotografía real del consultorio.
 *
 * Los archivos los genera `node scripts/optimize-photos.mjs` a partir de
 * `assets/fotos-originales/` (carpeta gitignoreada). Si cambian los recortes
 * o los anchos en ese script, hay que actualizar `width`/`height` aquí: son
 * los que evitan el salto de layout (CLS) al cargar.
 *
 * `personas: true` marca las fotos con gente identificable. Publicarlas exige
 * autorización escrita de uso de imagen (y del acudiente si es menor) — ver
 * `docs-doctora/3-Autorizacion-uso-de-imagen-Ortoptika.pdf` y PLAN-FOTOGRAFIA.md.
 *
 * El `alt` es descriptivo y clínico a propósito: además de accesibilidad,
 * alimenta el SEO de imágenes, que en salud pesa.
 */
export type Photo = {
  /** WebP de escritorio. */
  src: string;
  /** WebP reducido, servido con <source media="(max-width: 640px)">. */
  srcSm: string;
  width: number;
  height: number;
  alt: string;
  /**
   * Pie de foto por defecto. Describe LO QUE SE VE, nunca la sección que la
   * acompaña: en táctil el pie está siempre visible, así que repetir el
   * titular de al lado sólo ocupa sitio.
   */
  caption: string;
  /** Aparecen personas identificables → requiere autorización firmada. */
  personas: boolean;
};

const F = "/images/fotos/";

export const PHOTOS = {
  salaTerapia: {
    src: `${F}sala-terapia.webp`,
    srcSm: `${F}sala-terapia-sm.webp`,
    width: 1600,
    height: 900,
    alt: "Gimnasio visual del consultorio: tapete de equilibrio, minitrampolín, balón de pilates y tabla de letras para terapia visual",
    caption:
      "El gimnasio visual del consultorio, donde se hacen las sesiones de terapia",
    personas: false,
  },
  instrumentos: {
    src: `${F}instrumentos.webp`,
    srcSm: `${F}instrumentos-sm.webp`,
    width: 1200,
    height: 800,
    alt: "Instrumental de ortóptica: caja de prismas, gafa de prueba, flippers, regla de convergencia y transiluminador",
    caption:
      "Parte del instrumental de una valoración de ortóptica",
    personas: false,
  },
  sinoptoforo: {
    src: `${F}sinoptoforo.webp`,
    srcSm: `${F}sinoptoforo-sm.webp`,
    width: 1200,
    height: 900,
    alt: "Paciente en el sinoptóforo, el equipo con el que se mide y se entrena la visión binocular",
    caption:
      "Sinoptóforo: mide y entrena cómo trabajan juntos los dos ojos",
    personas: true,
  },
  doctoraConsulta: {
    src: `${F}doctora-consulta.webp`,
    srcSm: `${F}doctora-consulta-sm.webp`,
    width: 900,
    height: 1125,
    alt: "La Dra. Yeimmy Barragan guiando a un paciente adulto en un ejercicio de percepción visual",
    caption:
      "Ejercicio de percepción visual durante una consulta",
    personas: true,
  },
  sesionVasos: {
    src: `${F}sesion-vasos.webp`,
    srcSm: `${F}sesion-vasos-sm.webp`,
    width: 900,
    height: 1125,
    alt: "Niño con gafas ordenando vasos de colores según un patrón, ejercicio de percepción y motricidad visual",
    caption:
      "Ejercicio de percepción y coordinación con material concreto",
    personas: true,
  },
  sesionSecuencias: {
    src: `${F}sesion-secuencias.webp`,
    srcSm: `${F}sesion-secuencias-sm.webp`,
    width: 900,
    height: 1125,
    alt: "Niño con gafas resolviendo una tabla de secuencias numéricas junto a una lámina de círculos de colores",
    caption:
      "Trabajo de secuencias y motilidad ocular en sesión",
    personas: true,
  },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/**
 * Fotografía por landing de servicio. Se mantiene aquí y no en
 * `services-content.ts` para que ese archivo siga siendo sólo copy.
 *
 * Reparto pensado para que ninguna landing repita la foto de su vecina:
 * el sinoptóforo va a estrabismo (es donde el equipo se explica solo), las
 * dos sesiones infantiles se separan entre ambliopía y optometría pediátrica,
 * y la sala completa refuerza terapia visual, que es la que más necesita
 * mostrar espacio.
 */
export const SERVICE_PHOTOS: Record<
  string,
  { cutout?: Photo; proceso?: Photo; bleed?: Photo }
> = {
  estrabismo: { cutout: PHOTOS.sinoptoforo },
  ambliopia: { proceso: PHOTOS.sesionVasos },
  "terapia-visual": { bleed: PHOTOS.salaTerapia },
  "vision-binocular": { proceso: PHOTOS.instrumentos },
  "optometria-pediatrica": { proceso: PHOTOS.sesionSecuencias },
};
