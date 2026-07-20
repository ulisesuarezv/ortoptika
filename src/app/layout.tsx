import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "../styles/globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { GtmNoScript, GtmScript } from "@/components/layout/GoogleTagManager";

// Tipografía de marca (next/font/google) — estrategia anti-CLS de la Sesión 7:
// SOLO 2 woff2 en el camino crítico (Fraunces normal + Inter, ~115KB), que son
// los candidatos a LCP (titular display + cuerpo) → preload + display:"swap".
// Plus Jakarta (UI) y la itálica de Fraunces (accent-words/watermarks/índices,
// familia SEPARADA) van preload:false + display:"optional": NO usar "swap" en
// ellas — el swap tardío re-wrapeaba los titulares fragmentados y disparaba
// CLS 0.25 en las landings. Con "optional", en frío se ve el fallback métrico
// (Georgia itálica, digno) y, ya cacheada, la Fraunces itálica real.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
});

const frauncesItalic = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: "italic",
  variable: "--font-fraunces-italic",
  display: "optional",
  preload: false,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "optional",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
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
    <html
      lang="es"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GtmNoScript />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <GtmScript />
      </body>
    </html>
  );
}
