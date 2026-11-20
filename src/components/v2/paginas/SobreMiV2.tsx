/**
 * /sobre-mi de la v2 — Server Component. Página clave de E-E-A-T (salud, YMYL).
 *
 * Mismo contenido que la v1 (src/app/sobre-mi/page.tsx): todos los datos de
 * formación salen de SITE_CONFIG.credenciales, confirmados por la doctora, y
 * los textos son los suyos. Lo único nuevo es la forma: la formación pasa a una
 * línea de tiempo por años. Metadata y JSON-LD (Person) viven en la ruta.
 */
import { SITE_CONFIG } from "@/lib/constants";
import { PHOTOS } from "@/lib/photos";
import Aparece from "../Aparece";
import Cabecera from "../Cabecera";
import { CierreBreve, Servicios } from "../Secciones";
import { eyebrow, h1, h2, sans, serif } from "../estilos";

const { credenciales } = SITE_CONFIG;

/** "Título — Institución (2004)" → partes para la línea de tiempo. */
function partir(item: string) {
  const m = item.match(/^(.*?)\s+—\s+(.*?)\s*\((\d{4})\)$/);
  if (!m) return null;
  return { titulo: m[1], lugar: m[2], anio: Number(m[3]) };
}

const HITOS = [credenciales.tituloOptometra, credenciales.especializacion, ...credenciales.formacionAdicional]
  .map((item) => {
    const p = partir(item);
    // "Congreso Visión y Deporte SVVT LATAM (2020)" no trae institución.
    if (p) return p;
    const m = item.match(/^(.*?)\s*\((\d{4})\)$/);
    return { titulo: m ? m[1] : item, lugar: "", anio: m ? Number(m[2]) : 0 };
  })
  .sort((a, b) => a.anio - b.anio)
  // Los dos títulos de ortóptica/optometría van resaltados en la línea.
  .map((h) => ({ ...h, clave: h.titulo === "Optómetra" || h.titulo.startsWith("Especialista") }));

const PRINCIPIOS = [
  ["Escuchar antes de explorar", "Empiezo por entender qué te preocupa y qué han observado en casa. Esa historia es tan importante como las pruebas."],
  ["Explicar sin tecnicismos", "Te cuento qué encuentro y qué opciones hay con palabras claras, sin presionar y respondiendo todas tus preguntas."],
  ["Acompañar el proceso", "La terapia visual es un camino de constancia. Adapto los ejercicios a cada persona y ajusto el plan según cómo evoluciona."],
];

