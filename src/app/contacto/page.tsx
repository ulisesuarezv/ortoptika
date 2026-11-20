import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { jsonLd, medicalBusinessSchema } from "@/lib/schema";
import ContactoV2 from "@/components/v2/paginas/ContactoV2";

export const metadata: Metadata = buildMetadata({
  title: "Contacto y ubicación en Ibagué",
  description: `Agenda tu cita de ortóptica y terapia visual por WhatsApp. Atención en ${SITE_CONFIG.direccion.clinica}, ${SITE_CONFIG.direccion.ciudad}. Dirección, horarios y cómo llegar.`,
  path: "/contacto/",
});

export default function Page() {
  return (
    <>
      <script {...jsonLd(medicalBusinessSchema())} />
      <ContactoV2 />
    </>
  );
}
