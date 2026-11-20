/**
 * Landing de servicio de la v2 — Server Component.
 *
 * Mismo copy y orden que la v1 (services-content.ts manda; el SEO no cambia):
 * hero → qué es + señales → tipos → cómo se aborda → proceso → para quién →
 * preguntas → otros servicios → cierre. Cada servicio tiene su pieza del ojo en
 * el hero (OjoServicio) y un índice lateral fijo en escritorio.
 */
import Link from "next/link";
import { SERVICES, SITE_CONFIG, whatsappLink } from "@/lib/constants";
import { SERVICE_PHOTOS, type Photo } from "@/lib/photos";
import type { ServiceContent } from "@/lib/services-content";
import Aparece from "../Aparece";
import { Pie } from "../Secciones";
import { rutaV2, servicioV2 } from "../rutas";
import Indice from "./Indice";
import BarraRecorrido from "./BarraRecorrido";
import BrockRecorrido from "./BrockRecorrido";
import OjoServicio from "./OjoServicio";

const serif = "font-[family-name:var(--font-v2-serif)]";
const sans = "font-[family-name:var(--font-v2-sans)]";
const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.22em]";
const h2 = `${serif} text-[clamp(2.4rem,1rem+3.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em]`;

/** Titular de sección: el último tramo en cursiva azul ("Qué es *el estrabismo*"). */
function Titular({ id, texto }: { id: string; texto: string }) {
  const corte = texto.lastIndexOf(" ", Math.floor(texto.length * 0.55));
  const a = corte > 0 ? texto.slice(0, corte) : texto;
  const b = corte > 0 ? texto.slice(corte + 1) : "";
  return (
    <Aparece>
      <h2 id={id} className={`${h2} text-[#02223b]`}>
        {a} {b && <em className="text-[#0e4d7a]">{b}</em>}
      </h2>
    </Aparece>
  );
}

function Foto({ foto, className = "" }: { foto: Photo; className?: string }) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-[2rem] bg-[#e7e1d5]" style={{ aspectRatio: `${foto.width} / ${foto.height}` }}>
        <picture>
          <source media="(max-width: 640px)" srcSet={foto.srcSm} />
          <img src={foto.src} alt={foto.alt} width={foto.width} height={foto.height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
      </div>
      <figcaption className="mt-3 text-sm text-[#4d6880]">{foto.caption}</figcaption>
    </figure>
  );
}

