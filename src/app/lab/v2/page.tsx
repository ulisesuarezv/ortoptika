import type { Metadata } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import HeroV2 from "@/components/v2/HeroV2";
import Senales from "@/components/v2/Senales";
import DosOjos from "@/components/v2/DosOjos";
import { Cierre, Consultorio, Servicios, Yeimmy } from "@/components/v2/Secciones";

// Laboratorio de la v2 (rama feat/v2). Fuera del sitemap y en noindex.
export const metadata: Metadata = {
  title: "Lab · v2",
  robots: { index: false, follow: false },
};

// Tipografías de la v2: serif de titulares + grotesca para todo lo demás.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-v2-serif",
  display: "swap",
});
const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-v2-sans",
  display: "swap",
});

export default function Page() {
  return (
    <div className={`${serif.variable} ${sans.variable} v2`}>
      {/* La v2 trae su propia cabecera: se ocultan la del sitio actual y el
          botón flotante (y el pie: la v2 cierra con el suyo). El cursor custom de la v1 se apaga y vuelve el nativo
          (la v1 pone cursor:none en <html> cuando su cursor está activo). */}
      <style>{`body > header, body > footer, body > a[href*="wa.me"], html.has-custom-cursor .cursor-root { display: none !important; } html.has-custom-cursor { cursor: auto !important; }`}</style>
      <HeroV2 />
      <Senales />
      <DosOjos />
      <Servicios />
      <Yeimmy />
      <Consultorio />
      <Cierre />
    </div>
  );
}
