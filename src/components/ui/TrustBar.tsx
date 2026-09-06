import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

export type TrustItem = {
  /** Cifra o etiqueta corta y destacada (ej. "+8 años"). */
  stat: string;
  /** Descripción breve de la credencial/formación. */
  label: string;
  icon?: ReactNode;
};

/**
 * Barra de confianza: credenciales / formación / señales E-E-A-T.
 * Datos reales confirmados por la doctora (ver SITE_CONFIG.credenciales).
 */
const DEFAULT_ITEMS: TrustItem[] = [
  { stat: "Optómetra", label: "Universidad de La Salle, 2004" },
  { stat: "Especialista", label: "Ortóptica y terapia visual, 2021" },
  { stat: "+22 años", label: "Ejerciendo la optometría (6 como ortoptista)" },
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
    <Reveal
      as="ul"
      stagger
      className={`grid grid-cols-2 gap-y-10 border-t border-line pt-10 sm:grid-cols-4 sm:gap-y-0 ${
        className ?? ""
      }`}
    >
      {items.map((item, i) => (
        // <li> es el nodo que anima <Reveal> (fade/slide de entrada): el offset
        // alternado vive en un <div> interno para que GSAP no lo neutralice
        // (al animar, fija `translate: none` inline sobre el nodo que anima,
        // lo que pisaría permanentemente el sm:translate-y-8 de Tailwind si
        // ambos estuvieran en el mismo elemento).
        <li key={i}>
          <div
            // Offset vertical alternado en escritorio: la fila deja de ser plana.
            className={`flex flex-col gap-1 px-1 sm:border-l sm:border-line sm:px-6 sm:first:border-l-0 sm:first:pl-0 ${
              i % 2 === 1 ? "sm:translate-y-8" : ""
            }`}
          >
            {item.icon}
            <span className="font-display text-3xl font-medium italic leading-tight text-primary-700 sm:text-4xl">
              {item.stat}
            </span>
            <span className="text-xs leading-snug text-muted">
              {item.label}
            </span>
          </div>
        </li>
      ))}
    </Reveal>
  );
}
