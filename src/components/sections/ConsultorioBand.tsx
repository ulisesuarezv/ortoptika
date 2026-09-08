import { SITE_CONFIG } from "@/lib/constants";
import { PHOTOS } from "@/lib/photos";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

/**
 * Banda a sangre del gimnasio visual, entre "Sobre mí" y contacto.
 *
 * Responde la objeción silenciosa de todo paciente nuevo —"¿esto es un
 * consultorio de verdad o un cuarto con una silla?"— y ninguna ilustración
 * puede sustituirla. Va a sangre (sin `max-w`) a propósito: rompe el ritmo
 * de secciones acolchadas justo antes del cierre y deja respirar la página.
 *
 * El tapete del suelo es azul y lima, la paleta de marca, así que la foto
 * encaja con el sitio sin ningún tratamiento de color.
 */
export default function ConsultorioBand() {
  return (
    <section
      aria-labelledby="consultorio-title"
      data-cursor-theme="dark"
      className="relative border-y border-line bg-slate-ink-900"
    >
      {/* min-h, no h: en ventanas bajas el texto crece más que la banda y con
          altura fija el overflow-hidden se comía el eyebrow y el título. */}
      <div className="relative flex min-h-[clamp(20rem,45vh,32rem)] flex-col justify-end overflow-hidden">
        {/* El sobreancho vertical evita que el parallax descubra los bordes. */}
        <Parallax className="absolute inset-x-0 -inset-y-[10%]" amount={12}>
          <Photo
            photo={PHOTOS.salaTerapia}
            variant="bleed"
            objectPosition="50% 72%"
            className="h-full w-full"
          />
        </Parallax>

        {/* Velo lateral: protege la columna de texto entera (el fondo de la
            foto es claro y con mucho detalle) sin apagar la mitad derecha. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-ink-900/90 via-slate-ink-900/55 to-slate-ink-900/10"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-16 sm:px-8 sm:pt-20 lg:pb-12">
          <Reveal from="left" className="max-w-xl">
            <span className="eyebrow text-accent-300">El consultorio</span>
            <h2
              id="consultorio-title"
              className="mt-3 text-3xl text-cream sm:text-4xl lg:text-5xl"
            >
              Un espacio pensado para entrenar la mirada
            </h2>
            <p className="mt-4 max-w-[46ch] leading-relaxed text-cream/80">
              La terapia visual no se hace sentado frente a una pantalla: se
              trabaja con equilibrio, movimiento y materiales concretos. Este es
              el espacio donde ocurre, en {SITE_CONFIG.direccion.clinica}.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
