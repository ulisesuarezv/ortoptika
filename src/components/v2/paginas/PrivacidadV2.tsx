/**
 * /privacidad de la v2 — Política de Tratamiento de Datos Personales
 * (Ley 1581 de 2012, Decreto 1377 de 2013). Server Component.
 *
 * El TEXTO es el de la v1 (src/app/privacidad/page.tsx), palabra por palabra:
 * es un documento legal. Mientras convivan las dos versiones, cualquier cambio
 * de contenido va en los dos archivos (y se actualiza ULTIMA_ACTUALIZACION).
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import Aparece from "../Aparece";
import Cabecera from "../Cabecera";
import PreferenciasCookies from "../PreferenciasCookies";
import { Pie } from "../Secciones";
import { rutaV2 } from "../rutas";
import Indice from "../servicio/Indice";
import { eyebrow, sans, serif } from "../estilos";

const ULTIMA_ACTUALIZACION = "12 de septiembre de 2026";

const COOKIES = [
  ["_ga", "Google Analytics 4", "Distingue un navegador de otro para contar visitantes únicos. No identifica a la persona por su nombre.", "Hasta 2 años"],
  ["_ga_<ID>", "Google Analytics 4", "Mantiene el estado de la sesión para saber si una visita es nueva o continúa una anterior.", "Hasta 2 años"],
  ["ortoptika.consent.v1", "Este sitio (almacenamiento local, no es una cookie)", "Recuerda si aceptaste o rechazaste las cookies de analítica, para no volver a preguntártelo. No se envía a ningún servidor.", "Hasta que borres los datos del sitio en tu navegador"],
] as const;

const SECCIONES = [
  { id: "que-datos", t: "Qué datos se tratan" },
  { id: "finalidades", t: "Para qué se usan" },
  { id: "cookies", t: "Cookies que utiliza el sitio" },
  { id: "terceros", t: "Terceros y transferencia internacional" },
  { id: "menores", t: "Datos de niñas, niños y adolescentes" },
  { id: "salud", t: "Datos de salud" },
  { id: "imagenes", t: "Fotografías tomadas en el consultorio" },
  { id: "derechos", t: "Tus derechos como titular" },
  { id: "vigencia", t: "Vigencia y cambios" },
];

const p = "mt-4 max-w-[64ch] text-[15px] leading-relaxed text-[#33506a] lg:text-[17px]";
const h3 = "mt-8 text-lg font-medium tracking-[-0.01em] text-[#02223b] lg:text-xl";
const lista = "mt-4 max-w-[64ch] space-y-3 text-[15px] leading-relaxed text-[#33506a] lg:text-[17px]";
const a = "text-[#0e4d7a] underline decoration-[#0e4d7a]/30 underline-offset-4 hover:decoration-[#0e4d7a]";

function Seccion({ id, n, children }: { id: string; n: number; children: ReactNode }) {
  const t = SECCIONES.find((s) => s.id === id)!.t;
  return (
    <section aria-labelledby={id} className="scroll-mt-10 border-t border-[#02223b]/12 py-14 first:border-t-0 first:pt-0 lg:py-20">
      <h2 id={id} className={`${serif} flex items-baseline gap-5 text-[clamp(2rem,1rem+2vw,3.2rem)] leading-[1] tracking-[-0.02em] text-[#02223b]`}>
        <span className="text-[0.6em] text-[#0e4d7a]">{String(n).padStart(2, "0")}</span>
        {t}
      </h2>
      {children}
    </section>
  );
}

/** Viñeta de la lista en lima, como las señales de las landings. */
const Item = ({ children }: { children: ReactNode }) => (
  <li className="flex gap-4">
    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-[#a8cf45]" />
    <span>{children}</span>
  </li>
);

export default function PrivacidadV2() {
  const correo = (
    <a href={`mailto:${SITE_CONFIG.email}`} className={a}>
      {SITE_CONFIG.email}
    </a>
  );
  return (
    <article className={`${sans} text-[#02223b]`}>
      <header className="relative overflow-hidden bg-[#f6f2ea]">
        <Cabecera />
        <div className="relative mx-auto max-w-[90rem] px-5 pb-20 pt-10 lg:px-14 lg:pb-28 lg:pt-20">
          <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
            Información legal
          </Aparece>
          <Aparece retraso={80}>
            <h1 className={`${serif} mt-6 max-w-[16ch] text-[clamp(2.8rem,1rem+5vw,6rem)] leading-[0.94] tracking-[-0.02em] text-[#02223b]`}>
              Política de tratamiento <em className="text-[#0e4d7a]">de datos y cookies</em>
            </h1>
          </Aparece>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-6">
            <Aparece as="p" retraso={160} className="max-w-[56ch] text-[15px] leading-relaxed text-[#33506a] lg:col-span-7 lg:text-lg">
              Este documento explica qué datos personales se tratan a través de {SITE_CONFIG.url.replace("https://", "")}, con
              qué finalidad y cómo puedes ejercer tus derechos. Se adopta conforme a la Ley 1581 de 2012 y al Decreto
              1377 de 2013 de Colombia.
            </Aparece>
            <Aparece retraso={220} className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="border-l-2 border-[#a8cf45] pl-5 text-sm leading-relaxed text-[#4d6880]">
                Última actualización
                <span className="block text-base font-medium text-[#02223b]">{ULTIMA_ACTUALIZACION}</span>
              </p>
            </Aparece>
          </div>
        </div>
      </header>

      <div className="bg-white px-5 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-12 lg:gap-6">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-12 pt-24">
              <Indice secciones={SECCIONES} />
            </div>
          </aside>

          <div className="pb-24 pt-16 lg:col-span-8 lg:col-start-5 lg:pb-36 lg:pt-24">
            <Seccion id="que-datos" n={1}>
              <p className={p}>
                Este sitio <strong className="font-semibold text-[#02223b]">no tiene formularios</strong> y no guarda información en un servidor propio. Solo se
                tratan dos tipos de datos:
              </p>
              <h3 className={h3}>a) Datos de navegación (cookies)</h3>
              <p className={p}>
                Si aceptas las cookies de analítica, Google Analytics registra un identificador aleatorio de tu
                navegador, tu dirección IP —que Google trunca antes de almacenarla—, el tipo de dispositivo y navegador,
                las páginas que visitas y desde dónde llegaste. Esta información es{" "}
                <strong className="font-semibold text-[#02223b]">estadística y agregada</strong>: no permite saber quién eres ni contactarte.
              </p>
              <p className={p}>Si rechazas, no se activa ninguna medición.</p>
              <h3 className={h3}>b) Datos que envías tú al escribir o llamar</h3>
              <p className={p}>
                Los botones del sitio abren WhatsApp, tu app de teléfono o tu correo. Cuando escribes por esos canales
                compartes lo que decidas contar: normalmente tu nombre, tu número y el motivo de tu consulta. Esa
                conversación ocurre <strong className="font-semibold text-[#02223b]">fuera de este sitio</strong>, en plataformas de terceros (WhatsApp
                pertenece a Meta; el correo se recibe en Gmail, de Google), que se rigen por sus propias políticas de
                privacidad.
              </p>
              <p className="mt-6 max-w-[64ch] rounded-2xl bg-[#f6f2ea] p-6 text-[15px] leading-relaxed text-[#33506a] lg:text-[17px]">
                Por eso una recomendación práctica: por WhatsApp basta con indicar el motivo general de la consulta. Los
                detalles clínicos se tratan en consulta, donde quedan amparados por la reserva de la historia clínica.
              </p>
            </Seccion>

            <Seccion id="finalidades" n={2}>
              <ul className={lista}>
                <Item>
                  Entender qué contenidos resultan útiles y mejorar la información del sitio (datos de navegación, solo
                  con tu autorización).
                </Item>
                <Item>
                  Responder tus preguntas y agendar, reprogramar o confirmar citas (datos que envías por WhatsApp,
                  teléfono o correo).
                </Item>
              </ul>
              <p className={p}>
                Los datos no se venden, no se comparten con fines publicitarios ni se usan para enviarte comunicaciones
                comerciales que no hayas pedido.
              </p>
            </Seccion>

            <Seccion id="cookies" n={3}>
              <p className={p}>El sitio no usa cookies publicitarias ni de perfilado. Estas son todas las que puede escribir:</p>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#02223b]">
                      {["Nombre", "Origen", "Finalidad", "Duración"].map((t) => (
                        <th key={t} scope="col" className={`${eyebrow} pb-3 pr-5 font-semibold text-[#0e4d7a]`}>
                          {t}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIES.map(([nombre, origen, finalidad, duracion]) => (
                      <tr key={nombre} className="border-b border-[#02223b]/15 align-top">
                        <th scope="row" className="py-4 pr-5 font-mono text-xs font-normal text-[#02223b]">
                          {nombre}
                        </th>
                        <td className="py-4 pr-5 leading-relaxed text-[#33506a]">{origen}</td>
                        <td className="py-4 pr-5 leading-relaxed text-[#33506a]">{finalidad}</td>
                        <td className="py-4 leading-relaxed text-[#33506a]">{duracion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={`${p} mt-8`}>
                Hasta que aceptes, la medición permanece desactivada mediante el <em>modo de consentimiento</em> de
                Google: el sitio le indica expresamente que no almacene datos de analítica. Puedes cambiar tu decisión
                cuando quieras:
              </p>
              <div className="mt-8">
                <PreferenciasCookies />
              </div>
            </Seccion>

            <Seccion id="terceros" n={4}>
              <p className={p}>
                La analítica la presta Google LLC, con servidores en Estados Unidos y otros países. Al aceptar las
                cookies autorizas esa transferencia internacional de tus datos de navegación, en los términos del
                artículo 26 de la Ley 1581 de 2012. El sitio se publica en la infraestructura de Vercel Inc., que procesa
                los registros técnicos necesarios para servir las páginas.
              </p>
            </Seccion>

            <Seccion id="menores" n={5}>
              <p className={p}>
                Buena parte de la consulta es pediátrica, así que conviene decirlo con claridad: este sitio no está
                dirigido a menores de edad ni recoge datos suyos. Cuando un padre, madre o representante legal escribe
                para agendar la cita de un menor, actúa en su representación y el tratamiento se limita a lo
                estrictamente necesario para la atención, atendiendo al interés superior del menor conforme al artículo
                7 de la Ley 1581 de 2012 y al artículo 12 del Decreto 1377 de 2013.
              </p>
            </Seccion>

            <Seccion id="salud" n={6}>
              <p className={p}>
                Los datos de salud son sensibles y tienen protección reforzada. Este sitio{" "}
                <strong className="font-semibold text-[#02223b]">no los recoge ni los almacena</strong>. La información clínica que surge de la consulta se
                registra en la historia clínica, sometida a reserva legal y conservada según la normativa sanitaria
                vigente, no a través de este sitio web.
              </p>
            </Seccion>

            <Seccion id="imagenes" n={7}>
              <p className={p}>
                Algunas de las fotografías de este sitio se tomaron en el consultorio y en ellas aparecen personas
                identificables. La imagen de una persona es un dato personal: por eso, toda fotografía en la que alguien
                sea reconocible requiere su <strong className="font-semibold text-[#02223b]">autorización previa, expresa y escrita</strong> y, cuando se
                trata de un menor de edad, la de su padre, madre o representante legal, atendiendo al interés superior
                del menor.
              </p>
              <p className={p}>
                Esas imágenes se usan únicamente para informar sobre los servicios del consultorio, en este sitio web, en
                la ficha de Google Business y en los perfiles de Instagram y Facebook. Nunca se publica el nombre, el
                diagnóstico, la historia clínica ni ningún resultado de exámenes de quien aparece, y las imágenes no se
                ceden a terceros con fines publicitarios o comerciales distintos de los anteriores. La autorización se
                otorga de forma gratuita.
              </p>
              <p className={p}>
                Si apareces en una fotografía publicada y quieres que se retire, basta con pedirlo por WhatsApp al{" "}
                {SITE_CONFIG.telefono} o escribiendo a {correo}. No hace falta dar explicaciones y la imagen se retira
                dentro de los quince (15) días hábiles siguientes. La revocatoria opera hacia el futuro y no afecta los
                usos anteriores.
              </p>
            </Seccion>

            <Seccion id="derechos" n={8}>
              <p className={p}>De acuerdo con el artículo 8 de la Ley 1581 de 2012, puedes:</p>
              <ul className={lista}>
                <Item>Conocer, actualizar y rectificar tus datos personales.</Item>
                <Item>Solicitar prueba de la autorización que otorgaste, salvo en los casos en que la ley no la exige.</Item>
                <Item>Ser informado sobre el uso que se ha dado a tus datos.</Item>
                <Item>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</Item>
                <Item>
                  Revocar la autorización y solicitar la supresión de tus datos, cuando no exista un deber legal o
                  contractual de conservarlos.
                </Item>
                <Item>Acceder gratuitamente a los datos que se hayan tratado.</Item>
              </ul>
              <p className={p}>
                Para ejercerlos, escribe a {correo} indicando tu nombre, tu solicitud y un canal de respuesta. Las
                consultas se atienden en un máximo de diez (10) días hábiles, prorrogables por cinco (5) más; los
                reclamos, en quince (15) días hábiles, prorrogables por ocho (8) más, informándote siempre el motivo de la
                prórroga.
              </p>
            </Seccion>

            <Seccion id="vigencia" n={9}>
              <p className={p}>
                Esta política rige desde el {ULTIMA_ACTUALIZACION}. Los datos se conservan mientras se mantengan las
                finalidades descritas o mientras exista un deber legal de conservarlos; las cookies, según la duración
                indicada en la tabla. Cualquier cambio sustancial se publicará en esta misma página, actualizando la
                fecha del encabezado.
              </p>
              <p className={p}>
                Si algo de este documento no te queda claro, puedes preguntarlo directamente desde la{" "}
                <Link href={rutaV2("/contacto/")} className={a}>
                  página de contacto
                </Link>
                .
              </p>
            </Seccion>
          </div>
        </div>
      </div>

      <div className="bg-[#02223b] px-5 pb-10 pt-px text-white lg:px-14">
        <div className="mx-auto max-w-[90rem]">
          <Pie />
        </div>
      </div>
    </article>
  );
}
