import { SITE_CONFIG, whatsappLink } from "@/lib/constants";
import Button from "@/components/ui/Button";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import Reveal from "@/components/ui/Reveal";
import Backdrop from "@/components/ui/Backdrop";
import Parallax from "@/components/ui/Parallax";

// FAQ — copy BORRADOR (revisable por la doctora). El schema FAQPage y las FAQ
// específicas por servicio llegan en las landings de las sesiones 4-5.
const HOME_FAQ: FAQItem[] = [
  {
    question: "¿A qué edad puede empezar la terapia visual un niño?",
    answer:
      "Cada niño es distinto, por eso el primer paso siempre es una valoración. A partir de ahí vemos si la terapia visual es adecuada y cómo adaptarla a su edad y a su ritmo. Escríbeme y lo revisamos juntos.",
  },
  {
    question: "¿En qué consiste la primera cita?",
    answer:
      "Es una valoración tranquila: conversamos sobre lo que te preocupa, exploramos cómo trabajan los ojos y, si hace falta, planteamos los siguientes pasos. La idea es que salgas con las cosas claras, sin tecnicismos.",
  },
  {
    question: "¿Dónde atiendes y cómo agendo?",
    answer: `Atiendo en ${SITE_CONFIG.direccion.completa}. La forma más cómoda de reservar es por WhatsApp: te respondo personalmente para encontrar un horario que te venga bien.`,
  },
  {
    question: "¿Atiendes a pacientes de otras ciudades de Colombia?",
    answer:
      "Sí. La atención es presencial en Ibagué, y con frecuencia recibo a familias que viajan desde otras ciudades porque la ortóptica es un servicio escaso en el país. Si vienes de fuera, escríbeme por WhatsApp antes de tu viaje: te oriento sobre si una valoración tiene sentido en tu caso y coordinamos la cita para aprovechar bien tu visita.",
  },
];

/**
 * Contacto disruptivo: "Hablemos" a escala 25vw como gráfico de fondo, tarjeta
 * de contacto superpuesta y ligeramente rotada (columna estrecha) y FAQ ancho
 * con índice 02. Canal único WhatsApp; horarios placeholder hasta confirmar.
 */
export default function ContactSection() {
  return (
    <section
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-cream-soft"
    >
      {/* Capa de fondo: ondas ópticas fluyendo tras la tarjeta y el FAQ */}
      <Parallax className="absolute inset-0 z-0" amount={8}>
        <Backdrop variant="waves" flip className="opacity-70" />
      </Parallax>

      {/* Palabra gigante como gráfico de fondo */}
      <Parallax className="absolute -left-[3vw] top-[8vh] z-0" amount={6}>
        <span
          aria-hidden="true"
          className="watermark block text-[25vw] text-cream-deep"
        >
          Hablemos
        </span>
      </Parallax>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          {/* Tarjeta de contacto superpuesta y rotada */}
          <Reveal from="left" scale className="lg:col-span-5">
            <div className="flex -rotate-[1.5deg] flex-col items-start gap-5 rounded-[2rem] border border-line bg-surface p-8 shadow-lift sm:p-10">
              <span className="eyebrow">Contacto</span>
              <h2 id="contact-title" className="text-4xl sm:text-5xl">
                Agenda tu <em className="accent-word">cita</em>
              </h2>
              <p className="max-w-prose leading-relaxed text-slate-ink-700">
                La atención es con cita previa. La forma más rápida de reservar o
                de resolver una duda es por WhatsApp: escríbeme y te respondo
                personalmente para orientarte sobre el primer paso.
              </p>

              <dl className="mt-2 w-full divide-y divide-line border-t border-line text-sm">
                <div className="flex flex-col gap-1 py-4">
                  <dt className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
                    Ubicación
                  </dt>
                  <dd className="text-slate-ink-700">
                    {SITE_CONFIG.direccion.completa}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <dt className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
                    Horarios
                  </dt>
                  <dd className="text-slate-ink-700">
                    {SITE_CONFIG.horarios.texto}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  <dt className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
                    WhatsApp
                  </dt>
                  <dd className="text-slate-ink-700">{SITE_CONFIG.telefono}</dd>
                </div>
              </dl>

              <Button href={whatsappLink()} external size="lg" className="mt-2">
                Escribir por WhatsApp
              </Button>
            </div>
          </Reveal>

          {/* FAQ — columna ancha, con índice sobredimensionado */}
          <Reveal
            delay={0.1}
            from="right"
            className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7 lg:pt-6"
          >
            <div className="flex items-start gap-5">
              <span
                aria-hidden="true"
                className="section-index text-7xl leading-none sm:text-8xl"
              >
                02
              </span>
              <h3 className="mt-2 font-display text-3xl font-medium sm:text-4xl">
                Preguntas
                <br />
                frecuentes
              </h3>
            </div>
            <FAQAccordion items={HOME_FAQ} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
