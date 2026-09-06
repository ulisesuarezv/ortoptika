"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type MagneticLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  /** Fuerza del tirón magnético (ver useMagnetic). */
  strength?: number;
};

/**
 * `<a>` magnético sin estilos propios (a diferencia de Button, sin variantes):
 * para CTAs con diseño a medida que solo necesitan el tirón de useMagnetic.
 * Client leaf aislado a propósito — permite que el componente que lo usa
 * (p. ej. Footer) siga siendo Server Component (ver decisiones-tecnicas).
 */
export default function MagneticLink({
  children,
  strength = 0.3,
  ...rest
}: MagneticLinkProps) {
  const ref = useMagnetic<HTMLAnchorElement>(strength);
  return (
    <a ref={ref} {...rest}>
      {children}
    </a>
  );
}
