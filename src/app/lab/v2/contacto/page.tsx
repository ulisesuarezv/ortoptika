import type { Metadata } from "next";
import ContactoV2 from "@/components/v2/paginas/ContactoV2";

// Laboratorio de la v2 (noindex). Al publicar, la ruta real cambia su cuerpo
// por <ContactoV2 /> y conserva su metadata y JSON-LD.
export const metadata: Metadata = {
  title: "Lab · v2 · Contacto",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ContactoV2 />;
}
