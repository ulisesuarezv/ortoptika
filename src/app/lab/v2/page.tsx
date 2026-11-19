import type { Metadata } from "next";
import HeroV2 from "@/components/v2/HeroV2";
import Senales from "@/components/v2/Senales";
import DosOjos from "@/components/v2/DosOjos";
import { Cierre, Consultorio, Servicios, Yeimmy } from "@/components/v2/Secciones";

// Laboratorio de la v2 (rama feat/v2). Fuera del sitemap y en noindex.
// Tipografías y ajustes globales en ./layout.tsx.
export const metadata: Metadata = {
  title: "Lab · v2",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
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
