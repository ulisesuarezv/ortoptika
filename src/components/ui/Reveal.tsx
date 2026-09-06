"use client";

import { createElement, type ElementType, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";

type RevealDirection = "up" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  /** Etiqueta semántica a renderizar (div por defecto). */
  as?: ElementType;
  className?: string;
  /**
   * Si es true, anima los hijos directos con un stagger sutil (para grids/listas).
   * Si es false (defecto), hace fade-up del bloque completo.
   */
  stagger?: boolean;
  /** Retraso inicial en segundos. */
  delay?: number;
  /**
   * Dirección de entrada: "up" (defecto), o lateral ("left"/"right") para dar
   * direccionalidad a composiciones asimétricas (el elemento viene DESDE ese
   * lado). El desplazamiento es sutil; la opacidad hace el trabajo principal.
   */
  from?: RevealDirection;
  /**
   * Si es true, suma un leve scale de entrada (0.94 → 1) al fade/slide.
   * Para elementos superpuestos/rotados que deben sentirse "asentándose"
   * en su sitio (fotos, tarjetas flotantes) en vez de solo aparecer.
   */
  scale?: boolean;
};

/** Desplazamiento inicial por dirección (px). Sutil: ambiente, no efecto. */
const OFFSETS: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  left: { x: -32, y: 12 },
  right: { x: 32, y: 12 },
};

/**
 * Envoltorio cliente que aplica la animación base "fade-up" al entrar en viewport
 * usando ScrollTrigger. Mantiene el markup de las secciones (Server Components)
 * limpio: la animación vive aquí, en el cliente.
 *
 * Respeta prefers-reduced-motion vía el hook useGSAP (no anima; queda visible).
 */
export default function Reveal({
  children,
  as = "div",
  className,
  stagger = false,
  delay = 0,
  from = "up",
  scale = false,
}: RevealProps) {
  const scope = useGSAP<HTMLElement>(
    ({ self, gsap }) => {
      // Contenido en el viewport inicial O por encima de él en el momento de
      // hidratar: NO se anima. Ocultar lo visible re-pinta tarde y dispara el
      // LCP (medido: 7s+ en móvil throttled); y lo que queda por encima ya fue
      // visto (el usuario pudo scrollear ANTES de que hidratara React — móvil
      // lento). El reveal queda solo para lo que aún está por entrar.
      const rect = self.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) return;

      const targets = stagger ? Array.from(self.children) : self;
      const offset = OFFSETS[from];

      // Patrón set + to (en vez de .from): con .from + stagger, GSAP registra
      // el estado final con los hijos ya ocultos y anima de 0 a 0. set() fija
      // el estado inicial y to() revela de forma fiable.
      gsap.set(targets, {
        autoAlpha: 0,
        x: offset.x,
        y: offset.y,
        ...(scale ? { scale: 0.94 } : {}),
      });

      // Trigger DESACOPLADO del tween (ScrollTrigger.create + onEnter, en vez
      // de pasar scrollTrigger dentro del tween): si el tween va vinculado,
      // un ScrollTrigger.refresh() global (p. ej. el de document.fonts.ready)
      // puede pillarlo en pleno vuelo y revertirlo a su estado inicial,
      // dejando el contenido invisible de forma permanente e intermitente.
      // Con el callback, el trigger solo dispara (posicional: detecta también
      // saltos de scroll tipo End/anclas) y el tween vive libre.
      ScrollTrigger.create({
        trigger: self,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(targets, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            ...(scale ? { scale: 1 } : {}),
            duration: 0.8,
            ease: "power3.out",
            delay,
            // Stagger con curva: los primeros hijos entran más seguidos y la
            // cola se relaja → se lee como cascada intencional, no metrónomo.
            stagger: stagger ? { each: 0.12, ease: "power1.in" } : 0,
            overwrite: "auto",
          });
        },
      });
    },
    [stagger, delay, from, scale],
  );

  return createElement(as, { ref: scope, className }, children);
}
