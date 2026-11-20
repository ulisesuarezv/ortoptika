import type { Metadata } from "next";
import PrivacidadV2 from "@/components/v2/paginas/PrivacidadV2";

// Laboratorio de la v2 (noindex). Al publicar, la ruta real cambia su cuerpo
// por <PrivacidadV2 /> y conserva su metadata y JSON-LD.
export const metadata: Metadata = {
  title: "Lab · v2 · Privacidad",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PrivacidadV2 />;
}
