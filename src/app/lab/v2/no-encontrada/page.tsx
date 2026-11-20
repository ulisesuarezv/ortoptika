import type { Metadata } from "next";
import NoEncontradaV2 from "@/components/v2/paginas/NoEncontradaV2";

// Laboratorio de la v2 (noindex). Al publicar, la ruta real cambia su cuerpo
// por <NoEncontradaV2 /> y conserva su metadata y JSON-LD.
export const metadata: Metadata = {
  title: "Lab · v2 · 404",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NoEncontradaV2 />;
}
