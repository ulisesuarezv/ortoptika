import type { ReactNode } from "react";

export type TrustItem = {
  /** Cifra o etiqueta corta y destacada (ej. "+8 años"). */
  stat: string;
  /** Descripción breve de la credencial/formación. */
  label: string;
  icon?: ReactNode;
};

/**
 * Barra de confianza: credenciales / formación / señales E-E-A-T.
 * PLACEHOLDER editable — los datos reales (años, nº de pacientes, títulos)
 * los confirma la doctora antes de producción (sesiones 3+).
 */
const DEFAULT_ITEMS: TrustItem[] = [
  { stat: "Optómetra", label: "Titulada y colegiada · placeholder" },
  { stat: "Especialista", label: "Ortóptica y terapia visual · placeholder" },
  { stat: "+X años", label: "Experiencia clínica · por confirmar" },
  { stat: "Ibagué", label: "Presencial · pacientes de toda Colombia" },
];

type TrustBarProps = {
  items?: TrustItem[];
  className?: string;
};

export default function TrustBar({
  items = DEFAULT_ITEMS,
  className,
}: TrustBarProps) {
  return (
    <ul
      className={`grid grid-cols-2 gap-y-10 border-t border-line pt-10 sm:grid-cols-4 sm:gap-y-0 ${
        className ?? ""
      }`}
    >
      {items.map((item, i) => (
        <li
          key={i}
          // Offset vertical alternado en escritorio: la fila deja de ser plana.
          className={`flex flex-col gap-1 px-1 sm:border-l sm:border-line sm:px-6 sm:first:border-l-0 sm:first:pl-0 ${
            i % 2 === 1 ? "sm:translate-y-8" : ""
          }`}
        >
          {item.icon}
          <span className="font-display text-3xl font-medium italic leading-tight text-primary-700 sm:text-4xl">
            {item.stat}
          </span>
          <span className="text-xs leading-snug text-muted">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
