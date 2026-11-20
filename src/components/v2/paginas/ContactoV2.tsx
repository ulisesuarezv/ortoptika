/**
 * /contacto de la v2 — Server Component. Canal único: WhatsApp (sin formulario).
 * Mismo contenido que la v1 (src/app/contacto/page.tsx). El globo del hero
 * muestra el mensaje que el enlace ya lleva escrito (WHATSAPP_DEFAULT_MESSAGE),
 * así que no promete nada que no pase. Metadata y JSON-LD viven en la ruta.
 */
import { SITE_CONFIG, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from "@/lib/constants";
import Aparece from "../Aparece";
import Cabecera from "../Cabecera";
import { Pie } from "../Secciones";
import { eyebrow, h1, h2, sans, serif } from "../estilos";

const PASOS = [
  ["Me cuentas tu caso", "Qué has observado, desde cuándo y a quién buscas ayudar. Sin tecnicismos: con tus palabras."],
  ["Coordinamos la cita", "Buscamos juntos el horario que mejor le sirva a tu familia y te confirmo todo por el mismo chat."],
  ["Llegas sin papeleo", "Solo trae los exámenes o fórmulas anteriores si los tienes. Lo demás lo hacemos en consulta."],
];

const enlace = "underline decoration-[#02223b]/25 underline-offset-4 transition-colors hover:decoration-[#02223b]";

export default function ContactoV2() {
  const { direccion, horarios } = SITE_CONFIG;
  return (
    <article className={`${sans} text-[#02223b]`}>
      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden bg-[#f6f2ea]">
        <Cabecera actual="contacto" />
        <div className="relative mx-auto grid max-w-[90rem] gap-14 px-5 pb-20 pt-8 lg:min-h-[calc(88svh-6.5rem)] lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-14 lg:pb-24">
          <div className="lg:col-span-7">
            <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
              Contacto
            </Aparece>
            <Aparece retraso={80}>
              <h1 className={`${h1} mt-6`}>
                <span className="block">Hablemos</span>
                <em className="block text-[#0e4d7a]">por WhatsApp</em>
              </h1>
            </Aparece>
            <Aparece as="p" retraso={160} className="mt-8 max-w-[40ch] text-[15px] leading-relaxed text-[#33506a] lg:text-xl lg:leading-relaxed">
              Sin formularios ni esperas: escríbeme directamente, me cuentas qué te preocupa y coordinamos la cita.
            </Aparece>
            <Aparece retraso={240} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-[#02223b] px-7 py-4 text-base font-medium text-white transition-transform hover:-translate-y-0.5">
                Escribir por WhatsApp
              </a>
              <a href={SITE_CONFIG.telefonoHref} className={`text-[15px] font-medium ${enlace}`}>
                o llamar al {SITE_CONFIG.telefono}
              </a>
            </Aparece>
          </div>

          {/* El primer mensaje, tal como sale al tocar el botón */}
          <Aparece retraso={200} className="lg:col-span-4 lg:col-start-9">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir WhatsApp con el mensaje ya escrito"
              className="group block rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(2,34,59,.45)] transition-transform duration-500 hover:-translate-y-1 lg:p-8"
            >
              <span className="flex items-center gap-3 border-b border-[#02223b]/10 pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f2ea]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/brand/logo-mark-eye-brain-sm.webp" alt="" width={48} height={26} className="h-[18px] w-auto" />
                </span>
                <span>
                  <span className="block text-[15px] font-medium">{SITE_CONFIG.name}</span>
                  <span className="block text-xs text-[#4d6880]">{SITE_CONFIG.telefono}</span>
                </span>
              </span>
              <span className="mt-6 ml-auto block w-fit max-w-[90%] rounded-2xl rounded-tr-md bg-[#a8cf45] px-4 py-3 text-[15px] leading-snug text-[#02223b]">
                {WHATSAPP_DEFAULT_MESSAGE}
              </span>
              <span className="mt-6 flex items-center justify-between text-xs text-[#4d6880]">
                El mensaje ya va escrito: solo tienes que enviarlo.
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 flex-none -rotate-45 text-[#02223b] transition-transform duration-500 group-hover:rotate-0">
                  <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </Aparece>
        </div>
      </header>

      {/* ================= DATOS + MAPA ================= */}
      <section aria-labelledby="ubicacion" className="bg-white px-5 py-24 lg:px-14 lg:py-36">
        <div className="mx-auto max-w-[90rem]">
          <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
            El consultorio
          </Aparece>
          <Aparece retraso={80}>
            <h2 id="ubicacion" className={`${h2} mt-5`}>
              Dónde <em className="text-[#0e4d7a]">encontrarme</em>.
            </h2>
          </Aparece>

          <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-6">
            <dl className="grid content-start border-t border-[#02223b] lg:col-span-4">
              <Aparece className="border-b border-[#02223b]/15 py-6">
                <dt className={`${eyebrow} text-[#0e4d7a]`}>Consulta</dt>
                <dd className="mt-3 text-[15px] leading-relaxed lg:text-base">
                  <address className="not-italic">
                    <span className="font-medium">{direccion.clinica}</span>
                    <br />
                    {direccion.calle}
                    <br />
                    {direccion.ciudad}, {direccion.departamento}
                  </address>
                  <a href={SITE_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block text-sm ${enlace}`}>
                    Abrir en Google Maps →
                  </a>
                </dd>
              </Aparece>
              <Aparece retraso={60} className="border-b border-[#02223b]/15 py-6">
                <dt className={`${eyebrow} text-[#0e4d7a]`}>WhatsApp y teléfono</dt>
                <dd className="mt-3 text-[15px] leading-relaxed lg:text-base">
                  <a href={SITE_CONFIG.telefonoHref} className={`${serif} text-3xl tracking-[-0.01em] ${enlace}`}>
                    {SITE_CONFIG.telefono}
                  </a>
                  <span className="mt-2 block text-sm text-[#4d6880]">La forma más rápida de agendar es el botón de WhatsApp.</span>
                </dd>
              </Aparece>
              <Aparece retraso={120} className="border-b border-[#02223b]/15 py-6">
                <dt className={`${eyebrow} text-[#0e4d7a]`}>Horarios</dt>
                <dd className="mt-3 text-[15px] leading-relaxed lg:text-base">
                  <span className="font-medium">{horarios.dias}</span>
                  {horarios.turnos.map((t) => (
                    <span key={t} className="block">
                      {t}
                    </span>
                  ))}
                  <span className="mt-3 block text-sm text-[#4d6880]">
                    Atención solo particular (sin EPS ni prepagada). Cita siempre con reserva previa — la primera
                    valoración dura aproximadamente una hora.
                  </span>
                </dd>
              </Aparece>
              <Aparece retraso={180} className="border-b border-[#02223b]/15 py-6">
                <dt className={`${eyebrow} text-[#0e4d7a]`}>Redes y correo</dt>
                <dd className="mt-3 flex flex-col items-start gap-1.5 text-[15px] lg:text-base">
                  <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className={enlace}>
                    {SITE_CONFIG.social.instagramHandle}
                  </a>
                  <a href={`mailto:${SITE_CONFIG.email}`} className={`text-sm text-[#33506a] ${enlace}`}>
                    {SITE_CONFIG.email}
                  </a>
                </dd>
              </Aparece>
            </dl>

            <Aparece retraso={120} className="lg:col-span-8">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#e7e1d5] sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
                <iframe
                  src={SITE_CONFIG.googleMapsEmbed}
                  title={`Mapa: ${direccion.completa}`}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#4d6880]">
                La consulta está dentro de la {direccion.clinica}, consultorio 212. Si te pierdes al llegar, escríbeme y
                te oriento.
              </p>
            </Aparece>
          </div>
        </div>
      </section>

      {/* ================= QUÉ PASA CUANDO ESCRIBES + PIE ================= */}
      <section aria-labelledby="al-escribir" className="bg-[#02223b] px-5 pb-10 pt-24 text-white lg:px-14 lg:pt-36">
        <div className="mx-auto max-w-[90rem]">
          <Aparece as="p" className={`${eyebrow} text-[#a8cf45]`}>
            Paso a paso
          </Aparece>
          <Aparece retraso={80}>
            <h2 id="al-escribir" className={`${serif} mt-5 max-w-[14ch] text-[clamp(3rem,1rem+5.6vw,7rem)] leading-[0.92] tracking-[-0.02em] text-white`}>
              Qué pasa cuando <em className="text-[#a8cf45]">escribes</em>.
            </h2>
          </Aparece>
          <ol className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-3 lg:gap-6">
            {PASOS.map(([t, d], i) => (
              <Aparece as="li" key={t} retraso={i * 90} className="border-t border-white/25 pt-6">
                <span className={`${serif} block text-6xl leading-none text-[#a8cf45] lg:text-7xl`}>{i + 1}</span>
                <h3 className="mt-6 text-xl font-medium tracking-[-0.01em] text-white lg:text-2xl">{t}</h3>
                <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-[#b9c9d6] lg:text-base">{d}</p>
              </Aparece>
            ))}
          </ol>
          <Aparece className="mt-16">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-[#a8cf45] px-7 py-4 text-base font-semibold text-[#02223b] transition-transform hover:-translate-y-0.5">
              Agendar una cita
            </a>
          </Aparece>
          <Pie />
        </div>
      </section>
    </article>
  );
}
