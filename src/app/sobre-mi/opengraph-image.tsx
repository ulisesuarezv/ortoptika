import { ogImage, OG_SIZE } from "@/lib/og";
import { SITE_CONFIG } from "@/lib/constants";

// Requerido por output:"export": genera la imagen en build.
export const dynamic = "force-static";

export const alt = `Sobre mí — Dra. ${SITE_CONFIG.profesional}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Sobre mí",
    title: SITE_CONFIG.profesional,
  });
}
