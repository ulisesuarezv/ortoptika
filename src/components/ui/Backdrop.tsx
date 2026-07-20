/**
 * Capas de fondo animadas en SVG — lenguaje de marca (visión/óptica/calidez).
 *
 * Server Component: SVG inline + animación por CSS (@keyframes en globals.css,
 * solo transform/opacity → compositor GPU). `prefers-reduced-motion` las congela
 * vía la regla global. Siempre decorativas: aria-hidden, pointer-events-none y
 * DETRÁS del contenido (la sección debe ser `relative` y su contenido `relative z-10`).
 *
 * Reutilizable en las landings de servicio:
 *   <section className="relative overflow-hidden">
 *     <Backdrop variant="blobs" />
 *     <div className="relative z-10">…</div>
 *   </section>
 */

type BackdropProps = {
  /** blobs = formas orgánicas · waves = trayectorias ópticas · iris = anillos concéntricos · dots = retícula de puntos */
  variant: "blobs" | "waves" | "iris" | "dots";
  /** Espeja la composición horizontalmente para variar entre secciones. */
  flip?: boolean;
  /** dark → trazos/rellenos pensados para fondos oscuros (footer, bandas teal). */
  tone?: "light" | "dark";
  className?: string;
};

const BLOB_A =
  "M421.9,297.8Q408,345.6,371.6,382.1Q335.2,418.6,284.1,431.9Q233,445.2,190.5,417.4Q148,389.6,110.3,353.3Q72.6,317,80.9,266.5Q89.2,216,117.8,176.9Q146.4,137.8,190.2,113.4Q234,89,283.6,97.9Q333.2,106.8,376.4,136.1Q419.6,165.4,427.7,215.2Q435.8,265,421.9,297.8Z";

const BLOB_B =
  "M431.5,303.5Q422,357,378.5,390.5Q335,424,281.5,437Q228,450,180,422.5Q132,395,97.5,352.5Q63,310,71.5,255Q80,200,113.5,159Q147,118,196,99Q245,80,295.5,91.5Q346,103,387,135.5Q428,168,434.5,221.5Q441,275,431.5,303.5Z";

/** Trayectorias ópticas: ondas finas que fluyen por la sección. */
const WAVES = [
  "M-100,620 C200,560 500,700 820,620 C1140,540 1400,560 1750,640",
  "M-100,680 C240,620 520,760 860,680 C1200,600 1420,620 1750,700",
  "M-100,540 C180,500 480,620 800,560 C1120,500 1400,480 1750,560",
];

export default function Backdrop({
  variant,
  flip = false,
  tone = "light",
  className,
}: BackdropProps) {
  const dark = tone === "dark";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden ${
        flip ? "-scale-x-100" : ""
      } ${className ?? ""}`}
    >
      {variant === "blobs" && (
        <>
          <div className="anim-drift absolute -right-[12%] -top-[14%] w-[58%] min-w-72 max-w-3xl">
            <svg viewBox="0 0 500 500" className="h-auto w-full">
              <path
                d={BLOB_A}
                fill={dark ? "var(--color-primary-800)" : "var(--color-primary-100)"}
                opacity={dark ? 0.5 : 0.6}
              />
            </svg>
          </div>
          <div className="anim-drift-reverse absolute -bottom-[18%] -left-[10%] w-[46%] min-w-60 max-w-2xl">
            <svg viewBox="0 0 500 500" className="h-auto w-full">
              <path
                d={BLOB_B}
                fill={dark ? "var(--color-accent-900)" : "var(--color-accent-100)"}
                opacity={dark ? 0.35 : 0.55}
              />
            </svg>
          </div>
        </>
      )}

      {variant === "waves" && (
        <div className="anim-wave absolute inset-y-0 -left-[5%] w-[130%]">
          <svg
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
            fill="none"
          >
            {WAVES.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={
                  dark ? "var(--color-primary-500)" : "var(--color-primary-300)"
                }
                strokeWidth="1.3"
                vectorEffect="non-scaling-stroke"
                opacity={dark ? 0.28 - i * 0.06 : 0.5 - i * 0.13}
              />
            ))}
          </svg>
        </div>
      )}

      {variant === "iris" && (
        <div className="anim-breathe absolute -right-[8rem] top-1/2 w-[34rem] -translate-y-1/2 sm:w-[42rem]">
          {/* Eco del logo ojo+cerebro: iris de anillos concéntricos dentro de
              un contorno almendrado, con el arco de "ceja" en lima de marca. */}
          <svg viewBox="0 0 600 600" className="h-auto w-full" fill="none">
            {[70, 125, 180, 235].map((r, i) => (
              <circle
                key={r}
                cx="300"
                cy="300"
                r={r}
                stroke={
                  dark ? "var(--color-primary-600)" : "var(--color-primary-200)"
                }
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                opacity={0.75 - i * 0.13}
              />
            ))}
            {/* Contorno almendrado del ojo */}
            <path
              d="M-30,300 Q300,40 630,300 Q300,560 -30,300"
              stroke={
                dark ? "var(--color-primary-500)" : "var(--color-primary-300)"
              }
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              opacity="0.5"
            />
            {/* Arco superior (ceja/pestaña) en lima — acento gráfico puntual */}
            <path
              d="M-10,235 Q300,-30 610,235"
              stroke="var(--color-accent-500)"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              opacity={dark ? 0.45 : 0.4}
            />
            <circle
              cx="300"
              cy="300"
              r="10"
              fill="var(--color-accent-500)"
              opacity="0.55"
            />
          </svg>
        </div>
      )}

      {variant === "dots" && (
        <div
          className="anim-drift absolute -inset-[8%]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-line) 1.1px, transparent 1.1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(55% 55% at 72% 28%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(55% 55% at 72% 28%, black, transparent)",
            opacity: dark ? 0.35 : 0.7,
          }}
        />
      )}
    </div>
  );
}
