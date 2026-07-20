/**
 * Generadores de JSON-LD (schema.org) para SEO.
 *
 * Sólo se usan datos REALES confirmados (SITE_CONFIG). Los campos que dependen
 * de datos aún no confirmados (horarios, geo, credenciales concretas) se OMITEN
 * a propósito en lugar de inventarse: un schema con datos falsos es peor que uno
 * incompleto. Ver PLAN-DESARROLLO.md y la memoria del proyecto.
 *
 * Cada generador devuelve un objeto plano; se inyecta con:
 *   <script type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */
import { SITE_CONFIG } from "@/lib/constants";

/** @id estables para poder referenciar los nodos entre sí. */
const BUSINESS_ID = `${SITE_CONFIG.url}/#business`;
const PERSON_ID = `${SITE_CONFIG.url}/#yeimmy-barragan`;

/**
 * MedicalBusiness: la clínica/consulta como negocio local sanitario.
 * Es el nodo clave para el SEO local (aparecer en el pack de mapas).
 *
 * PENDIENTE (rellenar cuando se confirmen): `openingHoursSpecification`
 * (horarios reales) y `geo` (lat/lng). Se añaden en la sesión 5 (/contacto).
 */
export function medicalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": BUSINESS_ID,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.descripcion,
    telephone: SITE_CONFIG.telefono,
    medicalSpecialty: "Optometric",
    address: {
      "@type": "PostalAddress",
      name: SITE_CONFIG.direccion.clinica,
      streetAddress: SITE_CONFIG.direccion.calle,
      addressLocality: SITE_CONFIG.direccion.ciudad,
      addressRegion: SITE_CONFIG.direccion.departamento,
      addressCountry: SITE_CONFIG.direccion.pais,
    },
    // Dos capas honestas: la ciudad de la sede (local pack) + el país, porque
    // recibe pacientes de toda Colombia que acuden PRESENCIALMENTE a Ibagué.
    // Una sola sede física (address/geo); no se inventan ubicaciones.
    areaServed: [
      {
        "@type": "City",
        name: SITE_CONFIG.direccion.ciudad,
      },
      {
        "@type": "Country",
        name: SITE_CONFIG.direccion.pais,
      },
    ],
    sameAs: [SITE_CONFIG.social.instagram],
    // El profesional que atiende, enlazado por @id al nodo Person.
    employee: { "@id": PERSON_ID },
  };
}

/**
 * Person: la profesional (Yeimmy Paola Barragan).
 * Refuerza E-E-A-T: quién está detrás de la información de salud.
 *
 * PENDIENTE (rellenar sólo con datos verificados por la doctora):
 * `alumniOf` (universidad), `hasCredential` (títulos/colegiatura).
 * Se dejan FUERA hasta confirmarlos — no inventar.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_CONFIG.profesional,
    jobTitle: SITE_CONFIG.titulo,
    image: `${SITE_CONFIG.url}/images/dra-yeimmy-barragan.png`,
    url: `${SITE_CONFIG.url}/sobre-mi`,
    worksFor: { "@id": BUSINESS_ID },
    knowsAbout: [
      "Ortóptica",
      "Terapia visual",
      "Estrabismo",
      "Ambliopía",
      "Visión binocular",
      "Optometría pediátrica",
    ],
    sameAs: [SITE_CONFIG.social.instagram],
  };
}

/**
 * Service: una landing de servicio (/servicios/[slug]).
 * `provider` enlaza por @id al nodo MedicalBusiness (definido en la home),
 * de modo que Google puede unir ambos nodos dentro del mismo sitio.
 */
export function serviceSchema({
  slug,
  name,
  description,
  serviceType,
}: {
  slug: string;
  name: string;
  description: string;
  /** Tipo legible del servicio, ej. "Terapia visual / Ortóptica". */
  serviceType: string;
}) {
  const url = `${SITE_CONFIG.url}/servicios/${slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    serviceType,
    url,
    provider: { "@id": BUSINESS_ID },
    // Igual que en MedicalBusiness: ciudad de la sede + país (los pacientes
    // de otras ciudades viajan a la cita presencial; no hay atención remota).
    areaServed: [
      {
        "@type": "City",
        name: SITE_CONFIG.direccion.ciudad,
      },
      {
        "@type": "Country",
        name: SITE_CONFIG.direccion.pais,
      },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      name: "Cita presencial",
      serviceLocation: {
        "@type": "Place",
        name: SITE_CONFIG.direccion.clinica,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONFIG.direccion.calle,
          addressLocality: SITE_CONFIG.direccion.ciudad,
          addressRegion: SITE_CONFIG.direccion.departamento,
          addressCountry: SITE_CONFIG.direccion.pais,
        },
      },
    },
  };
}

/**
 * FAQPage: las preguntas frecuentes REALES visibles en la página.
 * Regla: el schema debe reflejar exactamente el contenido renderizado
 * (mismas preguntas y respuestas que el FAQAccordion).
 */
export function faqPageSchema(
  items: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Helper de presentación: props listas para <script> de JSON-LD.
 * Uso: <script {...jsonLd(medicalBusinessSchema())} />
 */
export function jsonLd(schema: object) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  } as const;
}
