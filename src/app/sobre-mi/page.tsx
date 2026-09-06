import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, SERVICES, whatsappLink } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { jsonLd, personSchema } from "@/lib/schema";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Backdrop from "@/components/ui/Backdrop";
import Parallax from "@/components/ui/Parallax";

const { credenciales } = SITE_CONFIG;

export const metadata: Metadata = buildMetadata({
  title: `Sobre ${SITE_CONFIG.profesional}`,
  description: `Conoce a ${SITE_CONFIG.profesional}, ${SITE_CONFIG.titulo.toLowerCase()} en ${SITE_CONFIG.direccion.ciudad}, Colombia. Trayectoria, formación y una forma cercana de acompañar a niños y adultos en su salud visual.`,
  path: "/sobre-mi",
});

/**
 * /sobre-mi — página clave para E-E-A-T en salud (YMYL), re-compuesta con el
 * lenguaje disruptivo: nombre a escala extrema, retrato blob solapado, índices
 * gigantes 01-04 como columna narrativa, credenciales como tarjetas escalonadas
 * y servicios como índice editorial. Server Component; animación solo en
 * <Reveal>/<Parallax> y capas <Backdrop> CSS.
 *
 * Formación, credenciales y años de experiencia: datos reales confirmados
 * por la doctora (ver SITE_CONFIG.credenciales). Su frase personal ("por
 * qué me dediqué a esto") también viene directo de ella.
 */
