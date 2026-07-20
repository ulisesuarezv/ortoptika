import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Datos mínimos por página para generar su metadata.
 * `path` es la ruta canónica relativa (ej. "/sobre-mi"); "/" para la home.
 */
export type PageMeta = {
  title: string;
  description: string;
  /** Ruta canónica relativa a SITE_CONFIG.url. Empieza por "/". */
  path: string;
  /** Sobreescribe el título de OpenGraph/Twitter si se quiere distinto del <title>. */
  ogTitle?: string;
  /** Si es false, marca la página como noindex (ej. /blog hasta tener artículos). */
  index?: boolean;
};

/**
 * Genera el objeto Metadata de una página a partir de datos mínimos.
 * Centraliza canonical + OpenGraph + Twitter para no repetirlos en cada ruta.
 *
 * El `title` que se pasa NO incluye la marca: el template del layout raíz
 * (`%s | Ortoptika Terapia`) la añade. Para OpenGraph/Twitter, donde no se
 * aplica el template, componemos el título completo aquí.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  index = true,
}: PageMeta): Metadata {
  const fullTitle =
    ogTitle ?? (path === "/" ? title : `${title} | ${SITE_CONFIG.name}`);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: SITE_CONFIG.locale,
      url: path,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: {
      index,
      follow: true,
    },
  };
}
