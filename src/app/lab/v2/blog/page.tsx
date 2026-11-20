import type { Metadata } from "next";
import BlogV2 from "@/components/v2/paginas/BlogV2";

// Laboratorio de la v2 (noindex). Al publicar, la ruta real cambia su cuerpo
// por <BlogV2 /> y conserva su metadata y JSON-LD.
export const metadata: Metadata = {
  title: "Lab · v2 · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BlogV2 />;
}
