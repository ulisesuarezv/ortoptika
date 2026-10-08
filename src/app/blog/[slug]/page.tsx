import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_CONFIG, whatsappLink } from "@/lib/constants";
import {
  CLUSTERS,
  formatFecha,
  getPost,
  getPosts,
  getRelated,
  getServicio,
  lastModified,
  readingMinutes,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";
import { blogPostingSchema, jsonLd } from "@/lib/schema";
import Backdrop from "@/components/ui/Backdrop";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";

/**
 * Artículo del blog (/blog/[slug]) — prerenderizado en build (static export)
 * para cada entrada de src/lib/blog.ts. El cuerpo se importa del .mdx con el
 * mismo slug; la tipografía la pone src/mdx-components.tsx.
 *
 * E-E-A-T (contenido de salud, YMYL): autora con foto y credenciales visibles,
 * fecha de revisión clínica, aviso de que no sustituye una valoración y
 * JSON-LD MedicalWebPage + BlogPosting con reviewedBy/lastReviewed.
 */

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

// Sólo se generan los slugs del registro; cualquier otro → 404.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    ...buildMetadata({
      title: post.metaTitle ?? post.titulo,
      description: post.descripcion,
      path: `/blog/${slug}/`,
      article: {
        publishedTime: post.publicado,
        modifiedTime: lastModified(post),
      },
    }),
    ...(post.keywords ? { keywords: post.keywords } : {}),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Contenido } = await import(`@/content/blog/${slug}.mdx`);
  const servicio = getServicio(post);
  const relacionados = getRelated(post);
  const minutos = readingMinutes(slug);
  const actualizado = post.actualizado && post.actualizado !== post.publicado;

  return (
    <>
      <script
        {...jsonLd(
          blogPostingSchema({
            slug,
            titulo: post.titulo,
            descripcion: post.descripcion,
            publicado: post.publicado,
            actualizado: lastModified(post),
            revisadoEl: post.revisadoEl,
            tema: post.tema,
            keywords: post.keywords,
          }),
        )}
      />

      <article>
        {/* ============ Cabecera ============ */}
        <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-cream to-cream-soft">
          <Parallax className="absolute inset-0 z-0" amount={10}>
            <Backdrop variant="iris" flip />
          </Parallax>

          <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 lg:pb-20 lg:pt-16">
            <Reveal className="flex max-w-4xl flex-col items-start gap-6">
              <nav aria-label="Migas de pan" className="font-heading text-sm text-slate-ink-500">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/blog/" className="hover:text-primary-700">
                      Blog
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-slate-ink-700">{CLUSTERS[post.cluster]}</li>
                </ol>
              </nav>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl">{post.titulo}</h1>

              <p className="max-w-[60ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700 sm:text-xl">
                {post.descripcion}
              </p>

              {/* Byline: quién firma y cuándo se revisó (E-E-A-T) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Image
                  src="/images/dra-yeimmy-barragan.webp"
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 rounded-full object-cover object-[42%_30%] ring-2 ring-white"
                />
                <div className="flex flex-col gap-0.5 text-sm">
                  <Link
                    href="/sobre-mi/"
                    className="font-heading font-semibold text-slate-ink-900 hover:text-primary-700"
                  >
                    {SITE_CONFIG.profesional}
                  </Link>
                  <span className="text-slate-ink-500">{SITE_CONFIG.titulo}</span>
                  <span className="text-slate-ink-500">
                    <time dateTime={post.publicado}>{formatFecha(post.publicado)}</time>
                    {actualizado && (
                      <>
                        {" · Actualizado el "}
                        <time dateTime={post.actualizado}>
                          {formatFecha(post.actualizado!)}
                        </time>
                      </>
                    )}
                    {` · ${minutos} min de lectura`}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </header>

        {/* ============ Cuerpo + columna lateral ============ */}
        <div className="bg-cream">
          <div className="mx-auto grid max-w-7xl gap-y-14 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-x-10 lg:py-20">
            <div className="min-w-0 lg:col-span-8 [&>*:first-child]:mt-0">
              <div className="max-w-[68ch]">
                <Contenido />

                <p className="mt-14 rounded-2xl bg-cream-soft px-6 py-5 text-sm leading-relaxed text-slate-ink-500">
                  Contenido informativo revisado clínicamente por{" "}
                  {SITE_CONFIG.profesional} el{" "}
                  <time dateTime={post.revisadoEl}>{formatFecha(post.revisadoEl)}</time>.
                  No reemplaza una valoración: cada caso necesita un examen
                  presencial.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="flex flex-col gap-5 rounded-3xl bg-slate-ink-900 p-7 text-slate-ink-200 lg:sticky lg:top-28" data-cursor-theme="dark">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                  ¿Te reconoces en esto?
                </p>
                <p className="font-display text-2xl leading-snug text-white">
                  Una valoración aclara más que cualquier artículo.
                </p>
                <p className="text-sm leading-relaxed">
                  Atención presencial en {SITE_CONFIG.direccion.ciudad}. Si
                  vienes de otra ciudad, escríbeme y organizamos la cita.
                </p>
                <Button
                  href={whatsappLink(
                    `Hola, leí el artículo "${post.titulo}" y quisiera agendar una valoración.`,
                  )}
                  external
                >
                  Escribir por WhatsApp
                </Button>
                <Link
                  href={`/servicios/${servicio.slug}/`}
                  className="font-heading text-sm font-semibold text-white underline decoration-accent-500 decoration-2 underline-offset-4 hover:text-accent-200"
                >
                  Ver el servicio de {servicio.titulo.toLowerCase()} →
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* ============ Quién escribe ============ */}
        <section
          aria-labelledby="autora-title"
          className="border-t border-line bg-cream-soft"
        >
          <Reveal className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:px-8 lg:py-16">
            <Image
              src="/images/dra-yeimmy-barragan.webp"
              alt={`${SITE_CONFIG.profesional}, ${SITE_CONFIG.titulo.toLowerCase()}`}
              width={112}
              height={112}
              className="size-28 shrink-0 rounded-full object-cover object-[42%_30%] ring-4 ring-white"
            />
            <div className="flex max-w-[62ch] flex-col gap-2">
              <span className="eyebrow">Quién escribe</span>
              <h2 id="autora-title" className="text-2xl sm:text-3xl">
                {SITE_CONFIG.profesional}
              </h2>
              <p className="leading-relaxed text-slate-ink-700">
                {SITE_CONFIG.credenciales.especializacion}.{" "}
                {SITE_CONFIG.credenciales.aniosExperiencia} años de ejercicio
                como optómetra. {SITE_CONFIG.credenciales.registroProfesional}.
              </p>
              <Link
                href="/sobre-mi/"
                className="font-heading text-sm font-semibold text-primary-700 underline decoration-accent-500 decoration-2 underline-offset-4"
              >
                Conocer su trayectoria
              </Link>
            </div>
          </Reveal>
        </section>
      </article>

      {/* ============ Sigue leyendo ============ */}
      {relacionados.length > 0 && (
        <section aria-labelledby="relacionados-title" className="bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
            <h2 id="relacionados-title" className="mb-8 text-3xl sm:text-4xl">
              Sigue leyendo
            </h2>
            <ul className="grid gap-6 md:grid-cols-2">
              {relacionados.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/blog/${rel.slug}/`}
                    className="group flex h-full flex-col gap-3 rounded-3xl bg-surface p-7 shadow-soft ring-1 ring-line transition-shadow hover:shadow-card"
                  >
                    <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
                      {CLUSTERS[rel.cluster]}
                    </span>
                    <span className="font-display text-2xl leading-snug text-slate-ink-900 group-hover:text-primary-700">
                      {rel.titulo}
                    </span>
                    <span className="text-slate-ink-700">{rel.descripcion}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
