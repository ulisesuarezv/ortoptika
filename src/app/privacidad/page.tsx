import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import ConsentPreferences from "@/components/layout/ConsentPreferences";
import Backdrop from "@/components/ui/Backdrop";
import Reveal from "@/components/ui/Reveal";

/**
 * /privacidad — Política de Tratamiento de Datos Personales.
 *
 * Exigida por la Ley 1581 de 2012 y el Decreto 1377 de 2013 desde el momento
 * en que el sitio activa analítica: la SIC considera las cookies de medición
 * tratamiento de datos personales. Indexable (es información pública que debe
 * ser accesible), pero fuera del sitemap: no compite por posicionamiento.
 */
export const metadata: Metadata = buildMetadata({
  title: "Política de tratamiento de datos y cookies",
  description:
    "Cómo se tratan los datos personales en ortoptikaterapia.com: qué cookies se usan, con qué finalidad y cómo ejercer tus derechos como titular (Ley 1581 de 2012).",
  path: "/privacidad/",
});

/** Última revisión del texto. Actualizar al cambiar el contenido de la política. */
const ULTIMA_ACTUALIZACION = "8 de septiembre de 2026";

const COOKIES = [
  {
    nombre: "_ga",
    origen: "Google Analytics 4",
    finalidad:
      "Distingue un navegador de otro para contar visitantes únicos. No identifica a la persona por su nombre.",
    duracion: "Hasta 2 años",
  },
  {
    nombre: "_ga_<ID>",
    origen: "Google Analytics 4",
    finalidad:
      "Mantiene el estado de la sesión para saber si una visita es nueva o continúa una anterior.",
    duracion: "Hasta 2 años",
  },
  {
    nombre: "ortoptika.consent.v1",
    origen: "Este sitio (almacenamiento local, no es una cookie)",
    finalidad:
      "Recuerda si aceptaste o rechazaste las cookies de analítica, para no volver a preguntártelo. No se envía a ningún servidor.",
    duracion: "Hasta que borres los datos del sitio en tu navegador",
  },
] as const;

