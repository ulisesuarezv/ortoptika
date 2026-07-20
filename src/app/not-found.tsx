import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import Backdrop from "@/components/ui/Backdrop";
import Button from "@/components/ui/Button";

/**
 * 404 con el lenguaje visual del sitio: número a escala extrema como
 * watermark, mensaje empático y salidas útiles (home + servicios).
 * Sin Reveal: en una página de error el contenido debe verse al instante.
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-soft">
      <Backdrop variant="dots" flip />

      <span
        aria-hidden="true"
        className="watermark absolute -right-[6vw] top-1/2 -translate-y-1/2 text-[38vw] text-primary-100/70 sm:text-[26vw]"
      >
        404
      </span>

      <div className="relative z-10 mx-auto flex min-h-[65vh] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex max-w-2xl flex-col items-start gap-6">
          <span className="eyebrow">Error 404</span>
          <h1>
            <span className="block text-5xl sm:text-6xl lg:text-7xl">
              Esta página
            </span>
            <span className="accent-word block text-4xl sm:text-5xl lg:text-6xl">
              se nos perdió de vista
            </span>
          </h1>
          <p className="max-w-[48ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700">
            La dirección que buscas no existe o cambió de lugar. Lo importante
            no se ha movido: puedes volver al inicio o ir directo a lo que
            necesitas.
          </p>
          <Button href="/" size="lg">
            Volver al inicio
          </Button>

          <nav aria-label="Servicios" className="mt-6 w-full">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-slate-ink-500">
              ¿Buscabas alguno de estos servicios?
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/servicios/${s.slug}`}
                    className="font-semibold text-primary-700 underline-offset-2 hover:underline"
                  >
                    {s.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
