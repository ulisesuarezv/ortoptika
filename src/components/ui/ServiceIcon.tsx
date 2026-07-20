import type { SVGProps } from "react";

/**
 * Iconos de línea sencillos por servicio (placeholder editable).
 * Se pueden sustituir por un set definitivo en el pulido (sesión 7).
 * Todos comparten el mismo trazo para coherencia visual.
 */
const paths: Record<string, string> = {
  // ojo
  estrabismo: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z M12 9a3 3 0 100 6 3 3 0 000-6Z",
  // parche / escudo
  ambliopia: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z",
  // ejercicio / diana
  "terapia-visual": "M12 3v3M12 18v3M3 12h3M18 12h3 M12 8a4 4 0 100 8 4 4 0 000-8Z",
  // dos ojos / binocular
  "vision-binocular": "M7 9a3 3 0 100 6 3 3 0 000-6Z M17 9a3 3 0 100 6 3 3 0 000-6Z M10 12h4",
  // niño / familia
  "optometria-pediatrica": "M12 4a2.5 2.5 0 100 5 2.5 2.5 0 000-5Z M6 20v-3a6 6 0 0112 0v3",
};

type Props = SVGProps<SVGSVGElement> & { slug: string };

export default function ServiceIcon({ slug, ...props }: Props) {
  const d = paths[slug] ?? paths["terapia-visual"];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={(i === 0 ? seg : `M${seg}`).trim()} />
      ))}
    </svg>
  );
}
