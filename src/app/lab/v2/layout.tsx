import type { ReactNode } from "react";
import { Instrument_Serif, Inter_Tight } from "next/font/google";

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

export default function LayoutV2({ children }: { children: ReactNode }) {
  return (
    <div className={`${serif.variable} ${sans.variable} v2`}>
      {/* La v2 trae su propia cabecera y pie: se ocultan los del sitio actual y el
          botón flotante. El cursor custom de la v1 se apaga y vuelve el nativo
          (la v1 pone cursor:none en <html> cuando su cursor está activo). */}
      <style>{`body > header, body > footer, body > a[href*="wa.me"], html.has-custom-cursor .cursor-root { display: none !important; } html.has-custom-cursor { cursor: auto !important; }`}</style>
      {children}
    </div>
  );
}
