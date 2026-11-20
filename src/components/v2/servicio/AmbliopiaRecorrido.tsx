"use client";

/**
 * Recorrido con scroll de la landing de Ambliopía, con el mismo patrón que los
 * demás: sección navy alta, escena sticky y cuatro pasos que se relevan.
 *
 * Reutiliza el tablero de cuentas como «la imagen que manda cada ojo»
 * (AmbliopiaEscena): 1 · cada ojo manda su imagen · 2 · el cerebro se queda con
 * la nítida · 3 · primero, las gafas · 4 · darle trabajo al ojo ambliope (parche
 * o atropina sobre el ojo sano).
 *
 * Copy: BORRADOR, pendiente de la doctora. Solo se presenta como tratamiento lo
 * que tiene evidencia sólida (gafas, parche, atropina; PEDIG y AAO 2023); nada
 * de «cura», cifras de éxito ni efecto terapéutico del tablero. Fuentes:
 * ~/Desktop/KayaoCC/docs/ortoptika-v2/ambliopia-research.md.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ESCENA_PROTAGONISTA } from "../escenas";
import { ambliopiaScroll } from "./AmbliopiaEscena";

const AmbliopiaEscena = dynamic(() => import("./AmbliopiaEscena"), { ssr: false });

const PASOS = [
  {
    n: "01",
    t: "Cada ojo manda su imagen",
    d: "El cerebro recibe dos imágenes, una de cada ojo. En la ambliopía, la de un ojo llega borrosa y apagada, aunque el ojo esté sano.",
  },
  {
    n: "02",
    t: "El cerebro se queda con la nítida",
    d: "Para no confundirse, se apoya en el ojo que ve mejor y deja de lado la imagen del otro. Por eso el niño parece ver bien con los dos ojos abiertos.",
  },
  {
    n: "03",
    t: "Primero, las gafas",
    d: "Si hay una fórmula sin corregir, las gafas son el primer paso: la imagen de ese ojo se aclara y, a veces, solo con eso ya hay avance.",
  },
  {
    n: "04",
    t: "Darle trabajo al ojo ambliope",
    d: "Con un parche o con gotas en el ojo que ve bien, el cerebro tiene que usar el otro. Con constancia, su imagen suele ganar nitidez, y el objetivo es que los dos ojos trabajen juntos. Cuándo y cómo lo decide la profesional en cada caso.",
  },
];

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function AmbliopiaRecorrido() {
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
      ambliopiaScroll.p = suave;
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
    <section ref={zona} aria-labelledby="ambliopia-titulo" className="relative h-[460svh] bg-[#02223b] text-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:80px_80px]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[54%] lg:left-[38%] lg:h-full">
          <AmbliopiaEscena activo={activo || precalentar} modo="scroll" oscuro />
        </div>

        <div className="absolute inset-x-5 bottom-6 lg:inset-x-auto lg:bottom-auto lg:left-14 lg:top-1/2 lg:w-[34rem] lg:-translate-y-1/2">
          <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">
            Lo que manda cada ojo
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span ref={barra} className="absolute inset-0 origin-left scale-x-0 bg-[#a8cf45]" />
            </span>
          </p>
          <h2
            id="ambliopia-titulo"
            className="mt-4 font-[family-name:var(--font-v2-serif)] text-[clamp(2.4rem,1rem+3.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em] text-white"
          >
            Un ojo que el cerebro <em className="text-[#a8cf45]">dejó de escuchar</em>.
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
