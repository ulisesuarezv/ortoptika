/**
 * 404 de la v2 — Server Component. Texto de la v1 (src/app/not-found.tsx).
 * Sin <Aparece>: en una página de error todo debe verse al instante.
 */
import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import Cabecera from "../Cabecera";
import { Pie } from "../Secciones";
import { rutaV2, servicioV2 } from "../rutas";
import { eyebrow, h1, sans, serif } from "../estilos";

export default function NoEncontradaV2() {
  return (
    <article className={`${sans} text-[#02223b]`}>
      <header className="relative overflow-hidden bg-[#f6f2ea]">
        <Cabecera />
        {/* El 404 desenfocado al fondo: lo que no se alcanza a ver */}
        <span
          aria-hidden="true"
          className={`${serif} pointer-events-none absolute -right-[4vw] top-1/2 -translate-y-1/2 select-none text-[clamp(14rem,36vw,40rem)] leading-none tracking-[-0.04em] text-[#0e4d7a]/10 blur-[6px] max-lg:top-auto max-lg:bottom-0 max-lg:translate-y-[18%]`}
        >
          404
        </span>
        <div className="relative mx-auto flex max-w-[90rem] flex-col justify-center px-5 pb-24 pt-10 lg:min-h-[calc(78svh-6.5rem)] lg:px-14 lg:pb-28">
          <p className={`${eyebrow} text-[#0e4d7a]`}>Error 404</p>
          <h1 className={`${h1} mt-6 max-w-[13ch]`}>
            Esta página <em className="text-[#0e4d7a]">se nos perdió de vista</em>.
          </h1>
          <p className="mt-8 max-w-[46ch] text-[15px] leading-relaxed text-[#33506a] lg:text-xl lg:leading-relaxed">
            La dirección que buscas no existe o cambió de lugar. Lo importante no se ha movido: puedes volver al inicio
            o ir directo a lo que necesitas.
          </p>
          <div className="mt-10">
            <Link href={rutaV2("/")} className="inline-flex rounded-full bg-[#02223b] px-7 py-4 text-base font-medium text-white transition-transform hover:-translate-y-0.5">
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="buscabas" className="bg-[#02223b] px-5 pb-10 pt-20 text-white lg:px-14 lg:pt-28">
        <div className="mx-auto max-w-[90rem]">
          <h2 id="buscabas" className={`${sans} ${eyebrow} text-[#a8cf45]`}>
            ¿Buscabas alguno de estos servicios?
          </h2>
          <ul className="mt-8 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map((s) => (
              <li key={s.slug} className="border-b border-white/15 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <Link href={servicioV2(s.slug)} className={`${serif} group flex items-center justify-between gap-4 py-6 text-[1.7rem] leading-none tracking-[-0.01em] text-white lg:px-5 lg:py-10 lg:first:pl-0`}>
                  {s.titulo}
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 flex-none -rotate-45 text-[#a8cf45] transition-[rotate] duration-500 group-hover:rotate-0">
                    <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <Pie />
        </div>
      </section>
    </article>
  );
}
