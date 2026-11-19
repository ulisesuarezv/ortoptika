"use client";

import { useEffect, useRef, useState } from "react";
import Ojo from "@/components/three/Ojo";
import { ojoEstado } from "@/components/three/ojoEstado";

// BORRADOR de copy: validar con la doctora antes de publicar.
const CAPAS = [
  { n: "01", t: "Córnea", d: "La ventana del ojo. Transparente y curva, es la primera lente que enfoca la luz." },
  { n: "02", t: "Iris y pupila", d: "El músculo que da el color al ojo y regula cuánta luz entra, como el diafragma de una cámara." },
  { n: "03", t: "Cristalino", d: "La lente interna que cambia de forma para enfocar de lejos y de cerca." },
  { n: "04", t: "Esclera", d: "La capa blanca que protege el ojo. En ella se insertan los músculos que lo mueven: los que trabaja la ortóptica." },
];

const INICIO = 0.34; // los textos arrancan cuando el despiece ya está abierto
const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Cada capa ocupa un tramo del scroll. Dentro del tramo: entra (sube y aparece),
 * se sostiene y sale (sigue subiendo y se desvanece). Todo es función continua
 * del progreso suavizado: si el scroll se detiene a mitad, el texto también.
 * Se escribe directo en el DOM desde un rAF (sin re-render de React).
 */
function estilo(p: number, i: number) {
  const tramo = (1 - INICIO) / CAPAS.length;
  const w = tramo * 0.2; // duración del relevo
  // relevo k: entre la capa k-1 y la k, centrado en el borde del tramo
  const relevo = (k: number) =>
    k === 0 ? ss(INICIO - 0.07, INICIO + 0.03, p) : k >= CAPAS.length ? 0 : ss(INICIO + k * tramo - w, INICIO + k * tramo + w, p);
  const entra = relevo(i), sale = relevo(i + 1);
  // la que entra empuja a la que sale: siempre separadas 100 % (sin encimarse)
  const y = (1 - entra) * 100 - sale * 100;
  return { y, entra, sale };
}

export default function LabOjo() {
  const [pupila, setPupila] = useState(0.3);
  const zona = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const barra = useRef<HTMLSpanElement>(null);
  const rotulo = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let suave = 0;
    let raf = 0;
    const tick = () => {
      const el = zona.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / total));
        ojoEstado.p = p;
        suave += (p - suave) * (reduce ? 1 : 0.1); // misma inercia que el 3D
        items.current.forEach((li, i) => {
          if (!li) return;
          const tit = li.querySelector<HTMLElement>("[data-t]");
          const des = li.querySelector<HTMLElement>("[data-d]");
          const a = estilo(suave, i);
          // el párrafo sale ANTES del relevo de títulos y entra DESPUÉS (nunca se cruzan)
          const bIn = estilo(suave - 0.035, i), bOut = estilo(suave + 0.035, i);
          const b = { y: (1 - bIn.entra) * 40 - bOut.sale * 40, entra: bIn.entra, sale: bOut.sale };
          const opA = Math.min(1, a.entra * 1.6) * (1 - a.sale);
          const opB = Math.pow(b.entra, 2) * Math.pow(1 - b.sale, 2); // párrafos de alto distinto: fundido rápido
          if (tit) { tit.style.opacity = String(opA); tit.style.transform = `translate3d(0,${a.y}%,0)`; }
          if (des) { des.style.opacity = String(opB); des.style.transform = `translate3d(0,${b.y}%,0)`; }
          li.style.visibility = opA + opB > 0.001 ? "visible" : "hidden";
        });
        const g = ss(INICIO - 0.08, INICIO + 0.02, suave);
        if (rotulo.current) rotulo.current.style.opacity = String(g);
        if (barra.current) barra.current.style.transform = `scaleX(${ss(INICIO, 1, suave)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ojoEstado.p = 0;
    };
  }, []);

  return (
    <div ref={zona} className="relative h-[420svh] bg-primary-950">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <Ojo className="absolute inset-0" pupila={pupila} />

        {/* textos: derecha en escritorio, abajo en móvil — uno a la vez, ligados al scroll */}
        <div className="pointer-events-none absolute inset-x-5 bottom-8 lg:inset-x-auto lg:bottom-auto lg:right-[6vw] lg:top-1/2 lg:w-[34vw] lg:-translate-y-1/2">
          <p ref={rotulo} className="mb-5 flex items-center gap-4 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-400 opacity-0">
            Anatomía del ojo
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span ref={barra} className="absolute inset-0 origin-left scale-x-0 bg-accent-400" />
            </span>
          </p>
          <ol className="relative h-[9.5rem] lg:h-[12rem]">
            {CAPAS.map((c, i) => (
              <li
                key={c.n}
                ref={(el) => { items.current[i] = el; }}
                className="invisible absolute inset-x-0 top-0"
              >
                <div className="-mb-3 overflow-hidden pb-3">
                  <div data-t className="flex items-baseline gap-4 opacity-0 will-change-transform">
                    <span className="font-heading text-sm text-accent-400">{c.n}</span>
                    <h2 className="font-heading text-3xl font-semibold text-white lg:text-5xl">{c.t}</h2>
                  </div>
                </div>
                <div className="-mb-2 mt-2 overflow-hidden pb-2">
                  <p data-d className="max-w-[38ch] pl-9 text-sm leading-relaxed text-primary-100 opacity-0 will-change-transform lg:text-lg">
                    {c.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/10 px-5 py-3 text-xs text-white backdrop-blur">
          <span>Pupila</span>
          <input
            type="range"
            min={0.16}
            max={0.6}
            step={0.01}
            value={pupila}
            onChange={(e) => setPupila(Number(e.target.value))}
            aria-label="Tamaño de la pupila"
          />
          <span className="w-8 tabular-nums">{pupila.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
