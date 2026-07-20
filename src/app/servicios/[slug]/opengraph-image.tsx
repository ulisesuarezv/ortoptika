import { ogImage, OG_SIZE } from "@/lib/og";
import { SERVICES_CONTENT } from "@/lib/services-content";

// Una OG image por landing de servicio (los 5 slugs de generateStaticParams
// del page.tsx de este segmento se prerenderizan también aquí).
// Requerido por output:"export": genera la imagen en build.
export const dynamic = "force-static";

// El route handler de imagen necesita sus propios params estáticos
// (no hereda los del page.tsx del segmento).
export function generateStaticParams() {
  return Object.keys(SERVICES_CONTENT).map((slug) => ({ slug }));
}

export const alt =
  "Servicio de ortóptica y terapia visual en Colombia, con sede en Ibagué";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = SERVICES_CONTENT[slug];

  return ogImage({
    eyebrow: "Servicios",
    title: content?.nombre ?? "Ortóptica y terapia visual",
  });
}
