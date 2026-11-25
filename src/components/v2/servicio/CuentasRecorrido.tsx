"use client";

/**
 * Recorrido con scroll del tablero de cuentas (landing de Optometría
 * pediátrica), con el mismo patrón que el del cordón y la barra: sección navy
 * alta, escena sticky y cuatro pasos que se relevan.
 *
 * 1 · el tablero y el montón · 2 · las cuentas van a su pivote
 * 3 · el modelo y una cuenta fuera de lugar · 4 · el ojo terminado.
 *
 * La doctora lo usa en terapia: los niños copian un modelo. Copy: BORRADOR
 * (el paso 4 ya lo aprobó el usuario, 20-nov-2026); pendiente de la doctora.
 * Evitar decir que la actividad «trata» la ambliopía: actividades de cerca
 * durante el parche no mejoran el resultado (PEDIG, Ophthalmology 2008).
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ESCENA_PROTAGONISTA } from "../escenas";
import { cuentasScroll } from "../estadoEscenas";

const CuentasEscena = dynamic(() => import("./CuentasEscena"), { ssr: false });

const PASOS = [
  {
    n: "01",
    t: "Un juego que también es terapia",
    d: "Un tablero, un montón de cuentas de colores y un dibujo para copiar. Para tu hijo es un juego; para mí, una forma de ver cómo usa sus ojos sin que se sienta examinado.",
  },
  {
    n: "02",
    t: "Mirar, buscar, poner",
    d: "Cada cuenta pide que el ojo guíe a la mano: encontrarla, tomarla y llevarla a su pivote. De cerca y por un buen rato, enfocando y con los dos ojos juntos sobre algo pequeño.",
  },
  {
    n: "03",
    t: "Copiar el modelo",
    d: "Copiar pide recordar lo que vio, ubicar cada color en su sitio y notar la diferencia con el modelo. Dónde se equivoca también me dice algo.",
  },
  {
    n: "04",
    t: "La figura terminada",
    d: "Tú ves un dibujo. Yo vi cómo se acercó, cuánto aguantó y si un ojo trabajó más que el otro. Cuándo y cómo usarlo lo decide la profesional en cada caso.",
  },
];

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function CuentasRecorrido() {
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
      cuentasScroll.p = suave;
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
    <section ref={zona} aria-labelledby="cuentas-titulo" className="relative h-[calc(var(--pantalla,100svh)*4.6)] bg-[#02223b] text-white">
      <div className="sticky top-0 flex h-[100lvh] flex-col overflow-hidden lg:block">
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:80px_80px]"
        />
        <div aria-hidden="true" className="relative min-h-0 flex-1 lg:absolute lg:inset-x-0 lg:top-0 lg:left-[38%] lg:h-full">
          <CuentasEscena activo={activo || precalentar} modo="scroll" oscuro />
        </div>

        <div className="relative mx-5 mb-[calc(100lvh-100svh+1.5rem)] mt-3 shrink-0 lg:absolute lg:m-0 lg:inset-x-auto lg:bottom-auto lg:left-14 lg:top-1/2 lg:w-[34rem] lg:-translate-y-1/2">
          <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">
            Cuentas de colores
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span ref={barra} className="absolute inset-0 origin-left scale-x-0 bg-[#a8cf45]" />
            </span>
          </p>
          <h2
            id="cuentas-titulo"
            className="mt-4 font-[family-name:var(--font-v2-serif)] text-[clamp(2.4rem,1rem+3.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em] text-white"
          >
            Mientras juega, <em className="text-[#a8cf45]">sus ojos trabajan</em>.
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
