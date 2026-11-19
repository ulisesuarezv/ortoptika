"use client";

/**
 * Pieza del ojo de cada landing: el mismo modelo del hero, con una mirada que
 * cuenta el servicio. Estrabismo: cordón de Brock en 3D (BrockEscena), sin ojo. Ambliopía: sigue
 * al cursor con retraso, como un ojo que aún no trabaja a la par. Terapia
 * visual: recorre un ocho, como en un ejercicio de seguimiento. Optometría
 * pediátrica: sigue al cursor, juguetón y con la pupila más abierta. Visión
 * binocular: los dos ojos convergen y se separan.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { dosOjosEstado } from "../DosOjosEscena";

const OjoEscena = dynamic(() => import("@/components/three/OjoEscena"), { ssr: false });
const DosOjosEscena = dynamic(() => import("../DosOjosEscena"), { ssr: false });
const BrockEscena = dynamic(() => import("./BrockEscena"), { ssr: false });

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// puntero normalizado (-1…1) leído por las miradas que lo siguen con retraso
const puntero = { x: 0, y: 0, lx: 0, ly: 0, t: 0 };

type Mirada = { pupila: number; seguir: boolean; mirar?: () => { x: number; y: number } };

const reloj = () => performance.now() / 1000;

const MIRADAS: Record<string, Mirada> = {
  estrabismo: {
    pupila: 0.3,
    seguir: false,
    mirar: () => {
      // ciclo de 6 s: mira al frente, se va hacia la nariz, se sostiene y vuelve
      const c = reloj() % 6;
      const d = ss(1.6, 2.4, c) * (1 - ss(4.2, 5.0, c));
      return { x: 0.12 + 0.42 * d, y: 0.04 - 0.05 * d };
    },
  },
  ambliopia: {
    pupila: 0.34,
    seguir: false,
    mirar: () => {
      const t = reloj();
      const dt = Math.min(0.1, t - puntero.t);
      puntero.t = t;
      const k = Math.min(1, dt * 0.9); // mucho más lento que el ojo normal
      puntero.lx += (puntero.x - puntero.lx) * k;
      puntero.ly += (puntero.y - puntero.ly) * k;
      return { x: puntero.lx * 0.5, y: puntero.ly * 0.35 };
    },
  },
  "terapia-visual": {
    pupila: 0.28,
    seguir: false,
    mirar: () => {
      const t = reloj() * 0.7;
      return { x: Math.sin(t) * 0.5, y: Math.sin(t * 2) * 0.22 };
    },
  },
  "optometria-pediatrica": { pupila: 0.42, seguir: true },
};

export default function OjoServicio({ slug, className = "" }: { slug: string; className?: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActivo(e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(el);
    const mover = (e: PointerEvent) => {
      puntero.x = (e.clientX / window.innerWidth) * 2 - 1;
      puntero.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", mover, { passive: true });

    // visión binocular: el punto se acerca y se aleja; los ojos convergen
    let raf = 0;
    if (slug === "vision-binocular") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tick = () => {
        const c = (reloj() % 7) / 7;
        dosOjosEstado.p = reduce ? 0.47 : 0.06 + 0.42 * (0.5 - 0.5 * Math.cos(c * Math.PI * 2));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", mover);
      cancelAnimationFrame(raf);
      dosOjosEstado.p = 0;
    };
  }, [slug]);

  const m = MIRADAS[slug];
  return (
    <div ref={caja} aria-hidden="true" className={className}>
      {slug === "estrabismo" ? (
        <BrockEscena activo={activo} />
      ) : slug === "vision-binocular" ? (
        <DosOjosEscena activo={activo} />
      ) : (
        <OjoEscena activo={activo} pupila={m?.pupila ?? 0.3} seguir={m?.seguir ?? true} mirar={m?.mirar} />
      )}
    </div>
  );
}
