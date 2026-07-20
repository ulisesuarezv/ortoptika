"use client";

import { createElement, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@/hooks/useGSAP";

type ParallaxProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * Intensidad del parallax en % de la altura del propio elemento.
   * Positivo → el elemento "se queda atrás" (capa de fondo). Mantener bajo
   * (6–18) para que sea ambiente, no efecto.
   */
  amount?: number;
};

/**
 * Parallax LIGERO por scroll para capas decorativas (p. ej. <Backdrop/>).
 * Solo transform (yPercent) con scrub → sin layout thrash, sin scroll-jacking.
 * Respeta prefers-reduced-motion vía useGSAP (no anima; la capa queda fija).
 *
 * Uso: <Parallax className="absolute inset-0" amount={10}><Backdrop …/></Parallax>
 * (el wrapper hereda el posicionamiento; Backdrop dentro sigue siendo servidor)
 */
export default function Parallax({
  children,
  as = "div",
  className,
  amount = 10,
}: ParallaxProps) {
  const scope = useGSAP<HTMLElement>(
    ({ self, gsap }) => {
      gsap.fromTo(
        self,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: {
            trigger: self.parentElement ?? self,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    [amount],
  );

  return createElement(as, { ref: scope, className }, children);
}
