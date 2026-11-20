import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { jsonLd, personSchema } from "@/lib/schema";
import SobreMiV2 from "@/components/v2/paginas/SobreMiV2";

export const metadata: Metadata = buildMetadata({
  title: `Sobre ${SITE_CONFIG.profesional}`,
  description: `Conoce a ${SITE_CONFIG.profesional}, ${SITE_CONFIG.titulo.toLowerCase()} en ${SITE_CONFIG.direccion.ciudad}, Colombia. Trayectoria, formación y una forma cercana de acompañar a niños y adultos en su salud visual.`,
  path: "/sobre-mi",
});

export default function Page() {
  return (
    <>
      <script {...jsonLd(personSchema())} />
      <SobreMiV2 />
    </>
  );
}
