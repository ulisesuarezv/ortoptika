"use client";

import { useGSAP } from "@/hooks/useGSAP";

/**
 * Efecto "magnético" sutil: el elemento sigue el puntero dentro de su propia
 * caja (desplazamiento acotado por `strength`) y vuelve a su sitio al salir.
 * Reutiliza useGSAP → gsap.context + cleanup + bail-out en prefers-reduced-motion.
 * Solo se activa con puntero fino (mouse real): en touch, mousemove no dispara,
 * así que el efecto queda inerte por sí solo, pero además comprobamos
 * (hover: hover)+(pointer: fine) explícitamente para evitar el "sticky hover"
 * de algunos navegadores táctiles.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength = 0.35,
) {
  return useGSAP<T>(({ self, gsap }) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const xTo = gsap.quickTo(self, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(self, "y", { duration: 0.5, ease: "power3.out" });

    function onMove(e: MouseEvent) {
      const rect = self.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    }
    function onLeave() {
      xTo(0);
      yTo(0);
    }

    self.addEventListener("mousemove", onMove);
    self.addEventListener("mouseleave", onLeave);

    return () => {
      self.removeEventListener("mousemove", onMove);
      self.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
}
