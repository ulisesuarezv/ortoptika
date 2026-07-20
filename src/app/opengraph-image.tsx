import { ogImage, OG_SIZE } from "@/lib/og";
import { SITE_CONFIG } from "@/lib/constants";

// OG de la home; también la hereda cualquier segmento sin imagen propia (blog, 404).
// Requerido por output:"export": genera la imagen en build.
export const dynamic = "force-static";

export const alt = `${SITE_CONFIG.name} — Ortóptica y terapia visual en Colombia, con sede en Ibagué`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Ortóptica y terapia visual",
    title: "Ayudamos a tus ojos a trabajar en equipo",
  });
}
