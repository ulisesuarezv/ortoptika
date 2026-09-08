import Link from "next/link";
import { SERVICES, SITE_CONFIG, whatsappLink } from "@/lib/constants";
import type { ServiceContent } from "@/lib/services-content";
import { SERVICE_PHOTOS } from "@/lib/photos";
import Backdrop from "@/components/ui/Backdrop";
import Button from "@/components/ui/Button";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Parallax from "@/components/ui/Parallax";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";

/**
 * Plantilla de landing de servicio — Server Component.
 *
 * Flujo del brief: qué es → tipos/causas → cómo lo trata la terapia →
 * proceso → para quién → FAQ. Hereda el lenguaje disruptivo del sitio
 * (watermarks, anti-grid, Backdrop, índices gigantes, meta vertical) y
 * varía por servicio vía `content.theme` (watermark, variantes, flip)
 * para que las 5 landings no sean idénticas.
 *
 * Animación solo en <Reveal>/<Parallax>; el resto es servidor.
 */

/** Índice gigante de sección, estilo editorial compartido con /sobre-mi. */
function SectionIndex({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="section-index block text-[8rem] leading-none lg:text-[11rem]"
    >
      {n}
    </span>
  );
}

export default function ServiceLanding({
  content,
}: {
  content: ServiceContent;
}) {
  const { theme, hero, queEs, tipos, tratamiento, proceso, paraQuien, faq } =
    content;
  const flip = Boolean(theme.flip);
  const otros = SERVICES.filter((s) => s.slug !== content.slug);

  // Fotografía asignada a esta landing (ver src/lib/photos.ts). Las tres
  // ranuras son opcionales e independientes: ninguna landing las usa todas.
  const fotos = SERVICE_PHOTOS[content.slug] ?? {};
  const fotoProceso = fotos.proceso;
  const procesoApaisada = fotoProceso
    ? fotoProceso.width > fotoProceso.height
    : false;

  // Offsets escalonados reutilizados en tarjetas (anti-grid sin caos).
  const cardOffsets = ["lg:mr-14", "lg:ml-10 lg:-rotate-[0.8deg]", "lg:mr-4", "lg:ml-16"];

  return (
    <article>
      {/* ============ HERO — titular fragmentado + watermark ============ */}
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-cream to-cream-soft">
        <Parallax className="absolute inset-0 z-0" amount={12}>
          <Backdrop variant={theme.heroBackdrop} flip={flip} />
        </Parallax>

        <span
          aria-hidden="true"
          className={`watermark absolute bottom-[2vh] text-[20vw] text-primary-100/70 sm:text-[14vw] ${
            flip ? "-left-[4vw]" : "-right-[4vw]"
          }`}
        >
          {theme.watermark}
        </span>

        {/* Meta vertical en el borde */}
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 z-20 hidden items-center lg:flex ${
            flip ? "right-2" : "left-2"
          }`}
        >
          <span className="vertical-text font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-ink-400">
            {SITE_CONFIG.direccion.ciudad} · {SITE_CONFIG.direccion.departamento}
            <span className="mx-3 text-primary-400">—</span>
            terapia visual
          </span>
        </div>

        <div
          className={`relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:pb-28 lg:pt-16 ${
            flip ? "lg:pr-16" : "lg:pl-16"
          }`}
        >
          {/* Breadcrumb editorial */}
          <Reveal as="nav" aria-label="Ruta de navegación" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-slate-ink-400">
              <li>
                <Link
                  href="/"
                  className="inline-block py-1.5 transition-colors hover:text-primary-700"
                >
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="text-primary-400">
                —
              </li>
              <li>
                <span className="text-primary-700">{content.nombre}</span>
              </li>
            </ol>
          </Reveal>

          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal
              className={`flex flex-col items-start gap-5 ${
                fotos.cutout ? "lg:col-span-7" : "lg:col-span-9"
              }`}
            >
              <span className="eyebrow">{hero.eyebrow}</span>
              <h1 className="max-w-[16ch]">
                <span className="block font-display text-2xl italic text-slate-ink-500 sm:text-3xl">
                  {hero.tituloPre}
                </span>
                <span className="block text-6xl sm:text-7xl lg:-mr-16 lg:text-8xl">
                  {hero.tituloGrande}
                </span>
                <span className="accent-word block text-3xl sm:text-4xl lg:text-5xl">
                  {hero.tituloAccent}
                </span>
              </h1>
            </Reveal>

            {/* Recorte con alfa: flota sobre el crema sin marco y sangra por el
                borde. Parallax más alto que el resto (20): al no tener marco,
                el desplazamiento es lo único que le da profundidad. */}
            {fotos.cutout ? (
              <Reveal
                delay={0.08}
                from="right"
                scale
                className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 lg:self-center"
              >
                <Parallax amount={20}>
                  <Photo
                    photo={fotos.cutout}
                    variant="cutout"
                    className="mx-auto max-w-[20rem] sm:max-w-sm lg:max-w-none lg:-mr-[6vw]"
                  />
                </Parallax>
              </Reveal>
            ) : null}

            <Reveal
              delay={0.12}
              className={`flex flex-col items-start gap-6 ${
                fotos.cutout
                  ? "lg:col-span-7 lg:col-start-1 lg:row-start-2"
                  : "lg:col-span-8 lg:col-start-4"
              }`}
            >
              <p className="max-w-[52ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700">
                {hero.lead}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  href={whatsappLink(hero.whatsappMessage)}
                  external
                  size="lg"
                >
                  Agendar valoración por WhatsApp
                </Button>
                <Button href="/contacto" variant="ghost" size="lg">
                  Ver ubicación y contacto
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ============ 01 · QUÉ ES — índice sticky + señales ============ */}
      <section
        aria-labelledby={`${content.slug}-quees`}
        className="relative overflow-hidden bg-cream"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal from="left" className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionIndex n="01" />
                <h2
                  id={`${content.slug}-quees`}
                  className="-mt-5 max-w-[14ch] text-3xl sm:text-4xl lg:-mt-8"
                >
                  {queEs.titulo}
                </h2>
              </div>
            </Reveal>

            <div className="flex flex-col gap-10 lg:col-span-7 lg:col-start-6 lg:pt-14">
              <Reveal className="flex flex-col gap-6">
                {queEs.parrafos.map((p, i) => (
                  <p
                    key={i}
                    className={`max-w-[58ch] leading-relaxed text-slate-ink-700 ${
                      i % 2 === 1 ? "lg:ml-10" : ""
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </Reveal>

              {/* Señales observables: tarjeta rotada con hairlines */}
              <Reveal
                from="right"
                className="-rotate-[0.8deg] rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8 lg:-ml-6 lg:mr-10"
              >
                <h3 className="font-heading text-base font-bold text-primary-700">
                  {queEs.senalesTitulo}
                </h3>
                <ul className="mt-4 flex flex-col">
                  {queEs.senales.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-3 border-b border-line py-3 text-sm leading-relaxed text-slate-ink-700 last:border-b-0"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-muted">
                  Observar una de estas señales no es un diagnóstico: es un buen
                  motivo para una valoración profesional.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 · TIPOS / CAUSAS — tarjetas escalonadas ============ */}
      <section
        aria-labelledby={`${content.slug}-tipos`}
        className="relative overflow-hidden border-y border-line bg-surface"
      >
        <Parallax className="absolute inset-0 z-0" amount={8}>
          <Backdrop variant={theme.midBackdrop} flip={!flip} />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal
              from={flip ? "left" : "right"}
              className={`lg:col-span-5 ${flip ? "" : "lg:text-right lg:col-start-8 lg:order-last"}`}
            >
              <SectionIndex n="02" />
              <h2
                id={`${content.slug}-tipos`}
                className="-mt-5 text-3xl sm:text-4xl lg:-mt-8"
              >
                {tipos.titulo}
              </h2>
              <p
                className={`mt-4 max-w-[38ch] leading-relaxed text-muted ${
                  flip ? "" : "lg:ml-auto"
                }`}
              >
                {tipos.intro}
              </p>
            </Reveal>

            <Reveal
              stagger
              from={flip ? "right" : "left"}
              className={`flex flex-col gap-5 lg:col-span-6 ${
                flip ? "lg:col-start-7" : "lg:col-start-1 lg:row-start-1"
              }`}
            >
              {tipos.items.map((item, i) => (
                <div
                  key={item.nombre}
                  className={`rounded-xl border border-line bg-cream p-6 shadow-soft ${
                    cardOffsets[i % cardOffsets.length]
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-3xl italic leading-none text-primary-300"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-medium text-slate-ink-900">
                        {item.nombre}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-ink-700">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 03 · CÓMO LO TRATA LA TERAPIA ============ */}
      <section
        aria-labelledby={`${content.slug}-tratamiento`}
        className="relative overflow-hidden bg-cream"
      >
        <span
          aria-hidden="true"
          className={`watermark absolute top-16 text-[16vw] text-primary-100/50 sm:text-[11vw] ${
            flip ? "-right-[3vw]" : "-left-[3vw]"
          }`}
        >
          cómo
        </span>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal className="max-w-2xl">
            <SectionIndex n="03" />
            <h2
              id={`${content.slug}-tratamiento`}
              className="-mt-5 text-3xl sm:text-4xl lg:-mt-8"
            >
              {tratamiento.titulo}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="flex flex-col gap-6 lg:col-span-5">
              {tratamiento.parrafos.map((p, i) => (
                <p key={i} className="leading-relaxed text-slate-ink-700">
                  {p}
                </p>
              ))}
            </Reveal>

            {/* Puntos del abordaje: filas hairline con flecha, cabalgan a la derecha */}
            <Reveal
              as="ul"
              stagger
              className="lg:col-span-6 lg:col-start-7 lg:-mt-6"
            >
              {tratamiento.puntos.map((punto) => (
                <li
                  key={punto}
                  className="flex items-start gap-4 border-b border-line py-4 leading-relaxed text-slate-ink-700 first:border-t"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                  <span className="text-sm sm:text-base">{punto}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ BANDA A SANGRE — el espacio real (opcional) ============ */}
      {fotos.bleed ? (
        <section
          aria-label="El espacio donde se hace la terapia"
          data-cursor-theme="dark"
          className="relative border-y border-line bg-slate-ink-900"
        >
          <div className="relative h-[clamp(16rem,38vh,26rem)] overflow-hidden">
            <Parallax className="absolute inset-x-0 -inset-y-[10%]" amount={12}>
              <Photo
                photo={fotos.bleed}
                variant="bleed"
                objectPosition="50% 62%"
                className="h-full w-full"
              />
            </Parallax>
          </div>
        </section>
      ) : null}

      {/* ============ 04 · PROCESO — numerales gigantes alternados ============ */}
      <section
        aria-labelledby={`${content.slug}-proceso`}
        className="relative overflow-hidden border-y border-line bg-cream-soft"
      >
        <Parallax className="absolute inset-0 z-0" amount={10}>
          <Backdrop variant={theme.heroBackdrop} flip={!flip} className="opacity-60" />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className={fotoProceso ? "lg:grid lg:grid-cols-12 lg:gap-x-10" : ""}>
          <div className={fotoProceso ? "lg:col-span-8" : ""}>
          <Reveal className="max-w-2xl">
            <SectionIndex n="04" />
            <h2
              id={`${content.slug}-proceso`}
              className="-mt-5 text-3xl sm:text-4xl lg:-mt-8"
            >
              {proceso.titulo}
            </h2>
            <p className="mt-5 leading-relaxed text-slate-ink-700">
              {proceso.intro}
            </p>
          </Reveal>

          <ol className="mt-14 flex flex-col gap-12 lg:gap-16">
            {proceso.pasos.map((paso, i) => (
              <Reveal
                as="li"
                key={paso.titulo}
                className={`max-w-2xl border-t border-line pt-8 ${
                  ["", "lg:ml-[24%]", "lg:ml-[8%]", "lg:ml-[32%]"][i % 4]
                }`}
              >
                <div className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="watermark w-16 shrink-0 text-7xl text-primary-200 sm:text-8xl"
                  >
                    {i + 1}
                  </span>
                  <div className="pt-2">
                    <h3 className="font-heading text-lg font-bold text-primary-700">
                      {paso.titulo}
                    </h3>
                    <p className="mt-2 leading-relaxed text-slate-ink-700">
                      {paso.descripcion}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
          </div>

          {/* Foto de apoyo: acompaña los pasos en scroll (sticky) en vez de
              interrumpirlos. Debajo de lg vuelve al flujo, al final. */}
          {fotoProceso ? (
            <Reveal
              delay={0.15}
              from="right"
              scale
              className="mt-14 lg:col-span-4 lg:mt-0"
            >
              <div className="lg:sticky lg:top-32">
                <Photo
                  photo={fotoProceso}
                  caption={fotoProceso.caption}
                  className={`w-full overflow-hidden rounded-[2.5rem] shadow-lift ring-1 ring-line ${
                    procesoApaisada ? "aspect-[3/2]" : "aspect-[4/5]"
                  }`}
                />
              </div>
            </Reveal>
          ) : null}
          </div>
        </div>
      </section>

      {/* ============ 05 · PARA QUIÉN + nota YMYL ============ */}
      <section
        aria-labelledby={`${content.slug}-paraquien`}
        className="relative overflow-hidden bg-cream"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="lg:col-span-5">
              <SectionIndex n="05" />
              <h2
                id={`${content.slug}-paraquien`}
                className="-mt-5 max-w-[14ch] text-3xl sm:text-4xl lg:-mt-8"
              >
                {paraQuien.titulo}
              </h2>
              <p className="mt-4 max-w-[40ch] leading-relaxed text-muted">
                {paraQuien.intro}
              </p>
            </Reveal>

            <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
              <Reveal as="ul" stagger>
                {paraQuien.perfiles.map((perfil) => (
                  <li
                    key={perfil}
                    className="flex items-start gap-4 border-b border-line py-4 leading-relaxed text-slate-ink-700 first:border-t"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500"
                    />
                    <span className="text-sm sm:text-base">{perfil}</span>
                  </li>
                ))}
              </Reveal>

              <Reveal>
                <p className="-rotate-[0.6deg] rounded-lg bg-primary-50 px-5 py-4 text-sm leading-relaxed text-slate-ink-700 ring-1 ring-primary-100">
                  {paraQuien.nota}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 06 · FAQ + CTA final ============ */}
      <section
        aria-labelledby={`${content.slug}-faq`}
        className="relative overflow-hidden border-t border-line bg-surface"
      >
        <span
          aria-hidden="true"
          className={`watermark absolute bottom-10 text-[18vw] text-primary-100/50 sm:text-[12vw] ${
            flip ? "-left-[3vw]" : "-right-[3vw]"
          }`}
        >
          dudas
        </span>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
            <Reveal className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionIndex n="06" />
                <h2
                  id={`${content.slug}-faq`}
                  className="-mt-5 text-3xl sm:text-4xl lg:-mt-8"
                >
                  Preguntas frecuentes
                </h2>
                <p className="mt-4 max-w-[32ch] leading-relaxed text-muted">
                  Las dudas que más escucho en consulta sobre{" "}
                  {content.nombre.toLowerCase()}. Si la tuya no está, escríbeme
                  y la resolvemos.
                </p>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-7 lg:col-start-6">
              <FAQAccordion items={faq} />
            </Reveal>
          </div>

          {/* CTA final + enlaces cruzados a los demás servicios */}
          <Reveal className="mt-20 border-t border-line pt-12">
            <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
              <div className="flex flex-col items-start gap-6 lg:col-span-6">
                <h2 className="max-w-[18ch] text-3xl sm:text-4xl">
                  ¿Crees que este es{" "}
                  <em className="accent-word">tu caso</em>?
                </h2>
                <p className="max-w-[46ch] leading-relaxed text-slate-ink-700">
                  Escríbeme por WhatsApp y me cuentas qué has observado. El
                  primer paso siempre es el mismo: una valoración completa para
                  entender qué está pasando.
                </p>
                {/* Encuadre nacional: pacientes que viajan; sin prometer
                    valoración ni terapia a distancia (servicio presencial). */}
                <p className="max-w-[46ch] text-sm leading-relaxed text-muted">
                  ¿Vives fuera de Ibagué? La atención es presencial, pero
                  muchas familias viajan desde otras ciudades de Colombia.
                  Escríbeme antes de tu viaje y te oriento para organizar la
                  visita.
                </p>
                <Button
                  href={whatsappLink(hero.whatsappMessage)}
                  external
                  size="lg"
                >
                  Escribir por WhatsApp
                </Button>
              </div>

              <nav
                aria-label="Otros servicios"
                className="lg:col-span-5 lg:col-start-8"
              >
                <h3 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-slate-ink-500">
                  Otros servicios
                </h3>
                <ul className="mt-4">
                  {otros.map((s) => (
                    <li key={s.slug} className="border-b border-line">
                      <Link
                        href={`/servicios/${s.slug}`}
                        className="group flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-primary-700"
                      >
                        <span className="font-display text-lg font-medium text-slate-ink-900 transition-colors group-hover:text-primary-700">
                          {s.titulo}
                        </span>
                        <svg
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-primary-700 transition-transform duration-300 group-hover:translate-x-1"
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
                </ul>
              </nav>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