export default function SobreMiPage() {
  return (
    <>
      {/* Person JSON-LD también aquí: es la URL canónica del profesional. */}
      <script {...jsonLd(personSchema())} />

      {/* Encabezado — nombre a escala extrema, retrato blob solapado */}
      <section
        aria-labelledby="sobremi-title"
        className="relative overflow-hidden border-b border-line bg-gradient-to-b from-cream to-cream-soft"
      >
        <Parallax className="absolute inset-0 z-0" amount={12}>
          <Backdrop variant="blobs" flip />
        </Parallax>

        {/* Palabra-gráfico de fondo (de su filosofía: acompañar con calma) */}
        <span
          aria-hidden="true"
          className="watermark absolute -right-[5vw] bottom-[2vh] text-[22vw] text-primary-100/70 sm:text-[16vw]"
        >
          calma
        </span>

        {/* Meta vertical en el borde izquierdo */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-2 z-20 hidden items-center lg:flex"
        >
          <span className="vertical-text font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-ink-400">
            {SITE_CONFIG.direccion.ciudad} · {SITE_CONFIG.direccion.departamento}
            <span className="mx-3 text-primary-400">—</span>
            {SITE_CONFIG.social.instagramHandle}
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pl-16 lg:pt-20">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="relative z-20 flex flex-col items-start gap-6 lg:col-span-8">
              <span className="eyebrow">Sobre mí</span>
              <h1
                id="sobremi-title"
                className="text-5xl sm:text-6xl lg:text-8xl lg:-mr-24"
              >
                {SITE_CONFIG.profesional}
              </h1>
              <p className="font-heading text-lg font-medium text-primary-700">
                {SITE_CONFIG.titulo}
              </p>
              <p className="max-w-[46ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700">
                Detrás de cada valoración hay una persona que quiere ver mejor
                —y, muchas veces, una familia que quiere lo mejor para su hijo.
                Mi trabajo es acompañarte en ese camino con calma, escucha y un
                plan hecho a tu medida.
              </p>
              <Button href={whatsappLink()} external size="lg">
                Agendar una valoración
              </Button>
            </Reveal>

            {/* Retrato blob que sube y sangra a la derecha */}
            <Reveal
              delay={0.15}
              className="relative z-10 lg:col-span-4 lg:-mt-10"
            >
              {/* Foto real (WebP optimizado, regenerable desde el PNG fuente). */}
              <div className="photo-frame mx-auto aspect-[4/5] w-full max-w-[19rem] rotate-[1.5deg] rounded-[62%_38%_45%_55%/55%_46%_54%_45%] shadow-lift ring-1 ring-line lg:mr-[-2vw] lg:max-w-none">
                <Image
                  src="/images/dra-yeimmy-barragan.webp"
                  alt="Dra. Yeimmy Paola Barragan, optómetra especialista en ortóptica y terapia visual"
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 24rem, 19rem"
                  className="object-cover object-[42%_50%]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 01 — Trayectoria */}
      <section
        aria-labelledby="trayectoria-title"
        className="relative overflow-hidden bg-cream"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
            {/* Columna índice: número gigante + título, pegajosa en desktop */}
            <Reveal className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <span
                  aria-hidden="true"
                  className="section-index block text-[9rem] leading-none lg:text-[13rem]"
                >
                  01
                </span>
                <h2
                  id="trayectoria-title"
                  className="-mt-6 text-3xl sm:text-4xl lg:-mt-10"
                >
                  Mi trayectoria
                </h2>
              </div>
            </Reveal>

            <Reveal className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6 lg:pt-16">
              <p className="leading-relaxed text-slate-ink-700">
                Me gradué como optómetra en la Universidad de La Salle (Bogotá,
                2004) y en 2021 completé mi especialización en Ortóptica y
                Terapia Visual, el área que más me apasiona: entender cómo
                colaboran ambos ojos y ayudar a que ese trabajo en equipo
                funcione mejor.
              </p>
              <p className="max-w-[56ch] leading-relaxed text-slate-ink-700 lg:ml-12">
                Llevo 22 años ejerciendo la optometría y 6 dedicada
                específicamente a la ortóptica, acompañando a niños y adultos
                con estrabismo, ambliopía y dificultades de visión binocular,
                siempre desde el trato cercano y la constancia que requiere
                este tipo de terapia. Me gusta mi profesión porque creo que es
                una manera de ayudar a las personas en momentos difíciles.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 — Formación y credenciales: tarjetas escalonadas */}
      <section
        aria-labelledby="formacion-title"
        className="relative overflow-hidden border-y border-line bg-surface"
      >
        <Parallax className="absolute inset-0 z-0" amount={8}>
          <Backdrop variant="dots" flip />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="lg:col-span-5 lg:text-right">
              <span
                aria-hidden="true"
                className="section-index block text-[9rem] leading-none lg:text-[13rem]"
              >
                02
              </span>
              <h2
                id="formacion-title"
                className="-mt-6 text-3xl sm:text-4xl lg:-mt-10"
              >
                Formación y credenciales
              </h2>
              <p className="mt-4 max-w-[36ch] text-muted lg:ml-auto">
                Estas credenciales respaldan la información de este sitio.
              </p>
            </Reveal>

            {/* Tarjetas escalonadas: cada credencial cae con un offset distinto */}
            <Reveal
              stagger
              className="flex flex-col gap-5 lg:col-span-6 lg:col-start-7"
            >
              {[
                credenciales.tituloOptometra,
                credenciales.especializacion,
                credenciales.registroProfesional,
                `Formación continua: ${credenciales.formacionAdicional.length} cursos y especializaciones adicionales`,
              ].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-start gap-4 rounded-xl border border-line bg-cream px-5 py-4 text-sm text-slate-ink-700 shadow-soft ${
                    ["lg:mr-16", "lg:ml-10", "lg:mr-6 lg:-rotate-[0.8deg]", "lg:ml-20"][i]
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-2xl italic leading-none text-primary-300"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — Filosofía de trabajo: tres principios con numeración gigante */}
      <section
        aria-labelledby="filosofia-title"
        className="relative overflow-hidden bg-cream"
      >
        <Parallax className="absolute inset-0 z-0" amount={10}>
          <Backdrop variant="iris" />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal className="max-w-2xl">
            <span
              aria-hidden="true"
              className="section-index block text-[9rem] leading-none lg:text-[13rem]"
            >
              03
            </span>
            <h2
              id="filosofia-title"
              className="-mt-6 text-3xl sm:text-4xl lg:-mt-10"
            >
              Cómo trabajo
            </h2>
            <p className="mt-5 leading-relaxed text-slate-ink-700">
              Sé que llegar a una consulta visual —sobre todo con un hijo
              pequeño— puede generar dudas y algo de nervios. Por eso cuido tres
              cosas en cada cita:
            </p>
          </Reveal>

          {/* Principios en filas alternadas: izquierda / derecha / izquierda */}
          <dl className="mt-14 flex flex-col gap-12 lg:gap-16">
            {[
              {
                num: "1",
                dt: "Escuchar antes de explorar",
                dd: "Empiezo por entender qué te preocupa y qué han observado en casa. Esa historia es tan importante como las pruebas.",
                offset: "",
              },
              {
                num: "2",
                dt: "Explicar sin tecnicismos",
                dd: "Te cuento qué encuentro y qué opciones hay con palabras claras, sin presionar y respondiendo todas tus preguntas.",
                offset: "lg:ml-[28%]",
              },
              {
                num: "3",
                dt: "Acompañar el proceso",
                dd: "La terapia visual es un camino de constancia. Adapto los ejercicios a cada persona y ajusto el plan según cómo evoluciona.",
                offset: "lg:ml-[10%]",
              },
            ].map((p) => (
              <Reveal
                key={p.num}
                className={`max-w-2xl border-t border-line pt-8 ${p.offset}`}
              >
                <dt className="flex items-start gap-5 font-heading text-lg font-bold text-primary-700">
                  <span
                    aria-hidden="true"
                    className="watermark w-14 shrink-0 text-7xl text-primary-200 sm:text-8xl"
                  >
                    {p.num}
                  </span>
                  <span className="pt-3">{p.dt}</span>
                </dt>
                <dd className="mt-2 leading-relaxed text-slate-ink-700 sm:pl-[4.75rem]">
                  {p.dd}
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="mt-16 max-w-2xl">
            <p className="-rotate-[0.6deg] rounded-lg bg-primary-50 px-5 py-4 text-sm leading-relaxed text-slate-ink-700 ring-1 ring-primary-100">
              Nota importante: cada caso es único. La información de este sitio
              es orientativa y no sustituye una valoración profesional
              individual.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 04 — Índice de servicios (internal linking) + CTA */}
      <section
        aria-labelledby="servicios-link-title"
        className="relative overflow-hidden border-t border-line bg-cream-soft"
      >
        <Parallax className="absolute inset-0 z-0" amount={8}>
          <Backdrop variant="waves" className="opacity-70" />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span
                aria-hidden="true"
                className="section-index block text-[9rem] leading-none lg:text-[13rem]"
              >
                04
              </span>
              <h2
                id="servicios-link-title"
                className="-mt-6 text-3xl sm:text-4xl lg:-mt-10"
              >
                En qué puedo ayudarte
              </h2>
            </div>
          </Reveal>

          {/* Índice editorial de servicios: filas a lo ancho con hairlines */}
          <Reveal as="ul" stagger className="mt-12 border-t border-line">
            {SERVICES.map((service, i) => (
              <li key={service.slug} className="border-b border-line">
                <Link
                  href={`/servicios/${service.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 py-6 transition-colors hover:bg-surface/70 focus-visible:bg-surface/70 sm:gap-x-8 lg:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-2xl italic leading-none text-primary-300 transition-colors group-hover:text-primary-500 sm:text-3xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="font-display text-2xl font-medium text-slate-ink-900 transition-colors group-hover:text-primary-700 sm:text-3xl">
                      {service.titulo}
                    </span>
                    <span className="text-sm text-muted">
                      {service.resumen}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-5 w-5 self-center text-primary-700 transition-transform duration-300 group-hover:translate-x-1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </Link>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-12 flex max-w-2xl flex-col items-start gap-6">
            <p className="leading-relaxed text-slate-ink-700">
              Atiendo de forma presencial en Ibagué, y recibo también a
              familias que viajan desde otras ciudades de Colombia para su
              valoración. ¿No sabes por dónde empezar? Escríbeme por WhatsApp y
              lo vemos juntos. También puedes volver a la{" "}
              <Link
                href="/"
                className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
              >
                página de inicio
              </Link>
              .
            </p>
            <Button href={whatsappLink()} external size="lg">
              Escribir por WhatsApp
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