const Flecha = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
    <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LandingV2({ content }: { content: ServiceContent }) {
  const { hero, queEs, tipos, tratamiento, proceso, paraQuien, faq } = content;
  const n = SERVICES.findIndex((s) => s.slug === content.slug) + 1;
  const horizontal = content.slug === "vision-binocular";
  const otros = SERVICES.filter((s) => s.slug !== content.slug);
  const fotos = SERVICE_PHOTOS[content.slug] ?? {};
  const foto = fotos.cutout ?? fotos.proceso ?? fotos.bleed;
  const wa = whatsappLink(hero.whatsappMessage);

  const secciones = [
    { id: "que-es", t: queEs.titulo },
    { id: "tipos", t: tipos.titulo },
    { id: "tratamiento", t: tratamiento.titulo },
    { id: "proceso", t: proceso.titulo },
    { id: "para-quien", t: paraQuien.titulo },
    { id: "preguntas", t: "Preguntas frecuentes" },
  ];

  return (
    <article className={`${sans} text-[#02223b]`}>
      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden bg-[#f6f2ea]">
        <div
          aria-hidden="true"
          className="absolute -right-[22vw] top-[8%] h-[110vmin] w-[110vmin] rounded-full bg-[radial-gradient(circle,#e3ecdf_0%,#efeee4_45%,transparent_70%)] max-lg:-right-[40vw] max-lg:top-[38%]"
        />
        <nav className="relative z-20 flex items-center justify-between px-5 py-5 text-sm lg:px-14 lg:py-7">
          <Link href={rutaV2("/")} className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.14em]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/logo-mark-eye-brain-sm.webp" alt="" width={48} height={26} className="h-[26px] w-auto" />
            ORTOPTIKA
          </Link>
          <div className="hidden gap-9 text-[#02223b]/75 lg:flex">
            <Link href={`${rutaV2("/")}#servicios`}>Servicios</Link>
            <Link href="/sobre-mi/">Yeimmy</Link>
            <Link href="/contacto/">Consultorio</Link>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-[#02223b] px-4 py-2.5 font-medium text-white lg:px-5 lg:py-3">
            <span className="h-2 w-2 rounded-full bg-[#a8cf45]" />
            <span>Agendar<span className="max-lg:hidden">&nbsp;cita</span></span>
          </a>
        </nav>

        <div className="relative mx-auto grid max-w-[90rem] px-5 pb-16 pt-6 lg:min-h-[calc(100svh-6.5rem)] lg:grid-cols-12 lg:content-center lg:gap-y-10 lg:px-14 lg:pb-24">
          <div className="relative z-10 lg:col-span-7 lg:row-start-1 lg:self-end">
            <Aparece as="p" className={`${eyebrow} flex flex-wrap items-center gap-x-3 gap-y-2 text-[#0e4d7a]`}>
              <Link href={`${rutaV2("/")}#servicios`} className="hover:text-[#02223b]">
                Servicios
              </Link>
              <span aria-hidden="true" className="h-px w-6 bg-[#0e4d7a]/40" />
              <span>
                0{n} / 0{SERVICES.length}
              </span>
            </Aparece>
            <Aparece retraso={80}>
              <h1 className={`${serif} mt-6 text-[clamp(3.2rem,1rem+6.4vw,7rem)] leading-[0.92] tracking-[-0.02em] text-[#02223b]`}>
                <span className="block">{hero.tituloPre}</span>
                <span className="block">
                  {hero.tituloGrande} <em className="text-[#0e4d7a]">{hero.tituloAccent}</em>
                </span>
              </h1>
            </Aparece>
          </div>
          {/* En móvil la pieza va entre el titular y el texto; en escritorio, a la derecha.
              Visión binocular: la barra de luces es larga, va a todo el ancho debajo del texto. */}
          <OjoServicio
            slug={content.slug}
            className={
              horizontal
                ? "relative order-last -mx-5 mt-6 h-[clamp(230px,30vw,400px)] lg:col-span-12 lg:row-start-2 lg:mx-0 lg:mt-0"
                : "relative -mx-5 -my-2 aspect-[50/51] max-h-[56svh] lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:my-0 lg:aspect-auto lg:max-h-none lg:w-[46%]"
            }
          />
          <div className={`relative z-10 ${horizontal ? "lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end" : "lg:col-span-7 lg:row-start-2"}`}>
            <Aparece as="p" retraso={160} className={`max-w-[40rem] text-[15px] leading-relaxed text-[#33506a] lg:text-lg ${horizontal ? "max-lg:mt-8" : "lg:mt-10"}`}>
              {hero.lead}
            </Aparece>
            <Aparece retraso={240} className="mt-8 flex flex-wrap gap-3.5">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#02223b] px-6 py-3.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">
                Agendar valoración por WhatsApp
              </a>
              <a href="#senales" className="rounded-full border border-[#02223b]/20 px-6 py-3.5 text-sm font-medium transition-colors hover:border-[#02223b]">
                Ver señales en casa
              </a>
            </Aparece>
          </div>
        </div>
      </header>

      {/* Estrabismo: el ejercicio del cordón de Brock, contado con scroll */}
      {content.slug === "estrabismo" && <BrockRecorrido />}

      {/* Visión binocular: el ejercicio de la barra de luces, contado con scroll */}
      {content.slug === "vision-binocular" && <BarraRecorrido />}

      {/* ================= CUERPO CON ÍNDICE ================= */}
      <div className="bg-white px-5 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12 lg:gap-6">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-12 pt-32">
              <Indice secciones={secciones} />
              <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-12 inline-flex items-center gap-2 rounded-full bg-[#a8cf45] px-5 py-3 text-sm font-semibold text-[#02223b]">
                Escribir por WhatsApp
              </a>
            </div>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            {/* Qué es */}
            <section aria-labelledby="que-es" className="scroll-mt-10 pb-20 pt-24 lg:pb-28 lg:pt-32">
              <Aparece as="p" className={`${eyebrow} mb-5 text-[#0e4d7a]`}>
                01 · Entenderlo
              </Aparece>
              <Titular id="que-es" texto={queEs.titulo} />
              <div className="mt-10 space-y-6 lg:mt-14">
                {queEs.parrafos.map((p, i) => (
                  <Aparece as="p" key={i} retraso={i * 60} className={i === 0 ? "text-lg leading-relaxed tracking-[-0.01em] text-[#02223b] lg:text-2xl" : "max-w-[62ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg"}>
                    {p}
                  </Aparece>
                ))}
              </div>

              <Aparece className="mt-14 lg:mt-20">
                <div id="senales" className="scroll-mt-10 rounded-[2rem] bg-[#02223b] p-7 text-white lg:p-12">
                  <p className={`${eyebrow} text-[#a8cf45]`}>En casa</p>
                  <h3 className={`${serif} mt-4 text-[clamp(2rem,1rem+2vw,3.2rem)] leading-[0.95] tracking-[-0.02em] text-white`}>{queEs.senalesTitulo}</h3>
                  <ul className="mt-8 grid gap-x-10 border-t border-white/15 sm:grid-cols-2">
                    {queEs.senales.map((s) => (
                      <li key={s} className="flex gap-4 border-b border-white/15 py-4 text-[15px] leading-snug text-[#dfe8ee] lg:text-base">
                        <span aria-hidden="true" className="mt-1.5 h-2 w-2 flex-none rounded-full bg-[#a8cf45]" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-[#b9c9d6]">
                    ¿Reconoces alguna?
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-[#a8cf45] px-5 py-3 text-sm font-semibold text-[#02223b]">
                      Cuéntamelo por WhatsApp
                    </a>
                  </p>
                </div>
              </Aparece>
            </section>

            {/* Tipos */}
            <section aria-labelledby="tipos" className="scroll-mt-10 border-t border-[#02223b]/12 py-20 lg:py-28">
              <Aparece as="p" className={`${eyebrow} mb-5 text-[#0e4d7a]`}>
                02 · Tipos
              </Aparece>
              <Titular id="tipos" texto={tipos.titulo} />
              <Aparece as="p" retraso={80} className="mt-8 max-w-[62ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
                {tipos.intro}
              </Aparece>
              <ol className="mt-12 grid gap-x-10 sm:grid-cols-2">
                {tipos.items.map((t, i) => (
                  <Aparece as="li" key={t.nombre} retraso={i * 70} className="border-t border-[#02223b] pb-8 pt-5">
                    <span className="text-sm text-[#0e4d7a]">0{i + 1}</span>
                    <h3 className={`${serif} mt-2 text-[1.9rem] leading-[1.02] tracking-[-0.01em] text-[#02223b]`}>{t.nombre}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#4d6880]">{t.descripcion}</p>
                  </Aparece>
                ))}
              </ol>
            </section>

            {/* Tratamiento */}
            <section aria-labelledby="tratamiento" className="scroll-mt-10 border-t border-[#02223b]/12 py-20 lg:py-28">
              <Aparece as="p" className={`${eyebrow} mb-5 text-[#0e4d7a]`}>
                03 · En consulta
              </Aparece>
              <Titular id="tratamiento" texto={tratamiento.titulo} />
              <div className="mt-10 space-y-6">
                {tratamiento.parrafos.map((p, i) => (
                  <Aparece as="p" key={i} retraso={i * 60} className="max-w-[62ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
                    {p}
                  </Aparece>
                ))}
              </div>
              <Aparece className="mt-12 rounded-[2rem] bg-[#f6f2ea] p-7 lg:p-10">
                <p className={`${eyebrow} text-[#0e4d7a]`}>En qué puede ayudar</p>
                <ul className="mt-6 space-y-4">
                  {tratamiento.puntos.map((p) => (
                    <li key={p} className="flex gap-4 text-[15px] leading-snug lg:text-lg">
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-1 h-4 w-4 flex-none text-[#0e4d7a]">
                        <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </Aparece>
              {foto && (
                <Aparece className="mt-12">
                  <Foto foto={foto} />
                </Aparece>
              )}
            </section>

            {/* Proceso */}
            <section aria-labelledby="proceso" className="scroll-mt-10 border-t border-[#02223b]/12 py-20 lg:py-28">
              <Aparece as="p" className={`${eyebrow} mb-5 text-[#0e4d7a]`}>
                04 · Paso a paso
              </Aparece>
              <Titular id="proceso" texto={proceso.titulo} />
              <Aparece as="p" retraso={80} className="mt-8 max-w-[62ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
                {proceso.intro}
              </Aparece>
              <ol className="relative mt-12 space-y-0">
                {proceso.pasos.map((p, i) => (
                  <Aparece as="li" key={p.titulo} retraso={i * 70} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-[#02223b]/15 py-7 lg:grid-cols-[5rem_1fr_1.3fr] lg:gap-x-8">
                    <span className={`${serif} text-4xl leading-none text-[#0e4d7a] lg:text-5xl`}>{i + 1}</span>
                    <h3 className={`${sans} text-lg font-medium leading-snug tracking-[-0.01em] text-[#02223b] lg:text-xl`}>{p.titulo}</h3>
                    <p className="col-start-2 mt-2 text-[15px] leading-relaxed text-[#4d6880] lg:col-start-3 lg:mt-0">{p.descripcion}</p>
                  </Aparece>
                ))}
              </ol>
            </section>

            {/* Para quién */}
            <section aria-labelledby="para-quien" className="scroll-mt-10 border-t border-[#02223b]/12 py-20 lg:py-28">
              <Aparece as="p" className={`${eyebrow} mb-5 text-[#0e4d7a]`}>
                05 · Para quién
              </Aparece>
              <Titular id="para-quien" texto={paraQuien.titulo} />
              <Aparece as="p" retraso={80} className="mt-8 max-w-[62ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
                {paraQuien.intro}
              </Aparece>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {paraQuien.perfiles.map((p, i) => (
                  <Aparece as="li" key={p} retraso={i * 60} className="rounded-2xl border border-[#02223b]/12 p-6 text-[15px] leading-snug lg:text-base">
                    {p}
                  </Aparece>
                ))}
              </ul>
              <Aparece as="p" className="mt-8 border-l-2 border-[#a8cf45] pl-5 text-sm leading-relaxed text-[#4d6880]">
                {paraQuien.nota}
              </Aparece>
            </section>

            {/* Preguntas */}
            <section aria-labelledby="preguntas" className="scroll-mt-10 border-t border-[#02223b]/12 pb-28 pt-20 lg:pb-40 lg:pt-28">
              <Aparece as="p" className={`${eyebrow} mb-5 text-[#0e4d7a]`}>
                06 · Dudas
              </Aparece>
              <Titular id="preguntas" texto="Preguntas frecuentes" />
              <div className="mt-10 border-t border-[#02223b]/15">
                {faq.map((f) => (
                  <details key={f.question} className="group border-b border-[#02223b]/15">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium tracking-[-0.01em] lg:text-xl [&::-webkit-details-marker]:hidden">
                      {f.question}
                      <span aria-hidden="true" className="relative h-4 w-4 flex-none">
                        <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                        <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                      </span>
                    </summary>
                    <p className="max-w-[62ch] pb-7 text-[15px] leading-relaxed text-[#4d6880] lg:text-lg">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ================= OTROS SERVICIOS ================= */}
      <section aria-labelledby="otros-titulo" className="bg-[#f6f2ea] px-5 py-20 lg:px-14 lg:py-28">
        <div className="mx-auto max-w-[90rem]">
          <p className={`${eyebrow} text-[#0e4d7a]`}>Otros servicios</p>
          <h2 id="otros-titulo" className={`${h2} mt-5 text-[#02223b]`}>
            También <em className="text-[#0e4d7a]">trabajamos</em>
          </h2>
          <ul className="mt-12 grid border-t border-[#02223b]/15 sm:grid-cols-2 lg:grid-cols-4">
            {otros.map((s) => (
              <li key={s.slug} className="border-b border-[#02223b]/15 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
                <Link href={servicioV2(s.slug)} className="group flex h-full flex-col justify-between gap-10 p-6 transition-colors duration-500 hover:bg-[#02223b] lg:p-8">
                  <span className={`${serif} text-[2rem] leading-none tracking-[-0.01em] transition-colors duration-500 group-hover:text-white`}>{s.titulo}</span>
                  <span className="flex items-end justify-between gap-4 text-sm text-[#4d6880] transition-colors duration-500 group-hover:text-[#b9c9d6]">
                    {s.resumen}
                    <Flecha className="h-4 w-4 flex-none -rotate-45 text-[#02223b] transition-[rotate,color] duration-500 group-hover:rotate-0 group-hover:text-[#a8cf45]" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= CIERRE ================= */}
      <section aria-labelledby="cierre-servicio" className="bg-[#02223b] px-5 pb-10 pt-24 text-white lg:px-14 lg:pt-36">
        <div className="mx-auto max-w-[90rem]">
          <h2 id="cierre-servicio" className={`${serif} max-w-[14ch] text-[clamp(3rem,1rem+5.6vw,7rem)] leading-[0.92] tracking-[-0.02em] text-white`}>
            El primer paso es <em className="text-[#a8cf45]">una valoración</em>.
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-[#a8cf45] px-7 py-4 text-base font-semibold text-[#02223b] transition-transform hover:-translate-y-0.5">
              Agendar por WhatsApp
            </a>
            <p className="text-[15px] leading-relaxed text-[#b9c9d6]">
              {SITE_CONFIG.direccion.clinica} · {SITE_CONFIG.direccion.ciudad}
              <br />
              {SITE_CONFIG.horarios.dias}
            </p>
          </div>
          <Pie />
        </div>
      </section>
    </article>
  );
}
