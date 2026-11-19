/**
 * Secciones estáticas de la v2: servicios, Yeimmy, consultorio y cierre.
 * Server Components; el movimiento vive en <Aparece> (cliente, aislado).
 * Fotos: solo las que NO muestran pacientes (las autorizaciones de imagen
 * siguen sin firmar).
 */
import Link from "next/link";
import { SERVICES, SITE_CONFIG, whatsappLink } from "@/lib/constants";
import { PHOTOS, type Photo } from "@/lib/photos";
import Aparece from "./Aparece";

const serif = "font-[family-name:var(--font-v2-serif)]";
const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.22em]";

/* ------------------------------------------------------------------ */
/* Servicios                                                           */
/* ------------------------------------------------------------------ */
export function Servicios() {
  return (
    <section aria-labelledby="servicios-titulo" className="bg-[#f6f2ea] px-5 py-24 text-[#02223b] lg:px-14 lg:py-40">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
              Servicios
            </Aparece>
            <Aparece retraso={80}>
              <h2 id="servicios-titulo" className={`${serif} mt-5 text-[clamp(2.8rem,1rem+4.6vw,5.6rem)] leading-[0.95] tracking-[-0.02em]`}>
                Lo que trabajamos <em className="text-[#0e4d7a]">en consulta</em>.
              </h2>
            </Aparece>
          </div>
          <Aparece as="p" retraso={160} className="max-w-[32ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
            Niños y adultos. En la primera valoración definimos juntos qué necesita cada caso.
          </Aparece>
        </div>

        <ul className="mt-14 border-t border-[#02223b]/15 lg:mt-20">
          {SERVICES.map((s, i) => (
            <Aparece as="li" key={s.slug} retraso={i * 60} className="border-b border-[#02223b]/15">
              <Link
                href={`/servicios/${s.slug}/`}
                className="group relative grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 overflow-hidden py-7 lg:grid-cols-[5rem_1fr_1fr_auto] lg:py-10"
              >
                {/* fondo navy que sube al pasar el ratón */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-[#02223b] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-y-100"
                />
                <span className="relative hidden text-sm text-[#0e4d7a] transition-colors duration-500 group-hover:text-[#a8cf45] lg:block lg:pl-6">
                  0{i + 1}
                </span>
                <span className={`${serif} relative text-[2rem] leading-none tracking-[-0.01em] transition-[color,translate] duration-500 group-hover:translate-x-3 group-hover:text-white lg:text-[3.6rem]`}>
                  {s.titulo}
                </span>
                <span className="relative col-span-2 row-start-2 text-[15px] text-[#4d6880] transition-colors duration-500 group-hover:text-[#b9c9d6] lg:col-span-1 lg:row-start-auto lg:text-lg">
                  {s.resumen}
                </span>
                <span
                  aria-hidden="true"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#02223b]/20 transition-all duration-500 group-hover:border-[#a8cf45] group-hover:bg-[#a8cf45] lg:mr-6 lg:h-14 lg:w-14"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0">
                    <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="#02223b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </Aparece>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Yeimmy                                                              */
/* ------------------------------------------------------------------ */
export function Yeimmy() {
  const anios = new Date().getFullYear() - 2004; // graduada en 2004
  const datos = [
    [`${anios} años`, "como optómetra"],
    ["Especialista", "en ortóptica y terapia visual (2021)"],
    ["Universidad", "de La Salle, Bogotá"],
  ];
  return (
    <section aria-labelledby="yeimmy-titulo" className="bg-white px-5 py-24 text-[#02223b] lg:px-14 lg:py-40">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-12 lg:gap-6">
        <Aparece className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#e9efe6]">
            <picture>
              <source media="(max-width: 640px)" srcSet="/images/dra-yeimmy-barragan-sm.webp" />
              <img
                src="/images/dra-yeimmy-barragan.webp"
                alt="Yeimmy Paola Barragan, optómetra especialista en ortóptica y terapia visual, en su consultorio"
                width={900}
                height={900}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-[42%_50%]"
              />
            </picture>
          </div>
        </Aparece>
        <div className="lg:col-span-6 lg:col-start-7">
          <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
            Quién te atiende
          </Aparece>
          <Aparece retraso={80}>
            <h2 id="yeimmy-titulo" className={`${serif} mt-5 text-[clamp(2.6rem,1rem+4vw,5rem)] leading-[0.95] tracking-[-0.02em]`}>
              Te explico cada paso, <em className="text-[#0e4d7a]">sin prisa</em>.
            </h2>
          </Aparece>
          <Aparece as="p" retraso={160} className="mt-8 max-w-[46ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
            Soy {SITE_CONFIG.profesional}, optómetra especializada en ortóptica y terapia visual. Me dedico a
            entender cómo trabaja cada mirada y a acompañar a las familias, sobre todo a los más pequeños, con
            paciencia y explicaciones claras.
          </Aparece>
          <dl className="mt-12 grid grid-cols-1 border-t border-[#02223b]/15 sm:grid-cols-3">
            {datos.map(([a, b], i) => (
              <Aparece key={a} retraso={200 + i * 80} className="border-b border-[#02223b]/15 py-5 sm:border-b-0 sm:pr-4">
                <dt className={`${serif} text-3xl lg:text-4xl`}>{a}</dt>
                <dd className="mt-1 text-sm text-[#4d6880]">{b}</dd>
              </Aparece>
            ))}
          </dl>
          <Aparece retraso={420} className="mt-10">
            <Link href="/sobre-mi/" className="inline-flex items-center gap-2 border-b border-[#02223b] pb-1 text-sm font-medium">
              Conocer mi trayectoria →
            </Link>
          </Aparece>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Consultorio + proceso                                               */
/* ------------------------------------------------------------------ */
// BORRADOR: validar con la doctora.
const PROCESO = [
  ["Valoración", "Conversamos sobre lo que has notado y revisamos cómo trabajan los ojos, juntos y por separado."],
  ["Plan explicado", "Te explico qué encontramos con palabras claras. Si hace falta, coordino con oftalmología."],
  ["Terapia y casa", "Sesiones en consulta y ejercicios cortos para casa. La constancia es parte del avance."],
  ["Controles", "Revisamos el avance y ajustamos el plan hasta cerrar el proceso."],
];

/** Foto del consultorio con <picture> (versión -sm en móvil) y pie opcional. */
function Foto({ foto, className = "", pie }: { foto: Photo; className?: string; pie?: string }) {
  return (
    <figure className={`relative overflow-hidden rounded-[2rem] bg-[#e7e1d5] ${className}`}>
      <picture>
        <source media="(max-width: 640px)" srcSet={foto.srcSm} />
        <img src={foto.src} alt={foto.alt} width={foto.width} height={foto.height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {pie && (
        <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs text-[#02223b] backdrop-blur">{pie}</figcaption>
      )}
    </figure>
  );
}

export function Consultorio() {
  return (
    <section aria-labelledby="consultorio-titulo" className="bg-[#f6f2ea] px-5 py-24 text-[#02223b] lg:px-14 lg:py-40">
      <div className="mx-auto max-w-[90rem]">
        <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
          El consultorio
        </Aparece>
        <Aparece retraso={80}>
          <h2 id="consultorio-titulo" className={`${serif} mt-5 max-w-[16ch] text-[clamp(2.6rem,1rem+4vw,5rem)] leading-[0.95] tracking-[-0.02em]`}>
            Un espacio para <em className="text-[#0e4d7a]">entrenar la mirada</em>.
          </h2>
        </Aparece>

        <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          <Aparece className="lg:col-span-8">
            <Foto foto={PHOTOS.salaTerapia} className="aspect-[16/10]" pie="La terapia visual no se hace sentado frente a una pantalla" />
          </Aparece>
          <Aparece retraso={120} className="lg:col-span-4">
            <Foto foto={PHOTOS.sinoptoforo} className="aspect-[4/3] lg:aspect-auto lg:h-full" pie="Sinoptóforo" />
          </Aparece>
        </div>
        {/* En móvil, carrusel horizontal con snap; en escritorio, tres columnas. */}
        <div className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {[
            [PHOTOS.sesionVasos, "Percepción y motricidad"],
            [PHOTOS.doctoraConsulta, "También con adultos"],
            [PHOTOS.sesionSecuencias, "Atención y secuencias"],
          ].map(([foto, pie], i) => (
            <Aparece key={(foto as Photo).src} retraso={i * 90} className="w-[78%] flex-none snap-start lg:w-auto">
              <Foto foto={foto as Photo} className="aspect-[4/5]" pie={pie as string} />
            </Aparece>
          ))}
        </div>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-6">
          {PROCESO.map(([t, d], i) => (
            <Aparece as="li" key={t} retraso={i * 90} className="border-t border-[#02223b] pt-5">
              <span className="text-sm text-[#0e4d7a]">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-medium tracking-[-0.01em] lg:text-2xl">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4d6880]">{d}</p>
            </Aparece>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cierre: CTA, datos y preguntas frecuentes                           */
/* ------------------------------------------------------------------ */
// Las mismas preguntas de la home actual (BORRADOR revisable por la doctora).
const FAQ = [
  ["¿A qué edad puede empezar la terapia visual un niño?", "Cada niño es distinto, por eso el primer paso siempre es una valoración. A partir de ahí vemos si la terapia visual es adecuada y cómo adaptarla a su edad y a su ritmo."],
  ["¿En qué consiste la primera cita?", "Es una valoración tranquila: conversamos sobre lo que te preocupa, exploramos cómo trabajan los ojos y, si hace falta, planteamos los siguientes pasos. La idea es que salgas con las cosas claras, sin tecnicismos."],
  ["¿Dónde atiendes y cómo agendo?", `Atiendo en ${SITE_CONFIG.direccion.completa}. La forma más cómoda de reservar es por WhatsApp: ahí coordinamos un horario que te venga bien.`],
  ["¿Atiendes a pacientes de otras ciudades?", "Sí. La atención es presencial en Ibagué y con frecuencia recibo a familias que viajan desde otras ciudades. Escríbeme antes del viaje y coordinamos la cita para aprovechar bien tu visita."],
];

export function Cierre() {
  return (
    <section aria-labelledby="cierre-titulo" className="bg-[#02223b] px-5 pb-10 pt-24 text-white lg:px-14 lg:pt-40">
      <div className="mx-auto max-w-[90rem]">
        <Aparece>
          <h2 id="cierre-titulo" className={`${serif} text-white max-w-[14ch] text-[clamp(3rem,1rem+6vw,7.4rem)] leading-[0.92] tracking-[-0.02em]`}>
            ¿Hablamos de lo que <em className="text-[#a8cf45]">has notado</em>?
          </h2>
        </Aparece>
        <Aparece retraso={120} className="mt-10">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#a8cf45] px-7 py-4 text-base font-semibold text-[#02223b] transition-transform hover:-translate-y-0.5"
          >
            Escribir por WhatsApp
          </a>
        </Aparece>

        <div className="mt-20 grid gap-14 border-t border-white/15 pt-12 lg:mt-28 lg:grid-cols-12 lg:gap-6">
          <dl className="grid gap-8 text-[15px] lg:col-span-4">
            {[
              ["Dónde", `${SITE_CONFIG.direccion.clinica}\n${SITE_CONFIG.direccion.calle}\n${SITE_CONFIG.direccion.ciudad}, ${SITE_CONFIG.direccion.departamento}`],
              ["Cuándo", `${SITE_CONFIG.horarios.dias}\n${SITE_CONFIG.horarios.turnos.join(" · ")}`],
              ["WhatsApp", SITE_CONFIG.telefono],
            ].map(([t, d]) => (
              <div key={t}>
                <dt className={`${eyebrow} text-[#a8cf45]`}>{t}</dt>
                <dd className="mt-2 whitespace-pre-line leading-relaxed text-[#b9c9d6]">{d}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className={`${eyebrow} text-[#a8cf45]`}>Preguntas frecuentes</p>
            <div className="mt-4 border-t border-white/15">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group border-b border-white/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium tracking-[-0.01em] lg:text-2xl [&::-webkit-details-marker]:hidden">
                    {q}
                    <span aria-hidden="true" className="relative h-4 w-4 flex-none">
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="max-w-[60ch] pb-7 text-[15px] leading-relaxed text-[#b9c9d6] lg:text-lg">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-8 text-xs text-white/50">
          <span className={`${serif} text-[clamp(3rem,1rem+9vw,10rem)] leading-none tracking-[-0.03em] text-white/90`}>Ortoptika</span>
          <span className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Instagram
            </a>
            <Link href="/privacidad/" className="hover:text-white">
              Tratamiento de datos
            </Link>
            <span>© {new Date().getFullYear()} {SITE_CONFIG.name}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
