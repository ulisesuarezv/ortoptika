import type { NextConfig } from "next";

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

export default nextConfig;
