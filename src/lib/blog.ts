/**
 * Registro de artículos del blog — fuente de verdad de sus METADATOS.
 *
 * El cuerpo de cada artículo vive en `src/content/blog/<slug>.mdx`; aquí van
 * título, fechas, revisión clínica y a qué servicio refuerza. De este registro
 * salen el índice /blog, las páginas /blog/[slug], el sitemap, las OG images
 * y el JSON-LD.
 *
 * Regla editorial (propuesta de posicionamiento): ningún artículo entra en
 * este registro sin la revisión clínica de la doctora. Por eso `revisadoEl`
 * es obligatorio, y por eso los borradores viven en una rama aparte: cada push
 * a `main` publica en producción.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SERVICES, type Service } from "@/lib/constants";

/**
 * Los cuatro bloques temáticos de la estrategia SEO (página pilar +
 * artículos satélite). El orden es el de publicación acordado.
 */
export const CLUSTERS = {
  ortoptica: "Ortóptica y terapia visual",
  "ojo-vago-estrabismo": "Ojo vago y estrabismo",
  adultos: "Visión en adultos",
  infantil: "Visión infantil",
} as const;

export type Cluster = keyof typeof CLUSTERS;

export type Post = {
  /** URL: /blog/<slug>/ y nombre del archivo .mdx. */
  slug: string;
  /** Titular visible (<h1>). */
  titulo: string;
  /** <title> si debe diferir del titular (más corto o con la keyword delante). */
  metaTitle?: string;
  /** Meta description y entradilla del índice (~150 caracteres). */
  descripcion: string;
  cluster: Cluster;
  /** Landing de servicio a la que el artículo empuja (enlace y CTA). */
  servicio: Service["slug"];
  /** Fechas ISO (AAAA-MM-DD). */
  publicado: string;
  actualizado?: string;
  /** Fecha en que la doctora aprobó el contenido clínico. Obligatoria. */
  revisadoEl: string;
  /** Tema médico principal, para `about` en el JSON-LD (ej. "Ambliopía"). */
  tema: string;
  keywords?: string[];
};

/**
 * Artículos publicados. Añadir un artículo = crear su .mdx y su entrada aquí.
 * No puede quedar vacío: con `output: "export"` Next exige al menos un slug
 * para /blog/[slug] y el build falla (ver src/content/blog/_plantilla.mdx).
 */
const POSTS: Post[] = [];

/**
 * Por debajo de este número /blog queda en noindex y fuera del sitemap y de
 * la navegación: una sección casi vacía indexada perjudica más de lo que
 * aporta. Los artículos sí se indexan desde el primero.
 */
const MIN_POSTS_BLOG_PUBLICO = 3;

/** Artículos ordenados del más reciente al más antiguo. */
export function getPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.publicado.localeCompare(a.publicado));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

/** true cuando el índice /blog ya merece indexarse y enlazarse. */
export function isBlogPublico(): boolean {
  return POSTS.length >= MIN_POSTS_BLOG_PUBLICO;
}

/** Fecha de la última modificación (para sitemap y dateModified). */
export function lastModified(post: Post): string {
  return post.actualizado ?? post.publicado;
}

/** Hasta `n` artículos relacionados: primero los del mismo bloque. */
export function getRelated(post: Post, n = 2): Post[] {
  const otros = getPosts().filter((p) => p.slug !== post.slug);
  const mismoCluster = otros.filter((p) => p.cluster === post.cluster);
  const resto = otros.filter((p) => p.cluster !== post.cluster);
  return [...mismoCluster, ...resto].slice(0, n);
}

/** Servicio enlazado por el artículo (nombre legible para el CTA). */
export function getServicio(post: Post): Service {
  return SERVICES.find((s) => s.slug === post.servicio)!;
}

/**
 * Minutos de lectura a ~200 palabras/minuto, contados sobre el .mdx en build
 * (static export: esto sólo corre al generar el sitio, nunca en el cliente).
 */
export function readingMinutes(slug: string): number {
  const source = readFileSync(
    join(process.cwd(), "src/content/blog", `${slug}.mdx`),
    "utf8",
  );
  const texto = source
    .replace(/^(import|export) .*$/gm, "")
    .replace(/<[^>]+>/g, " ");
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

/** "8 de octubre de 2026" — en UTC para que la fecha ISO no se corra un día. */
export function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
