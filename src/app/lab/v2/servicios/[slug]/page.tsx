import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingV2 from "@/components/v2/servicio/LandingV2";
import { SERVICES_CONTENT } from "@/lib/services-content";

// Landings de servicio de la v2 en el laboratorio (noindex). Al publicar, la
// ruta real /servicios/[slug] cambia ServiceLanding por LandingV2 y conserva
// su metadata y JSON-LD tal cual.
export function generateStaticParams() {
  return Object.keys(SERVICES_CONTENT).map((slug) => ({ slug }));
}
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Lab · v2 · ${SERVICES_CONTENT[slug]?.nombre ?? ""}`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = SERVICES_CONTENT[slug];
  if (!content) notFound();
  return <LandingV2 content={content} />;
}
