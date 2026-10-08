import type { MetadataRoute } from "next";
import { SERVICES, SITE_CONFIG } from "@/lib/constants";
import { getPosts, isBlogPublico, lastModified } from "@/lib/blog";

/**
 * Sitemap del sitio (se exporta como /sitemap.xml en el build estático).
 *
 * URLs con trailing slash, coherentes con `trailingSlash: true` en
 * next.config.ts y con los canonicals que emite buildMetadata().
 * El dominio sale de SITE_CONFIG.url (asumido; aún no comprado).
 *
 * Blog: cada artículo entra desde que se publica (con su lastModified); el
 * índice /blog sólo cuando hay ≥3 artículos y deja de ser noindex
 * (isBlogPublico, en src/lib/blog.ts).
 */
// Requerido por output:"export": materializa /sitemap.xml en build.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;

  return [
    {
      url: `${base}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/sobre-mi/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...SERVICES.map((service) => ({
      url: `${base}/servicios/${service.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${base}/contacto/`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...(isBlogPublico()
      ? [
          {
            url: `${base}/blog/`,
            changeFrequency: "weekly" as const,
            priority: 0.6,
          },
        ]
      : []),
    ...getPosts().map((post) => ({
      url: `${base}/blog/${post.slug}/`,
      lastModified: lastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
