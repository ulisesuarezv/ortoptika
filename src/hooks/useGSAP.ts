"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type DependencyList,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Registro global de plugins de GSAP (una sola vez, solo en cliente).
 * ScrollTrigger se registra aquí para que cualquier consumidor del hook
 * lo tenga disponible sin volver a registrarlo.
 */
let pluginsRegistered = false;
function registerPlugins() {
  if (pluginsRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;

  // Las fuentes display (Fraunces) reflowean el layout al cargar, después
  // de que ScrollTrigger ya calculó las posiciones de sus triggers. Sin refrescar,
  // los puntos de disparo quedan desalineados y algún reveal puede no ejecutarse
  // (contenido que queda oculto). Recalculamos cuando las fuentes están listas.
  if (typeof document !== "undefined" && "fonts" in document) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

// useLayoutEffect avisa en SSR; usamos useEffect como fallback en servidor.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type SetupArgs<T extends HTMLElement> = {
  /** Elemento raíz al que se ancla el scope (el ref del hook). */
  self: T;
  /** Instancia de gsap ya con ScrollTrigger registrado. */
  gsap: typeof gsap;
};

type SetupCleanup = void | (() => void);

/**
 * Hook base de GSAP con:
 * - registro global de ScrollTrigger,
 * - `gsap.context()` scopeado al ref → selectores acotados y cleanup automático,
 * - respeto a `prefers-reduced-motion` (si el usuario lo pide, no se anima nada
 *   y los elementos quedan en su estado natural/visible).
 *
 * Debe usarse SOLO en componentes cliente ("use client"). Las animaciones nunca
 * deben ejecutarse en Server Components (romperían el static export).
 *
 * @example
 * const scope = useGSAP(({ self, gsap }) => {
 *   gsap.from(self.children, { autoAlpha: 0, y: 24, stagger: 0.1 });
 * });
 * return <div ref={scope}>…</div>;
 */
export function useGSAP<T extends HTMLElement = HTMLDivElement>(
  setup: (args: SetupArgs<T>) => SetupCleanup,
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    registerPlugins();

    const self = ref.current;
    if (!self) return;

    // Movimiento reducido: no animamos. El DOM ya está en su estado final visible.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    let extraCleanup: SetupCleanup;
    const ctx = gsap.context(() => {
      extraCleanup = setup({ self, gsap });
    }, self);

    // Cleanup: revierte animaciones y mata los ScrollTrigger de este scope,
    // evitando fugas al navegar entre páginas. `extraCleanup` permite al setup
    // liberar recursos no-GSAP (p. ej. un IntersectionObserver).
    return () => {
      extraCleanup?.();
      ctx.revert();
    };
  }, deps);

  return ref;
}
