import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * robots.txt (se exporta estático en el build).
 * Crawl completo: no hay zonas privadas; lo único que no debe indexarse
 * (/blog vacío) ya lleva meta noindex por página, que es la señal correcta —
 * bloquearlo aquí impediría que los crawlers VIERAN ese noindex.
 */
// Requerido por output:"export": materializa /robots.txt en build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
