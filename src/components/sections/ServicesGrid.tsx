import { SERVICES } from "@/lib/constants";
import ServiceCard from "@/components/ui/ServiceCard";
import Reveal from "@/components/ui/Reveal";
import Backdrop from "@/components/ui/Backdrop";
import Parallax from "@/components/ui/Parallax";

// Posicionamiento irregular por tarjeta: spans desiguales + offsets que rompen la
// línea base + una tarjeta ligeramente girada. La rejilla deja de ser una fila
// regular de tarjetas iguales.
const PLACEMENT = [
  "sm:col-span-2 lg:col-span-7", // 01 destacada, ancha
  "lg:col-span-5 lg:mt-20", // 02 cae
  "lg:col-span-4", // 03
  "lg:col-span-4 lg:mt-16", // 04 cae
  "lg:col-span-4 lg:-mt-6 lg:-rotate-[1.3deg] hover:rotate-0", // 05 girada, sube
];

/**
 * Rejilla de servicios anti-grid: encabezado asimétrico con marca de agua
 * tipográfica gigante detrás, y una rejilla de 12 columnas con spans desiguales,
 * tarjetas que caen/suben de fila y una girada. Copy borrador sin cambios.
 */
export default function ServicesGrid() {
  return (
    <section
      aria-labelledby="services-title"
      className="relative overflow-hidden bg-cream"
    >
      {/* Capa de fondo: retícula de puntos que respira, arriba a la derecha */}
      <Parallax className="absolute inset-0 z-0" amount={8}>
        <Backdrop variant="dots" />
      </Parallax>

      {/* Marca de agua tipográfica que sangra por la izquierda */}
      <span
        aria-hidden="true"
        className="watermark absolute -left-[3vw] top-24 text-[26vw] text-primary-100/60 sm:text-[18vw]"
      >
        áreas
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        {/* Encabezado 80/20 */}
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="eyebrow">Áreas de atención</span>
            <h2
              id="services-title"
              className="mt-5 text-5xl sm:text-6xl lg:text-7xl"
            >
              En qué puedo <em className="accent-word">ayudarte</em>
            </h2>
          </div>
          <p className="max-w-[38ch] text-muted lg:col-span-4 lg:pb-3 lg:text-right">
            Cada persona ve el mundo de una forma distinta. Estas son las
            principales áreas en las que trabajo; en la primera valoración
            definimos juntos qué necesita tu caso.
          </p>
        </Reveal>

        <Reveal
          stagger
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-start lg:gap-6"
        >
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.slug}
              service={service}
              index={i + 1}
              featured={i === 0}
              className={PLACEMENT[i]}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
