import { ogImage, OG_SIZE } from "@/lib/og";

// El blog está noindex mientras no haya artículos, pero puede compartirse por
// enlace: sin esta imagen propia, su buildMetadata() pisa la OG heredada de la raíz.
// Requerido por output:"export": genera la imagen en build.
export const dynamic = "force-static";

export const alt = "Blog de salud visual — Ortoptika";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Blog",
    title: "Salud visual, contada para familias",
  });
}
