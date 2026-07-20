import Link from "next/link";
import type { Service } from "@/lib/constants";
import ServiceIcon from "@/components/ui/ServiceIcon";

type ServiceCardProps = {
  service: Service;
  /** Posición 1-based, se muestra como índice editorial sobredimensionado. */
  index?: number;
  /** Tarjeta ancha (destacada) dentro de una rejilla irregular. */
  featured?: boolean;
  /** Clases de posicionamiento en la rejilla (col/row span, rotación, offset). */
  className?: string;
};

/**
 * Tarjeta de servicio editorial: índice grande + título display + resumen,
 * enlaza a `/servicios/[slug]`. En modo `featured` ocupa dos columnas y coloca
 * el contenido en una fila asimétrica. Consume un item de SERVICES.
 */
export default function ServiceCard({
  service,
  index,
  featured = false,
  className,
}: ServiceCardProps) {
  const href = `/servicios/${service.slug}`;
  const num = index != null ? String(index).padStart(2, "0") : null;

  return (
    <Link
      href={href}
      className={`group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift focus-visible:-translate-y-1 ${
        featured
          ? "sm:flex-row sm:items-end sm:gap-10 bg-gradient-to-br from-primary-50 to-surface"
          : ""
      } ${className ?? ""}`}
    >
      {/* Índice como marca de agua tipográfica */}
      {num && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-8xl italic leading-none text-primary-100 transition-colors duration-300 group-hover:text-primary-200"
        >
          {num}
        </span>
      )}

      <div className="relative flex items-start gap-4">
        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-soft transition-colors group-hover:bg-primary-700">
          <ServiceIcon slug={service.slug} className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl font-medium leading-tight text-slate-ink-900">
            {service.titulo}
          </h3>
          {!featured && (
            <p className="max-w-[42ch] text-sm leading-relaxed text-muted">
              {service.resumen}
            </p>
          )}
        </div>
      </div>

      <div
        className={`relative flex items-center gap-4 ${
          featured ? "sm:flex-col sm:items-end sm:text-right" : "justify-between"
        }`}
      >
        {featured && (
          <p className="max-w-[38ch] text-sm leading-relaxed text-slate-ink-700 sm:order-first">
            {service.resumen}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-heading text-sm font-semibold text-primary-700">
          Ver más
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
