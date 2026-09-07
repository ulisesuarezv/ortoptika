import type { Photo as PhotoData } from "@/lib/photos";

/**
 * Foto real del consultorio — Server Component, sin estado.
 *
 * Usa <picture> nativo y NO next/image: con `images.unoptimized` (static
 * export) next/image no aporta nada y estorba para servir dos anchos
 * distintos por breakpoint. Mismo criterio que el retrato del Hero.
 *
 * La animación de entrada NO vive aquí: la ponen los envoltorios cliente que
 * ya existen (<Reveal>, <Parallax>) desde fuera. Así este componente no
 * arrastra "use client" a las páginas que lo usan.
 *
 * ⚠️ El hover (escala) va sobre el <img>, nunca sobre la raíz: si un <Reveal>
 * anima la raíz, GSAP le fija `scale: none` inline y mata el hover para
 * siempre. Es el gotcha ya documentado del proyecto — dos nodos, dos
 * transformaciones.
 */
type Variant = "frame" | "bleed" | "cutout";

type PhotoProps = {
  photo: PhotoData;
  variant?: Variant;
  /** Clases del contenedor (aspecto, radios orgánicos, offsets, márgenes). */
  className?: string;
  /**
   * Pie de foto; en "frame" se revela al hacer hover. Si no se pasa, se usa
   * el de la propia foto (`photo.caption`).
   */
  caption?: string;
  /**
   * `sizes` del <img>. Sólo informativo aquí (no hay srcset de anchos), pero
   * se mantiene por si algún día se habilita la optimización de imágenes.
   */
  sizes?: string;
  /** Ajuste del encuadre visible cuando la foto se recorta. */
  objectPosition?: string;
  /** true sólo si la foto entra por encima del pliegue. */
  priority?: boolean;
};

export default function Photo({
  photo,
  variant = "frame",
  className = "",
  caption,
  objectPosition,
  priority = false,
}: PhotoProps) {
  const loading = priority ? undefined : "lazy";
  const pie = caption ?? photo.caption;

  const img = (
    <picture>
      <source media="(max-width: 640px)" srcSet={photo.srcSm} type="image/webp" />
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={loading}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        style={objectPosition ? { objectPosition } : undefined}
        className={
          variant === "cutout"
            ? "h-auto w-full object-contain drop-shadow-[0_28px_45px_rgba(2,34,59,0.18)]"
            : "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform motion-safe:group-hover:scale-[1.03]"
        }
      />
    </picture>
  );

  if (variant === "cutout") {
    // Sin marco ni fondo: el recorte con alfa flota directamente sobre el crema.
    return <div className={className}>{img}</div>;
  }

  if (variant === "bleed") {
    // Banda a sangre: la altura la fija el contenedor, no la relación de aspecto.
    return (
      <div className={`group relative overflow-hidden ${className}`}>{img}</div>
    );
  }

  return (
    <figure className={`photo-frame group relative ${className}`}>
      {img}
      {pie ? (
        // Visible siempre en táctil; en dispositivos con puntero sube al hover.
        <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-ink-900/85 to-transparent px-5 pb-4 pt-10 font-heading text-sm font-medium leading-snug text-cream transition-transform duration-500 ease-out [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0">
          {pie}
        </figcaption>
      ) : null}
    </figure>
  );
}
