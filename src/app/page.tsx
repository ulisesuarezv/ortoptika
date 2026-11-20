import type { Metadata } from "next";
import HeroV2 from "@/components/v2/HeroV2";
import Senales from "@/components/v2/Senales";
import DosOjos from "@/components/v2/DosOjos";
import { Cierre, Consultorio, Servicios, Yeimmy } from "@/components/v2/Secciones";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { jsonLd, medicalBusinessSchema, personSchema } from "@/lib/schema";

// Título de la home con equilibrio nacional + local (capa SEO de dos niveles:
// la oferta de ortóptica es escasa en el país, pero la sede sigue en Ibagué).
// `absolute` evita que el template del layout duplique la marca.
const HOME_TITLE = `Ortóptica y Terapia Visual en Colombia | ${SITE_CONFIG.shortName} — Ibagué`;

export const metadata: Metadata = {
  ...buildMetadata({
    title: HOME_TITLE,
    description: SITE_CONFIG.descripcion,
    path: "/",
    ogTitle: HOME_TITLE,
  }),
  title: { absolute: HOME_TITLE },
  // Cluster nacional + informacional JUNTO al local (no en su lugar).
  keywords: [
    "ortóptica en Colombia",
    "terapia visual en Colombia",
    "qué es la ortóptica",
    "ortóptica Ibagué",
    "terapia visual Ibagué",
    "optómetra especialista en ortóptica",
    "estrabismo tratamiento",
    "ojo vago tratamiento",
  ],
};

/**
 * Home (v2). El ojo 3D vive en HeroV2 y DosOjos; el resto son Server Components.
 * JSON-LD MedicalBusiness + Person inyectados en la página raíz del sitio.
 */
export default function Home() {
  return (
    <>
      {/* JSON-LD: negocio sanitario local + profesional (E-E-A-T). */}
      <script {...jsonLd(medicalBusinessSchema())} />
      <script {...jsonLd(personSchema())} />

      <HeroV2 />
      <Senales />
      <DosOjos />
      <Servicios />
      <Yeimmy />
      <Consultorio />
      <Cierre />
    </>
  );
}
