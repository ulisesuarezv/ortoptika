import { SITE_CONFIG } from "@/lib/constants";
import { PHOTOS } from "@/lib/photos";
import Photo from "@/components/ui/Photo";
import Button from "@/components/ui/Button";
import TrustBar from "@/components/ui/TrustBar";
import Reveal from "@/components/ui/Reveal";
import Backdrop from "@/components/ui/Backdrop";
import Parallax from "@/components/ui/Parallax";

/**
 * Avance "Sobre mí" con solapamiento intencional: retrato recortado en blob
 * orgánico a la derecha que sangra, tarjeta de texto que cabalga sobre su borde
 * izquierdo (z-index narrativo), índice 01 gigante y cita/palabra de fondo a
 * escala. TrustBar de credenciales debajo. Copy borrador sin cambios.
 */
export default function AboutPreview() {
  return (
    <section
      aria-labelledby="about-title"
      className="relative overflow-hidden border-y border-line bg-surface"
    >
      {/* Capa de fondo: anillos de iris que respiran, en el borde izquierdo */}
      <Parallax className="absolute inset-0 z-0" amount={10}>
        <Backdrop variant="iris" flip />
      </Parallax>

      {/* Palabra-cita gigante de fondo */}
      <Parallax className="absolute -bottom-[4vw] right-[3vw] z-0" amount={6}>
        <span
          aria-hidden="true"
          className="watermark block text-[24vw] text-cream-deep sm:text-[16vw]"
        >
          cerca
        </span>
      </Parallax>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid items-center gap-y-8 lg:grid-cols-12">
          {/* Retrato blob que sangra a la derecha */}
          <Reveal
            delay={0.1}
            from="right"
            scale
            className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1"
          >
            <span
              aria-hidden="true"
              className="section-index absolute -left-2 -top-16 z-20 text-[9rem] leading-none lg:-left-10 lg:text-[12rem]"
            >
              01
            </span>
            {/* Foto real de consulta. El retrato de la doctora ya abre el Hero:
                aquí interesa mostrarla TRABAJANDO, que es lo que sostiene el
                bloque "Sobre mí". Regenerable con scripts/optimize-photos.mjs. */}
            <Photo
              photo={PHOTOS.doctoraConsulta}
              objectPosition="60% 45%"
              className="mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[63%_37%_58%_42%/54%_48%_52%_46%] shadow-lift ring-1 ring-line lg:mr-[-6vw] lg:max-w-none"
            />
          </Reveal>

          {/* Tarjeta de texto que cabalga sobre el retrato */}
          <Reveal
            from="left"
            className="relative z-20 flex flex-col items-start gap-5 rounded-[2rem] bg-cream/90 p-8 shadow-card ring-1 ring-line backdrop-blur-sm sm:p-10 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:bg-cream/80"
          >
            <span className="eyebrow">Sobre mí</span>
            <h2 id="about-title" className="text-4xl sm:text-5xl lg:text-6xl">
              {SITE_CONFIG.profesional}
            </h2>
            <p className="font-heading text-lg font-medium text-primary-700">
              {SITE_CONFIG.titulo}
            </p>
            <p className="max-w-[50ch] text-lg leading-relaxed text-slate-ink-700">
              Soy optómetra especializada en ortóptica y terapia visual. Me
              dedico a algo que me apasiona: entender cómo trabaja cada mirada y
              acompañar a mis pacientes —sobre todo a los más pequeños— con
              paciencia y cercanía. Creo en explicar cada paso, resolver dudas
              sin prisa y trabajar de la mano con las familias.
            </p>
            <Button href="/sobre-mi" variant="secondary">
              Leer mi trayectoria
            </Button>
          </Reveal>
        </div>

        <TrustBar className="mt-20 lg:mt-28" />
      </div>
    </section>
  );
}
