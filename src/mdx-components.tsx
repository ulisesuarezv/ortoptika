import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

/**
 * Tipografía de los artículos del blog (src/content/blog/*.mdx).
 *
 * Archivo obligatorio de @next/mdx en App Router. Mapea el HTML que genera el
 * Markdown a las clases del sitio, así los .mdx se escriben en Markdown plano
 * sin una sola clase. Server Components: nada de esto llega como JS al cliente.
 *
 * Componentes propios disponibles en cualquier .mdx sin importarlos:
 *   <Nota>…</Nota>                    dato a destacar (azul)
 *   <Nota tipo="consulta">…</Nota>    señal de alarma / cuándo consultar (lima)
 */

function MdxLink({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  const className =
    "font-medium text-primary-700 underline decoration-accent-500 decoration-2 underline-offset-4 transition-colors hover:text-primary-900";

  // Enlaces internos por next/link (prefetch); externos en pestaña nueva.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

function Nota({
  tipo = "dato",
  children,
}: {
  tipo?: "dato" | "consulta";
  children: ReactNode;
}) {
  const consulta = tipo === "consulta";
  return (
    <aside
      className={`my-10 rounded-2xl border-l-4 px-6 py-5 [&>p]:my-2 ${
        consulta
          ? "border-accent-500 bg-accent-50"
          : "border-primary-500 bg-primary-50"
      }`}
    >
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary-800">
        {consulta ? "Cuándo consultar" : "Para tener en cuenta"}
      </p>
      {children}
    </aside>
  );
}

const components: MDXComponents = {
  // El <h1> lo pone la página con el título del registro: dentro del .mdx los
  // titulares empiezan en ##. Si alguien escribe # por error, baja a h2.
  h1: ({ children }) => <h2 className="mt-16 mb-5 text-3xl sm:text-4xl">{children}</h2>,
  h2: ({ children }) => <h2 className="mt-16 mb-5 text-3xl sm:text-4xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-10 mb-3 text-xl">{children}</h3>,
  p: ({ children }) => (
    <p className="my-5 text-lg leading-relaxed text-slate-ink-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-6 flex list-none flex-col gap-3 pl-0 text-lg leading-relaxed text-slate-ink-700 [&>li]:relative [&>li]:pl-7 [&>li]:before:absolute [&>li]:before:left-1 [&>li]:before:top-[0.7em] [&>li]:before:size-2 [&>li]:before:rounded-full [&>li]:before:bg-accent-500 [&>li]:before:content-['']">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 flex list-decimal flex-col gap-3 pl-6 text-lg leading-relaxed text-slate-ink-700 marker:font-heading marker:font-bold marker:text-primary-600">
      {children}
    </ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-ink-900">{children}</strong>
  ),
  a: MdxLink,
  blockquote: ({ children }) => (
    <blockquote className="my-10 border-l-2 border-accent-500 pl-6 font-display text-2xl italic leading-snug text-slate-ink-900 [&>p]:text-2xl [&>p]:text-slate-ink-900">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-14 border-line" />,
  Nota,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
