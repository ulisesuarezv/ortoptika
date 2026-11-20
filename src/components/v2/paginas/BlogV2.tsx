/**
 * /blog de la v2 — Server Component. Aún sin artículos (la ruta real sigue en
 * noindex hasta tener al menos 3). Texto de la v1; mientras tanto, la página
 * manda a las landings de servicio, que ya responden las dudas de cada caso.
 */
import Link from "next/link";
import { SERVICES, whatsappLink } from "@/lib/constants";
import Aparece from "../Aparece";
import Cabecera from "../Cabecera";
import { Pie } from "../Secciones";
import { servicioV2 } from "../rutas";
import { eyebrow, h1, sans, serif } from "../estilos";

export default function BlogV2() {
  return (
    <article className={`${sans} text-[#02223b]`}>
      <header className="relative overflow-hidden bg-[#f6f2ea]">
        <Cabecera />
        {/* Renglones de cuaderno: la página en blanco que se va a escribir */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 top-24 [background-image:linear-gradient(rgba(2,34,59,.07)_1px,transparent_1px)] [background-size:100%_3.2rem] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
        />
        <div className="relative mx-auto max-w-[90rem] px-5 pb-24 pt-10 lg:min-h-[calc(80svh-6.5rem)] lg:px-14 lg:pb-32 lg:pt-20">
          <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
            Blog
          </Aparece>
          <Aparece retraso={80}>
            <h1 className={`${h1} mt-6 max-w-[12ch]`}>
              Artículos que <em className="text-[#0e4d7a]">vienen en camino</em>
              <span aria-hidden="true" className="ml-2 inline-block h-[0.8em] w-[3px] translate-y-[0.08em] animate-pulse bg-[#a8cf45] motion-reduce:animate-none" />
            </h1>
          </Aparece>
          <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-6">
            <Aparece as="p" retraso={160} className="text-lg leading-relaxed tracking-[-0.01em] lg:col-span-6 lg:text-2xl">
              Aquí encontrarás pronto artículos sobre salud visual infantil, escritos para familias y sin tecnicismos:
              cómo detectar señales a tiempo, qué esperar de la terapia visual y respuestas a las dudas más frecuentes
              de la consulta.
            </Aparece>
            <Aparece retraso={240} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
                Mientras tanto, si tienes una duda concreta sobre la visión de tu hijo, no la dejes esperando a un
                artículo:
              </p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full bg-[#02223b] px-7 py-4 text-base font-medium text-white transition-transform hover:-translate-y-0.5">
                Pregúntame por WhatsApp
              </a>
            </Aparece>
          </div>
        </div>
      </header>

      <section aria-labelledby="para-leer" className="bg-[#02223b] px-5 pb-10 pt-24 text-white lg:px-14 lg:pt-36">
        <div className="mx-auto max-w-[90rem]">
          <Aparece as="p" className={`${eyebrow} text-[#a8cf45]`}>
            Para leer ya
          </Aparece>
          <Aparece retraso={80}>
            <h2 id="para-leer" className={`${serif} mt-5 max-w-[16ch] text-[clamp(2.6rem,1rem+4vw,5rem)] leading-[0.95] tracking-[-0.02em] text-white`}>
              Cada servicio, <em className="text-[#a8cf45]">explicado</em>.
            </h2>
          </Aparece>
          <Aparece as="p" retraso={140} className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-[#b9c9d6] lg:text-lg">
            Qué es, señales en casa, cómo se trabaja en consulta y preguntas frecuentes.
          </Aparece>
          <ul className="mt-14 border-t border-white/15">
            {SERVICES.map((s, i) => (
              <Aparece as="li" key={s.slug} retraso={i * 60} className="border-b border-white/15">
                <Link href={servicioV2(s.slug)} className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-7 lg:grid-cols-[5rem_1fr_1fr_auto] lg:py-9">
                  <span className="hidden text-sm text-[#a8cf45] lg:block">0{i + 1}</span>
                  <span className={`${serif} text-[2rem] leading-none tracking-[-0.01em] text-white transition-transform duration-500 group-hover:translate-x-3 lg:text-[3.2rem]`}>
                    {s.titulo}
                  </span>
                  <span className="col-span-2 row-start-2 text-[15px] text-[#b9c9d6] lg:col-span-1 lg:row-start-auto lg:text-lg">{s.resumen}</span>
                  <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition-colors duration-500 group-hover:border-[#a8cf45] group-hover:bg-[#a8cf45] lg:h-14 lg:w-14">
                    <svg viewBox="0 0 16 16" className="h-4 w-4 -rotate-45 text-white transition-[rotate,color] duration-500 group-hover:rotate-0 group-hover:text-[#02223b]">
                      <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Aparece>
            ))}
          </ul>
          <Pie />
        </div>
      </section>
    </article>
  );
}
