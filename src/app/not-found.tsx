import type { Metadata } from "next";
import NoEncontradaV2 from "@/components/v2/paginas/NoEncontradaV2";

export const metadata: Metadata = {
  title: "Página no encontrada",
  // Descripción propia: sin ella hereda la de la home y el 404 se describe
  // como si fuera la portada. Va con noindex, pero conviene que sea coherente.
  description:
    "La página que buscas no existe o cambió de lugar. Vuelve al inicio o ve directo a las áreas de atención de Ortoptika.",
  robots: { index: false, follow: true },
  // Sin esto hereda del layout el canonical de la home.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <NoEncontradaV2 />
  );
}
