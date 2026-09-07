import { SITE_CONFIG, whatsappLink } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Backdrop from "@/components/ui/Backdrop";
import Parallax from "@/components/ui/Parallax";

/**
 * Hero disruptivo: titular fragmentado en escala extrema (de 500 a >8xl), palabra
 * gigante "ver" como gráfico de fondo que sangra por la derecha, retrato solapado
 * con z-index narrativo sobre el titular y meta-info en columna vertical lateral
 * (writing-mode). Copy borrador de la sesión 3 sin cambios. h1 único.
 *
 * Coreografía de entrada (Sesión 2 de motion): cada línea del h1 se divide en
 * palabras pre-separadas en el server (sin SplitText de GSAP, que no está
 * instalado — es plugin de pago) y cada palabra anima con `.enter-shift`
 * (transform puro) o `.enter-up`, heredando el patrón ya validado para el LCP.
 * La línea "terapia visual" es la candidata a LCP: sus palabras SOLO usan
 * `.enter-shift` (nunca opacity:0) para no retrasar su pintado.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-cream-soft"
    >
      {/* Capas de fondo SVG animadas: blobs orgánicos con parallax + ondas ópticas */}
      <Parallax className="absolute inset-0 z-0" amount={12}>
        <Backdrop variant="blobs" />
      </Parallax>
      <Backdrop variant="waves" className="z-0 opacity-60" />

      {/* Palabra-gráfico gigante que sangra por la derecha */}
      <span
        aria-hidden="true"
        className="watermark enter-fade absolute -right-[7vw] top-[46vh] text-[38vw] [--enter-delay:600ms] sm:top-[34vh] lg:top-[30vh]"
      >
        ver
      </span>

      {/* Meta vertical en el borde izquierdo (lee de abajo a arriba) */}
      <div
        aria-hidden="true"
        className="enter-fade absolute inset-y-0 left-2 z-20 hidden items-center [--enter-delay:450ms] lg:flex"
      >
        <span className="vertical-text font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-ink-400">
          {SITE_CONFIG.direccion.ciudad} · {SITE_CONFIG.direccion.departamento}
          <span className="mx-3 text-primary-400">—</span>
          {SITE_CONFIG.social.instagramHandle}
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:pl-16 lg:pr-8">
        {/* Meta superior (solo móvil/tablet) */}
        <div className="enter-fade flex items-center justify-between gap-2 py-5 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-ink-500 [--enter-delay:350ms] lg:hidden">
          <span>
            {SITE_CONFIG.direccion.ciudad}, {SITE_CONFIG.direccion.departamento}
          </span>
          <span className="text-primary-700">
            {SITE_CONFIG.social.instagramHandle}
          </span>
        </div>

        <div className="relative grid gap-y-10 pb-16 pt-6 lg:grid-cols-12 lg:gap-x-6 lg:pb-28 lg:pt-14">
          {/* Titular fragmentado — cruza el viewport, escala extrema */}
          {/* Entrada por CSS (no Reveal/GSAP: esto está en el viewport inicial).
              El span 8xl es candidato a LCP en móvil → enter-shift (solo
              transform, nunca opacity:0). El resto, fade-up en cascada. */}
          <Reveal className="relative z-20 lg:col-span-8">
            <span className="eyebrow enter-up">
              Ortóptica &amp; Terapia Visual
            </span>
            <h1 id="hero-title" className="mt-7">
              <span className="block font-display text-2xl font-normal italic text-slate-ink-400 sm:text-3xl">
                <span className="enter-up inline-block [--enter-delay:110ms]">
                  Ortóptica
                </span>{" "}
                <span className="enter-up inline-block [--enter-delay:160ms]">
                  y
                </span>
              </span>
              <span className="-mt-1 block text-6xl font-medium leading-[0.9] text-slate-ink-900 sm:text-7xl lg:text-8xl">
                <span className="enter-shift inline-block">terapia</span>{" "}
                <span className="enter-shift inline-block [--enter-delay:60ms]">
                  visual
                </span>
              </span>
              <span className="accent-word mt-1 block text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                <span className="enter-up inline-block [--enter-delay:210ms]">
                  para
                </span>{" "}
                <span className="enter-up inline-block [--enter-delay:250ms]">
                  tu
                </span>{" "}
                <span className="enter-up inline-block [--enter-delay:290ms]">
                  familia
                </span>
              </span>
              <span className="enter-up mt-4 inline-block font-heading text-xs font-semibold uppercase tracking-[0.24em] text-primary-700 [--enter-delay:350ms]">
                En Ibagué · Colombia
              </span>
            </h1>
          </Reveal>

          {/* Retrato solapado — sangra hacia arriba y cruza sobre el titular */}
          <Reveal
            delay={0.15}
            className="enter-shift relative z-30 -mt-2 [--enter-delay:120ms] lg:col-span-4 lg:-mt-8 lg:pl-4"
          >
            <div className="relative mx-auto max-w-[19rem] rotate-[1.5deg] lg:mx-0 lg:max-w-none">
              <div
                aria-hidden="true"
                className="enter-fade absolute -right-6 -top-6 h-36 w-36 rounded-full bg-accent-100/70 blur-2xl [--enter-delay:400ms]"
              />
              {/* Foto real (WebP optimizado; para reemplazar: sobrescribir el
                  PNG fuente y regenerar public/images/dra-yeimmy-barragan.webp). */}
              <div className="photo-frame relative aspect-[4/5] w-full overflow-hidden rounded-[7rem_2rem_7rem_2rem] shadow-lift ring-1 ring-line">
                {/* <picture> nativo (no next/image): con images.unoptimized no
                    hay srcset automático, y esta imagen es el LCP — en móvil
                    sirve la variante de 560px (~38KB vs ~70KB). */}
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet="/images/dra-yeimmy-barragan-sm.webp"
                  />
                  <img
                    src="/images/dra-yeimmy-barragan.webp"
                    alt="Dra. Yeimmy Paola Barragan, optómetra especialista en ortóptica y terapia visual"
                    width={900}
                    height={900}
                    loading="eager"
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover object-[42%_50%]"
                  />
                </picture>
                {/* Cortina de marca: cubre la foto y se retira (scale, no
                    opacity) — el <img> de arriba ya está pintado desde el
                    frame 0, esto es puro teatro visual encima. */}
                <div
                  aria-hidden="true"
                  className="enter-curtain pointer-events-none absolute inset-0 z-10 bg-primary-700 [--enter-delay:420ms]"
                />
              </div>
              {/* Chip de credencial flotante, contra-rotado */}
              <div className="enter-up absolute -bottom-6 -left-5 z-20 flex -rotate-[1.5deg] items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-card backdrop-blur-sm [--enter-delay:600ms]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 font-heading text-sm font-bold text-white">
                  YB
                </span>
                <span className="pr-1 text-sm leading-tight">
                  <span className="block font-heading font-semibold text-slate-ink-900">
                    {SITE_CONFIG.profesional}
                  </span>
                  <span className="text-xs text-muted">
                    Optómetra · Ortóptica
                  </span>
                </span>
              </div>
            </div>
          </Reveal>

          {/* Descripción + CTAs — columna estrecha bajo el titular, rompe la línea base */}
          <Reveal
            delay={0.1}
            className="relative z-20 flex flex-col items-start gap-7 lg:col-span-7 lg:mt-6"
          >
            <p className="enter-up max-w-[46ch] border-l-2 border-accent-500 pl-5 text-lg leading-relaxed text-slate-ink-700 [--enter-delay:380ms]">
              Si notas que tu hijo desvía un ojo, se acerca mucho para ver o se
              cansa al leer, no estás solo. Acompaño a niños y adultos con una
              valoración cuidadosa y un plan de terapia visual pensado para cada
              caso, siempre a tu ritmo y con explicaciones claras.
            </p>
            <div className="enter-up flex flex-wrap items-center gap-x-5 gap-y-3 [--enter-delay:460ms]">
              <Button href={whatsappLink()} external size="lg">
                Agendar cita por WhatsApp
              </Button>
              <Button
                href="/sobre-mi"
                variant="ghost"
                size="lg"
                className="lg:translate-y-3"
              >
                Conocer a la especialista
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
