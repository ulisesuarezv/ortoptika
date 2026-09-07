import type { Metadata } from "next";
import { SITE_CONFIG, whatsappLink } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { jsonLd, medicalBusinessSchema } from "@/lib/schema";
import Backdrop from "@/components/ui/Backdrop";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Contacto y ubicación en Ibagué",
  description: `Agenda tu cita de ortóptica y terapia visual por WhatsApp. Atención en ${SITE_CONFIG.direccion.clinica}, ${SITE_CONFIG.direccion.ciudad}. Dirección, horarios y cómo llegar.`,
  path: "/contacto/",
});

/**
 * /contacto — canal único: WhatsApp (sin formulario, decisión del brief).
 * Mapa embebido: iframe con la URL de SITE_CONFIG.googleMapsEmbed (ya apunta
 * al CID real de la ficha de Google Business). El bloque de abajo queda como
 * fallback por si esa constante se vacía.
 *
 * JSON-LD: MedicalBusiness (mismo @id que en la home), con horarios reales y
 * `geo`/`hasMap` del pin real.
 */
export default function ContactoPage() {
  const embedUrl = SITE_CONFIG.googleMapsEmbed;

  return (
    <>
      <script {...jsonLd(medicalBusinessSchema())} />

      {/* ============ Encabezado — "Hablemos" a escala extrema ============ */}
      <section
        aria-labelledby="contacto-title"
        className="relative overflow-hidden border-b border-line bg-gradient-to-b from-cream to-cream-soft"
      >
        <Parallax className="absolute inset-0 z-0" amount={10}>
          <Backdrop variant="waves" />
        </Parallax>

        <span
          aria-hidden="true"
          className="watermark absolute -right-[4vw] bottom-[2vh] text-[20vw] text-primary-100/70 sm:text-[14vw]"
        >
          hola
        </span>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:pb-24 lg:pl-16 lg:pt-20">
          <Reveal className="flex flex-col items-start gap-6">
            <span className="eyebrow">Contacto</span>
            <h1 id="contacto-title" className="max-w-[14ch]">
              <span className="block text-6xl sm:text-7xl lg:text-8xl">
                Hablemos
              </span>
              <span className="accent-word block text-3xl sm:text-4xl lg:text-5xl">
                por WhatsApp
              </span>
            </h1>
            <p className="max-w-[50ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700">
              Sin formularios ni esperas: escríbeme directamente, me cuentas
              qué te preocupa y coordinamos la cita. Respondo personalmente.
            </p>
            <Button href={whatsappLink()} external size="lg">
              Escribir por WhatsApp
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ============ Datos + mapa — tarjeta que cabalga sobre el mapa ============ */}
      <section
        aria-labelledby="ubicacion-title"
        className="relative overflow-hidden bg-cream"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6 lg:items-start">
            {/* Tarjeta de datos: rotada, solapa el mapa en desktop */}
            <Reveal className="relative z-20 lg:col-span-5">
              <div className="-rotate-[1deg] rounded-2xl border border-line bg-surface p-7 shadow-lift sm:p-9 lg:mr-[-3rem]">
                <h2 id="ubicacion-title" className="text-3xl sm:text-4xl">
                  Dónde <em className="accent-word">encontrarme</em>
                </h2>

                <dl className="mt-8 flex flex-col gap-6">
                  <div>
                    <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary-700">
                      Consulta
                    </dt>
                    <dd className="mt-2 leading-relaxed text-slate-ink-700">
                      <address className="not-italic">
                        <strong className="font-semibold text-slate-ink-900">
                          {SITE_CONFIG.direccion.clinica}
                        </strong>
                        <br />
                        {SITE_CONFIG.direccion.calle}
                        <br />
                        {SITE_CONFIG.direccion.ciudad},{" "}
                        {SITE_CONFIG.direccion.departamento}
                      </address>
                    </dd>
                  </div>

                  <div>
                    <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary-700">
                      WhatsApp y teléfono
                    </dt>
                    <dd className="mt-2 leading-relaxed text-slate-ink-700">
                      <a
                        href={SITE_CONFIG.telefonoHref}
                        className="inline-block py-1 font-semibold text-slate-ink-900 underline-offset-2 hover:underline"
                      >
                        {SITE_CONFIG.telefono}
                      </a>
                      <br />
                      <span className="text-sm text-muted">
                        La forma más rápida de agendar es el botón de WhatsApp.
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary-700">
                      Horarios
                    </dt>
                    <dd className="mt-2 leading-relaxed text-slate-ink-700">
                      <span className="font-semibold text-slate-ink-900">
                        {SITE_CONFIG.horarios.dias}
                      </span>
                      <br />
                      {SITE_CONFIG.horarios.turnos.map((turno) => (
                        <span key={turno} className="block text-sm">
                          {turno}
                        </span>
                      ))}
                      <span className="mt-2 inline-block text-sm text-muted">
                        Atención solo particular (sin EPS ni prepagada). Cita
                        siempre con reserva previa — la primera valoración dura
                        aproximadamente una hora.
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary-700">
                      Redes e email
                    </dt>
                    <dd className="mt-2 leading-relaxed text-slate-ink-700">
                      <a
                        href={SITE_CONFIG.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1 font-semibold text-primary-700 underline-offset-2 hover:underline"
                      >
                        {SITE_CONFIG.social.instagramHandle}
                      </a>
                      <br />
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="inline-block py-1 text-sm text-slate-ink-700 underline-offset-2 hover:underline"
                      >
                        {SITE_CONFIG.email}
                      </a>
                    </dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <Button href={whatsappLink()} external>
                    Agendar una cita
                  </Button>
                </div>
              </div>
            </Reveal>

            {/* Mapa: iframe listo para la URL de embed; placeholder mientras */}
            <Reveal
              delay={0.12}
              className="relative z-10 lg:col-span-7 lg:col-start-6 lg:mt-16"
            >
              <div className="overflow-hidden rounded-3xl border border-line shadow-card">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={`Mapa: ${SITE_CONFIG.direccion.completa}`}
                    width="100%"
                    height="480"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  /* Fallback: sólo se ve si SITE_CONFIG.googleMapsEmbed queda
                     vacío. Hoy tiene valor real, así que el iframe gana. */
                  <div className="img-placeholder flex aspect-[4/3] items-center justify-center sm:aspect-[16/10]">
                    <div className="relative z-10 mx-6 max-w-sm rounded-xl border border-dashed border-slate-ink-300 bg-surface/90 p-5 text-center text-sm leading-relaxed text-slate-ink-700">
                      <p className="font-semibold text-slate-ink-900">
                        Mapa de Google en camino
                      </p>
                      <p className="mt-1">
                        {SITE_CONFIG.direccion.completa}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          SITE_CONFIG.direccion.completa,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block py-1 font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
                      >
                        Abrir en Google Maps →
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {/* pl en desktop: la tarjeta de datos solapa el borde izquierdo */}
              <p className="mt-4 text-sm leading-relaxed text-muted lg:pl-20">
                La consulta está dentro de la {SITE_CONFIG.direccion.clinica},
                consultorio 212. Si te pierdes al llegar, escríbeme y te
                oriento.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Qué esperar al escribir ============ */}
      <section
        aria-labelledby="pasos-contacto-title"
        className="relative overflow-hidden border-t border-line bg-cream-soft"
      >
        <Parallax className="absolute inset-0 z-0" amount={8}>
          <Backdrop variant="dots" flip />
        </Parallax>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <Reveal className="max-w-2xl">
            <h2 id="pasos-contacto-title" className="text-3xl sm:text-4xl">
              Qué pasa cuando <em className="accent-word">escribes</em>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Me cuentas tu caso",
                d: "Qué has observado, desde cuándo y a quién buscas ayudar. Sin tecnicismos: con tus palabras.",
              },
              {
                n: "2",
                t: "Coordinamos la cita",
                d: "Buscamos juntos el horario que mejor le sirva a tu familia y te confirmo todo por el mismo chat.",
              },
              {
                n: "3",
                t: "Llegas sin papeleo",
                d: "Solo trae los exámenes o fórmulas anteriores si los tienes. Lo demás lo hacemos en consulta.",
              },
            ].map((paso, i) => (
              <Reveal
                key={paso.n}
                delay={i * 0.08}
                className={i === 1 ? "sm:mt-10" : ""}
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="watermark w-12 shrink-0 text-6xl text-primary-200 sm:text-7xl"
                  >
                    {paso.n}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-heading text-base font-bold text-primary-700">
                      {paso.t}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-ink-700">
                      {paso.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