export default function PrivacidadPage() {
  return (
    <section
      aria-labelledby="privacidad-title"
      className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-soft"
    >
      <div className="absolute inset-0 z-0">
        <Backdrop variant="iris" flip />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="flex flex-col items-start gap-5">
          <span className="eyebrow">Información legal</span>
          <h1 id="privacidad-title">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">
              Política de tratamiento
            </span>
            <span className="accent-word block text-3xl sm:text-4xl lg:text-5xl">
              de datos y cookies
            </span>
          </h1>
          <p className="max-w-[60ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700">
            Este documento explica qué datos personales se tratan a través de{" "}
            {SITE_CONFIG.url.replace("https://", "")}, con qué finalidad y cómo
            puedes ejercer tus derechos. Se adopta conforme a la Ley 1581 de
            2012 y al Decreto 1377 de 2013 de Colombia.
          </p>
          <p className="text-sm text-slate-ink-500">
            Última actualización: {ULTIMA_ACTUALIZACION}
          </p>
        </Reveal>

        <div className="mt-14 space-y-12 text-slate-ink-700">
          <section aria-labelledby="que-datos">
            <h2 id="que-datos" className="text-2xl sm:text-3xl">
              1. Qué datos se tratan
            </h2>
            <p className="mt-4 leading-relaxed">
              Este sitio <strong>no tiene formularios</strong> y no guarda
              información en un servidor propio. Solo se tratan dos tipos de
              datos:
            </p>
            <h3 className="mt-6 text-xl">a) Datos de navegación (cookies)</h3>
            <p className="mt-2 leading-relaxed">
              Si aceptas las cookies de analítica, Google Analytics registra un
              identificador aleatorio de tu navegador, tu dirección IP —que
              Google trunca antes de almacenarla—, el tipo de dispositivo y
              navegador, las páginas que visitas y desde dónde llegaste. Esta
              información es <strong>estadística y agregada</strong>: no permite
              saber quién eres ni contactarte.
            </p>
            <p className="mt-2 leading-relaxed">
              Si rechazas, no se activa ninguna medición.
            </p>
            <h3 className="mt-6 text-xl">
              b) Datos que envías tú al escribir o llamar
            </h3>
            <p className="mt-2 leading-relaxed">
              Los botones del sitio abren WhatsApp, tu app de teléfono o tu
              correo. Cuando escribes por esos canales compartes lo que decidas
              contar: normalmente tu nombre, tu número y el motivo de tu
              consulta. Esa conversación ocurre <strong>fuera de este sitio</strong>,
              en plataformas de terceros (WhatsApp pertenece a Meta; el correo
              se recibe en Gmail, de Google), que se rigen por sus propias
              políticas de privacidad.
            </p>
            <p className="mt-2 leading-relaxed">
              Por eso una recomendación práctica: por WhatsApp basta con
              indicar el motivo general de la consulta. Los detalles clínicos se
              tratan en consulta, donde quedan amparados por la reserva de la
              historia clínica.
            </p>
          </section>

          <section aria-labelledby="finalidades">
            <h2 id="finalidades" className="text-2xl sm:text-3xl">
              2. Para qué se usan
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
              <li>
                Entender qué contenidos resultan útiles y mejorar la
                información del sitio (datos de navegación, solo con tu
                autorización).
              </li>
              <li>
                Responder tus preguntas y agendar, reprogramar o confirmar citas
                (datos que envías por WhatsApp, teléfono o correo).
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Los datos no se venden, no se comparten con fines publicitarios ni
              se usan para enviarte comunicaciones comerciales que no hayas
              pedido.
            </p>
          </section>

          <section aria-labelledby="cookies">
            <h2 id="cookies" className="text-2xl sm:text-3xl">
              3. Cookies que utiliza el sitio
            </h2>
            <p className="mt-4 leading-relaxed">
              El sitio no usa cookies publicitarias ni de perfilado. Estas son
              todas las que puede escribir:
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-ink-300">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-ink-900">
                      Nombre
                    </th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-ink-900">
                      Origen
                    </th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-ink-900">
                      Finalidad
                    </th>
                    <th scope="col" className="py-3 font-semibold text-slate-ink-900">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((cookie) => (
                    <tr key={cookie.nombre} className="border-b border-slate-ink-200 align-top">
                      <th
                        scope="row"
                        className="py-3 pr-4 font-mono text-xs font-normal text-slate-ink-900"
                      >
                        {cookie.nombre}
                      </th>
                      <td className="py-3 pr-4 leading-relaxed">{cookie.origen}</td>
                      <td className="py-3 pr-4 leading-relaxed">{cookie.finalidad}</td>
                      <td className="py-3 leading-relaxed">{cookie.duracion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 leading-relaxed">
              Hasta que aceptes, la medición permanece desactivada mediante el{" "}
              <em>modo de consentimiento</em> de Google: el sitio le indica
              expresamente que no almacene datos de analítica. Puedes cambiar tu
              decisión cuando quieras:
            </p>
            <div className="mt-6">
              <ConsentPreferences />
            </div>
          </section>

          <section aria-labelledby="terceros">
            <h2 id="terceros" className="text-2xl sm:text-3xl">
              4. Terceros y transferencia internacional
            </h2>
            <p className="mt-4 leading-relaxed">
              La analítica la presta Google LLC, con servidores en Estados
              Unidos y otros países. Al aceptar las cookies autorizas esa
              transferencia internacional de tus datos de navegación, en los
              términos del artículo 26 de la Ley 1581 de 2012. El sitio se
              publica en la infraestructura de Vercel Inc., que procesa los
              registros técnicos necesarios para servir las páginas.
            </p>
          </section>

          <section aria-labelledby="menores">
            <h2 id="menores" className="text-2xl sm:text-3xl">
              5. Datos de niñas, niños y adolescentes
            </h2>
            <p className="mt-4 leading-relaxed">
              Buena parte de la consulta es pediátrica, así que conviene decirlo
              con claridad: este sitio no está dirigido a menores de edad ni
              recoge datos suyos. Cuando un padre, madre o representante legal
              escribe para agendar la cita de un menor, actúa en su
              representación y el tratamiento se limita a lo estrictamente
              necesario para la atención, atendiendo al interés superior del
              menor conforme al artículo 7 de la Ley 1581 de 2012 y al artículo
              12 del Decreto 1377 de 2013.
            </p>
          </section>

          <section aria-labelledby="salud">
            <h2 id="salud" className="text-2xl sm:text-3xl">
              6. Datos de salud
            </h2>
            <p className="mt-4 leading-relaxed">
              Los datos de salud son sensibles y tienen protección reforzada.
              Este sitio <strong>no los recoge ni los almacena</strong>. La
              información clínica que surge de la consulta se registra en la
              historia clínica, sometida a reserva legal y conservada según la
              normativa sanitaria vigente, no a través de este sitio web.
            </p>
          </section>

          <section aria-labelledby="derechos">
            <h2 id="derechos" className="text-2xl sm:text-3xl">
              7. Tus derechos como titular
            </h2>
            <p className="mt-4 leading-relaxed">
              De acuerdo con el artículo 8 de la Ley 1581 de 2012, puedes:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
              <li>Conocer, actualizar y rectificar tus datos personales.</li>
              <li>
                Solicitar prueba de la autorización que otorgaste, salvo en los
                casos en que la ley no la exige.
              </li>
              <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
              <li>
                Presentar quejas ante la Superintendencia de Industria y
                Comercio por infracciones a la ley.
              </li>
              <li>
                Revocar la autorización y solicitar la supresión de tus datos,
                cuando no exista un deber legal o contractual de conservarlos.
              </li>
              <li>Acceder gratuitamente a los datos que se hayan tratado.</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Para ejercerlos, escribe a{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-primary-700 underline underline-offset-2 hover:text-primary-800"
              >
                {SITE_CONFIG.email}
              </a>{" "}
              indicando tu nombre, tu solicitud y un canal de respuesta. Las
              consultas se atienden en un máximo de diez (10) días hábiles,
              prorrogables por cinco (5) más; los reclamos, en quince (15) días
              hábiles, prorrogables por ocho (8) más, informándote siempre el
              motivo de la prórroga.
            </p>
          </section>

          <section aria-labelledby="vigencia">
            <h2 id="vigencia" className="text-2xl sm:text-3xl">
              8. Vigencia y cambios
            </h2>
            <p className="mt-4 leading-relaxed">
              Esta política rige desde el {ULTIMA_ACTUALIZACION}. Los datos se
              conservan mientras se mantengan las finalidades descritas o
              mientras exista un deber legal de conservarlos; las cookies, según
              la duración indicada en la tabla. Cualquier cambio sustancial se
              publicará en esta misma página, actualizando la fecha del
              encabezado.
            </p>
            <p className="mt-4 leading-relaxed">
              Si algo de este documento no te queda claro, puedes preguntarlo
              directamente desde la{" "}
              <Link
                href="/contacto/"
                className="text-primary-700 underline underline-offset-2 hover:text-primary-800"
              >
                página de contacto
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