export default function SobreMiV2() {
  const anios = new Date().getFullYear() - 2004; // graduada en 2004
  const aniosOrtoptica = new Date().getFullYear() - 2020; // 6 en 2026 (SITE_CONFIG)
  const foto = PHOTOS.instrumentos;

  return (
    <article className={`${sans} text-[#02223b]`}>
      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden bg-[#f6f2ea]">
        <Cabecera actual="sobre-mi" />
        <div className="relative mx-auto grid max-w-[90rem] gap-12 px-5 pb-20 pt-8 lg:min-h-[calc(100svh-6.5rem)] lg:grid-cols-12 lg:items-end lg:gap-6 lg:px-14 lg:pb-24">
          <div className="lg:col-span-7 lg:pb-6">
            <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
              Sobre mí
            </Aparece>
            <Aparece retraso={80}>
              <h1 className={`${h1} mt-6`}>
                <span className="block">Yeimmy Paola</span>
                <em className="block text-[#0e4d7a]">Barragan</em>
              </h1>
            </Aparece>
            <Aparece as="p" retraso={140} className="mt-6 text-[15px] font-medium text-[#0e4d7a] lg:text-lg">
              {SITE_CONFIG.titulo}
            </Aparece>
            <Aparece as="p" retraso={200} className="mt-8 max-w-[44ch] text-[15px] leading-relaxed text-[#33506a] lg:text-xl lg:leading-relaxed">
              Detrás de cada valoración hay una persona que quiere ver mejor —y, muchas veces, una familia que quiere
              lo mejor para su hijo. Mi trabajo es acompañarte en ese camino con calma, escucha y un plan hecho a tu
              medida.
            </Aparece>
          </div>

          <Aparece retraso={120} className="lg:col-span-5">
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#e9efe6]">
                <picture>
                  <source media="(max-width: 640px)" srcSet="/images/dra-yeimmy-barragan-sm.webp" />
                  <img
                    src="/images/dra-yeimmy-barragan.webp"
                    alt="Yeimmy Paola Barragan, optómetra especialista en ortóptica y terapia visual, en su consultorio"
                    width={900}
                    height={900}
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover object-[42%_50%]"
                  />
                </picture>
              </div>
              <figcaption className="absolute -bottom-5 left-5 rounded-full bg-[#02223b] px-5 py-3 text-xs text-white lg:-left-8">
                Registro profesional <span className="text-[#a8cf45]">1368 CTNPO</span>
              </figcaption>
            </figure>
          </Aparece>
        </div>
      </header>

      {/* ================= TRAYECTORIA ================= */}
      <section aria-labelledby="trayectoria" className="bg-white px-5 py-24 lg:px-14 lg:py-36">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <Aparece as="p" className={`${eyebrow} text-[#0e4d7a]`}>
                01 · Trayectoria
              </Aparece>
              <Aparece retraso={80}>
                <h2 id="trayectoria" className={`${h2} mt-5`}>
                  {anios} años <em className="text-[#0e4d7a]">mirando de cerca</em>.
                </h2>
              </Aparece>
            </div>
            <div className="space-y-6 lg:col-span-6 lg:col-start-7 lg:pt-4">
              <Aparece as="p" className="text-lg leading-relaxed tracking-[-0.01em] lg:text-2xl">
                Me gradué como optómetra en la Universidad de La Salle (Bogotá, 2004) y en 2021 completé mi
                especialización en Ortóptica y Terapia Visual, el área que más me apasiona: entender cómo colaboran
                ambos ojos y ayudar a que ese trabajo en equipo funcione mejor.
              </Aparece>
              <Aparece as="p" retraso={80} className="max-w-[60ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
                Llevo {anios} años ejerciendo la optometría y {aniosOrtoptica} dedicada específicamente a la ortóptica,
                acompañando a niños y adultos con estrabismo, ambliopía y dificultades de visión binocular, siempre
                desde el trato cercano y la constancia que requiere este tipo de terapia. Me gusta mi profesión porque
                creo que es una manera de ayudar a las personas en momentos difíciles.
              </Aparece>
            </div>
          </div>

          {/* Línea de tiempo: formación por años (datos de SITE_CONFIG.credenciales) */}
          <ol aria-label="Formación" className="mt-20 grid border-t border-[#02223b] sm:grid-cols-2 lg:mt-28 lg:grid-cols-6">
            {HITOS.map((h, i) => (
              <Aparece
                as="li"
                key={h.titulo}
                retraso={i * 70}
                className={`relative border-b border-[#02223b]/15 py-7 sm:pr-6 lg:border-b-0 lg:py-0 lg:pt-8`}
              >
                <span aria-hidden="true" className={`absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full max-lg:hidden ${h.clave ? "bg-[#a8cf45]" : "bg-[#02223b]"}`} />
                <span className={`${serif} block text-5xl leading-none tracking-[-0.02em] ${h.clave ? "text-[#0e4d7a]" : "text-[#02223b]"} lg:text-6xl`}>
                  {h.anio}
                </span>
                <span className="mt-4 block text-[15px] font-medium leading-snug">{h.titulo}</span>
                {h.lugar && <span className="mt-1.5 block text-sm leading-snug text-[#4d6880]">{h.lugar}</span>}
              </Aparece>
            ))}
          </ol>
          <Aparece as="p" className="mt-10 max-w-[60ch] border-l-2 border-[#a8cf45] pl-5 text-sm leading-relaxed text-[#4d6880]">
            {credenciales.registroProfesional}. Estas credenciales respaldan la información de este sitio.
          </Aparece>
        </div>
      </section>

      {/* ================= CÓMO TRABAJO ================= */}
      <section aria-labelledby="como-trabajo" className="bg-[#02223b] px-5 py-24 text-white lg:px-14 lg:py-36">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-6">
              <Aparece as="p" className={`${eyebrow} text-[#a8cf45]`}>
                02 · Cómo trabajo
              </Aparece>
              <Aparece retraso={80}>
                <h2 id="como-trabajo" className={`${h2} mt-5 text-white`}>
                  Tres cosas que cuido <em className="text-[#a8cf45]">en cada cita</em>.
                </h2>
              </Aparece>
            </div>
            <Aparece as="p" retraso={160} className="max-w-[44ch] text-[15px] leading-relaxed text-[#b9c9d6] lg:col-span-5 lg:col-start-8 lg:self-end lg:text-lg">
              Sé que llegar a una consulta visual —sobre todo con un hijo pequeño— puede generar dudas y algo de
              nervios.
            </Aparece>
          </div>

          <Aparece className="mt-14 lg:mt-20">
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] bg-[#0b3352] sm:aspect-[2/1] lg:aspect-[21/9]">
                <picture>
                  <source media="(max-width: 640px)" srcSet={foto.srcSm} />
                  <img src={foto.src} alt={foto.alt} width={foto.width} height={foto.height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_55%]" />
                </picture>
              </div>
              <figcaption className="mt-3 text-sm text-[#b9c9d6]">
                Prismas, gafa de prueba, flippers y regla de convergencia: el instrumental de una valoración de ortóptica
              </figcaption>
            </figure>
          </Aparece>

          <ol className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-3 lg:gap-6">
            {PRINCIPIOS.map(([t, d], i) => (
              <Aparece as="li" key={t} retraso={i * 90} className="border-t border-white/25 pt-6">
                <span className={`${serif} block text-6xl leading-none text-[#a8cf45] lg:text-7xl`}>{i + 1}</span>
                <h3 className="mt-6 text-xl font-medium tracking-[-0.01em] text-white lg:text-2xl">{t}</h3>
                <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-[#b9c9d6] lg:text-base">{d}</p>
              </Aparece>
            ))}
          </ol>

          <Aparece as="p" className="mt-16 max-w-[60ch] rounded-2xl border border-white/15 px-6 py-5 text-sm leading-relaxed text-[#b9c9d6]">
            Nota importante: cada caso es único. La información de este sitio es orientativa y no sustituye una
            valoración profesional individual.
          </Aparece>
        </div>
      </section>

      {/* ================= SERVICIOS (enlazado interno) ================= */}
      <Servicios />

      <CierreBreve titulo="¿No sabes por dónde" acento="empezar?">
        Atiendo de forma presencial en Ibagué, y recibo también a familias que viajan desde otras ciudades de Colombia
        para su valoración. Escríbeme por WhatsApp y lo vemos juntos.
      </CierreBreve>
    </article>
  );
}
