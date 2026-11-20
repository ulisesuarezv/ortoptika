"use client";

/**
 * Recorrido con scroll de los discos de luz (landing de Terapia visual), con el
 * mismo patrón que el del cordón, la barra y las cuentas: sección navy alta,
 * escena sticky y cuatro pasos que se relevan.
 *
 * 1 · la referencia en la pared · 2 · la mirada busca el color en el suelo
 * 3 · el toque y su tiempo · 4 · ronda tras ronda (rondas solas y últimos tiempos).
 *
 * Objeto real del consultorio: discos de luz reactivos (uno en la pared y los
 * demás en el suelo; el niño toca o pisa el del color de la referencia).
 * Copy de los pasos: BORRADOR, pendiente de la doctora.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ESCENA_PROTAGONISTA } from "../escenas";
import { discosScroll } from "./DiscosEscena";

const DiscosEscena = dynamic(() => import("./DiscosEscena"), { ssr: false });

const PASOS = [
  {
    n: "01",
    t: "Un color en la pared",
    d: "Un disco en la pared se enciende de un color. Es la referencia: lo que hay que recordar.",
  },
  {
    n: "02",
    t: "La mirada busca",
    d: "En el suelo se encienden varios discos, cada uno de un color. Los ojos los recorren rápido y sin perder la referencia, hasta dar con el que coincide.",
  },
  {
    n: "03",
    t: "El ojo guía al cuerpo",
    d: "Lo toca con la mano o lo pisa. El disco sabe cuándo lo tocaron y mide cuánto tardó: el tiempo entre ver y moverse.",
  },
  {
    n: "04",
    t: "Ronda tras ronda",
    d: "Cada ronda cambia el color y el sitio. El tiempo de cada una queda registrado y así se ve cómo avanza. Cuándo y cómo usarlo lo decide la profesional en cada caso.",
  },
];

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function DiscosRecorrido() {
  const zona = useRef<HTMLElement>(null);
  const pasos = useRef<(HTMLLIElement | null)[]>([]);
  const barra = useRef<HTMLSpanElement>(null);
  const [activo, setActivo] = useState(false);
  const [precalentar, setPrecalentar] = useState(false);

  useEffect(() => {
    const el = zona.current;
    if (!el) return;
    // Una sola escena 3D dibujando a la vez: se activa cuando ya ocupa la pantalla
    // y avisa para que el hero se pause.
    const io = new IntersectionObserver(
      ([e]) => {
        setActivo(e.isIntersecting);
        window.dispatchEvent(new CustomEvent(ESCENA_PROTAGONISTA, { detail: e.isIntersecting }));
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1200));
    const cric = window.cancelIdleCallback ?? window.clearTimeout;
    let fin = 0;
    const idle = ric(() => {
      setPrecalentar(true);
      fin = window.setTimeout(() => setPrecalentar(false), 400);
    });
    io.observe(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let suave = 0;
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      suave += (p - suave) * (reduce ? 1 : 0.12);
      discosScroll.p = suave;
      pasos.current.forEach((li, i) => {
        if (!li) return;
        const a = i * 0.25;
        const entra = i === 0 ? 1 : ss(a - 0.04, a + 0.04, suave);
        const sale = i === PASOS.length - 1 ? 0 : ss(a + 0.21, a + 0.27, suave);
        const op = entra * (1 - sale);
        li.style.opacity = String(op);
        li.style.transform = `translate3d(0,${(1 - entra) * 40 - sale * 40}px,0)`;
        li.style.visibility = op > 0.001 ? "visible" : "hidden";
      });
      if (barra.current) barra.current.style.transform = `scaleX(${suave})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      cric(idle);
      window.clearTimeout(fin);
      window.dispatchEvent(new CustomEvent(ESCENA_PROTAGONISTA, { detail: false }));
    };
  }, []);

  return (
    <section ref={zona} aria-labelledby="discos-titulo" className="relative h-[460svh] bg-[#02223b] text-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:80px_80px]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[54%] lg:left-[38%] lg:h-full">
          <DiscosEscena activo={activo || precalentar} modo="scroll" oscuro />
        </div>

        <div className="absolute inset-x-5 bottom-6 lg:inset-x-auto lg:bottom-auto lg:left-14 lg:top-1/2 lg:w-[34rem] lg:-translate-y-1/2">
          <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">
            Discos de luz
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span ref={barra} className="absolute inset-0 origin-left scale-x-0 bg-[#a8cf45]" />
            </span>
          </p>
          <h2
            id="discos-titulo"
            className="mt-4 font-[family-name:var(--font-v2-serif)] text-[clamp(2.4rem,1rem+3.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em] text-white"
          >
            Ver, decidir <em className="text-[#a8cf45]">y moverse</em>.
          </h2>
          <ol className="relative mt-6 h-[11.5rem] lg:mt-12 lg:h-[13rem]">
            {PASOS.map((p, i) => (
              <li
                key={p.n}
                ref={(el) => {
                  pasos.current[i] = el;
                }}
                className="absolute inset-x-0 top-0 will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <p className="flex gap-4 text-xl font-medium leading-snug tracking-[-0.01em] lg:text-[28px]">
                  <span className="pt-1 text-sm text-[#a8cf45] lg:pt-2">{p.n}</span>
                  {p.t}
                </p>
                <p className="mt-3 max-w-[42ch] pl-9 text-[15px] leading-relaxed text-[#b9c9d6] lg:text-lg">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
