import type { Metadata } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import "../styles/globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { GtmNoScript, GtmScript } from "@/components/layout/GoogleTagManager";
import ConsentMode from "@/components/layout/ConsentMode";
import CookieBanner from "@/components/layout/CookieBanner";
import CabeceraFlotante from "@/components/v2/CabeceraFlotante";
import AltoPantalla from "@/components/v2/AltoPantalla";

// Tipografías de la v2: Instrument Serif (titulares, candidato a LCP) + Inter
// Tight (todo lo demás). next/font genera la fuente de respaldo con métricas
// ajustadas, así que el swap no mueve el texto (CLS).
// OJO: Instrument Serif solo tiene peso 400 y la base pone 600 a h1/h2: el
// navegador sintetiza la negrita. Es el aspecto aprobado; no cambiarlo sin querer.
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.profesional} — ${SITE_CONFIG.titulo}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.descripcion,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.profesional }],
  creator: SITE_CONFIG.profesional,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.profesional} — ${SITE_CONFIG.titulo}`,
    description: SITE_CONFIG.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.profesional} — ${SITE_CONFIG.titulo}`,
    description: SITE_CONFIG.descripcion,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-[family-name:var(--font-v2-sans)]">
        <ConsentMode />
        <GtmNoScript />
        <AltoPantalla />
        <CabeceraFlotante />
        <main className="flex-1">{children}</main>
        <CookieBanner />
        <GtmScript />
      </body>
    </html>
  );
}
