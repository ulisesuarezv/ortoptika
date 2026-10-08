import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Static export para deploy en Vercel/Netlify/Cloudflare Pages (sin servidor).
  output: "export",
  images: {
    // Requerido para static export: desactiva la optimización on-demand de next/image.
    unoptimized: true,
  },
  // URLs con slash final → genera /ruta/index.html, más robusto en hosting estático.
  trailingSlash: true,
};

// MDX sólo se usa por import (cuerpo de los artículos en src/content/blog/),
// no como rutas: por eso no se toca `pageExtensions`.
const withMDX = createMDX({});

export default withMDX(nextConfig);
