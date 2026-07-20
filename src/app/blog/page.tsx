import type { Metadata } from "next";
import { whatsappLink } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import Backdrop from "@/components/ui/Backdrop";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";

/**
 * /blog — ruta y layout preparados, aún SIN artículos.
 * IMPORTANTE: noindex (index: false) hasta publicar al menos 3 artículos;
 * una sección vacía indexada perjudica más de lo que aporta. Al publicar,
 * cambiar a index: true y añadir la ruta al sitemap (sesión 6).
 */
export const metadata: Metadata = buildMetadata({
  title: "Blog de salud visual",
  description:
    "Artículos sobre salud visual infantil, terapia visual, estrabismo y ambliopía, escritos para familias. Muy pronto.",
  path: "/blog/",
  index: false,
});

export default function BlogPage() {
  return (
    <section
      aria-labelledby="blog-title"
      className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-soft"
    >
      <Parallax className="absolute inset-0 z-0" amount={10}>
        <Backdrop variant="iris" flip />
      </Parallax>

      <span
        aria-hidden="true"
        className="watermark absolute -left-[4vw] bottom-[4vh] text-[22vw] text-primary-100/60 sm:text-[15vw]"
      >
        leer
      </span>

      <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8 lg:py-32">
        <Reveal className="flex max-w-2xl flex-col items-start gap-6">
          <span className="eyebrow">Blog</span>
          <h1 id="blog-title">
            <span className="block text-5xl sm:text-6xl lg:text-7xl">
              Artículos que
            </span>
            <span className="accent-word block text-4xl sm:text-5xl lg:text-6xl">
              vienen en camino
            </span>
          </h1>
          <p className="max-w-[52ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700">
            Aquí encontrarás pronto artículos sobre salud visual infantil,
            escritos para familias y sin tecnicismos: cómo detectar señales a
            tiempo, qué esperar de la terapia visual y respuestas a las dudas
            más frecuentes de la consulta.
          </p>
          <p className="max-w-[52ch] leading-relaxed text-slate-ink-700">
            Mientras tanto, si tienes una duda concreta sobre la visión de tu
            hijo, no la dejes esperando a un artículo:
          </p>
          <Button href={whatsappLink()} external size="lg">
            Pregúntame por WhatsApp
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
