import type { Metadata } from "next";
import SobreMiV2 from "@/components/v2/paginas/SobreMiV2";

// Laboratorio de la v2 (noindex). Al publicar, la ruta real cambia su cuerpo
// por <SobreMiV2 /> y conserva su metadata y JSON-LD.
export const metadata: Metadata = {
  title: "Lab · v2 · Sobre mí",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SobreMiV2 />;
}
