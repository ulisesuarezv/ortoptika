import { ogImage, OG_SIZE } from "@/lib/og";
import { SITE_CONFIG } from "@/lib/constants";

// Requerido por output:"export": genera la imagen en build.
export const dynamic = "force-static";

export const alt = `Contacto — ${SITE_CONFIG.name}, ${SITE_CONFIG.direccion.ciudad}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Contacto",
    title: "Agenda tu valoración por WhatsApp",
  });
}
