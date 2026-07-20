import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLanding from "@/components/services/ServiceLanding";
import { buildMetadata } from "@/lib/metadata";
import { faqPageSchema, jsonLd, serviceSchema } from "@/lib/schema";
import { SERVICES_CONTENT } from "@/lib/services-content";

/**
 * Landings de servicio (/servicios/[slug]) — una ruta dinámica prerenderizada
 * en build (static export) para los 5 servicios. El contenido y el tema visual
 * de cada landing viven en lib/services-content.ts; la composición, en
 * components/services/ServiceLanding.tsx.
 */

export function generateStaticParams() {
  return Object.keys(SERVICES_CONTENT).map((slug) => ({ slug }));
}

// Solo se generan los slugs de SERVICES_CONTENT; cualquier otro → 404.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = SERVICES_CONTENT[slug];
  if (!content) return {};

  return {
    ...buildMetadata({
      title: content.metaTitle,
      description: content.metaDescription,
      path: `/servicios/${slug}/`,
    }),
    keywords: content.keywords,
  };
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  const content = SERVICES_CONTENT[slug];
  if (!content) notFound();

  return (
    <>
      {/* JSON-LD: Service (provider → MedicalBusiness por @id) + FAQPage
          con las mismas preguntas visibles en el FAQAccordion. */}
      <script
        {...jsonLd(
          serviceSchema({
            slug: content.slug,
            name: content.nombre,
            description: content.metaDescription,
            serviceType: content.serviceType,
          }),
        )}
      />
      <script {...jsonLd(faqPageSchema(content.faq))} />

      <ServiceLanding content={content} />
    </>
  );
}
