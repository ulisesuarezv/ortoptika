import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";
import {
  CLUSTERS,
  formatFecha,
  getPosts,
  isBlogPublico,
  readingMinutes,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";
import Backdrop from "@/components/ui/Backdrop";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";

/**
 * /blog — índice de artículos (registro en src/lib/blog.ts).
 *
 * Queda en noindex hasta tener al menos 3 artículos (isBlogPublico): una
 * sección casi vacía indexada perjudica más de lo que aporta. Con 0 artículos
 * muestra el estado "vienen en camino"; con 1-2 ya los lista, pero sin
 * indexar el índice. Los artículos en sí se indexan desde el primero.
 */
export const metadata: Metadata = buildMetadata({
  title: "Blog de salud visual",
  description:
    "Artículos sobre ortóptica, terapia visual, ojo vago y estrabismo en niños y adultos, revisados por una optómetra especialista. Para pacientes y familias de toda Colombia.",
  path: "/blog/",
  index: isBlogPublico(),
});

export default function BlogPage() {
  const posts = getPosts();

  return (
    <>
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

        <div
          className={`relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-5 sm:px-8 ${
            posts.length ? "py-20 lg:py-24" : "min-h-[60vh] py-24 lg:py-32"
          }`}
        >
          {posts.length ? (
            <Reveal className="flex max-w-2xl flex-col items-start gap-6">
              <span className="eyebrow">Blog</span>
              <h1 id="blog-title">
                <span className="block text-5xl sm:text-6xl lg:text-7xl">
                  Salud visual,
                </span>
                <span className="accent-word block text-4xl sm:text-5xl lg:text-6xl">
                  sin tecnicismos
                </span>
              </h1>
              <p className="max-w-[52ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700">
                Respuestas claras a las dudas que más llegan a consulta: ojo
                vago, estrabismo, terapia visual y la visión de niños y
                adultos. Cada artículo está revisado clínicamente.
              </p>
            </Reveal>
          ) : (
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
                escritos para familias y sin tecnicismos: cómo detectar señales
                a tiempo, qué esperar de la terapia visual y respuestas a las
                dudas más frecuentes de la consulta.
              </p>
              <p className="max-w-[52ch] leading-relaxed text-slate-ink-700">
                Mientras tanto, si tienes una duda concreta sobre la visión de
                tu hijo, no la dejes esperando a un artículo:
              </p>
              <Button href={whatsappLink()} external size="lg">
                Pregúntame por WhatsApp
              </Button>
            </Reveal>
          )}
        </div>
      </section>

      {posts.length > 0 && (
        <section aria-label="Artículos" className="bg-cream">
          <ul className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 md:grid-cols-2 lg:py-20">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="group flex h-full flex-col gap-4 rounded-3xl bg-surface p-7 shadow-soft ring-1 ring-line transition-shadow hover:shadow-card lg:p-9"
                >
                  <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
                    {CLUSTERS[post.cluster]}
                  </span>
                  <h2 className="text-2xl leading-snug group-hover:text-primary-700 sm:text-3xl">
                    {post.titulo}
                  </h2>
                  <p className="leading-relaxed text-slate-ink-700">
                    {post.descripcion}
                  </p>
                  <span className="mt-auto pt-2 text-sm text-slate-ink-500">
                    <time dateTime={post.publicado}>
                      {formatFecha(post.publicado)}
                    </time>
                    {` · ${readingMinutes(post.slug)} min de lectura`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
