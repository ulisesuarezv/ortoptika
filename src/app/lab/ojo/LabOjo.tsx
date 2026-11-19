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

export default function LabOjo() {
  const [pupila, setPupila] = useState(0.3);
  const [activa, setActiva] = useState(-1);
  const zona = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alScroll = () => {
      const el = zona.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      ojoEstado.p = p;
      // las capas se presentan una a una tras el despiece (p 0.35 → 1)
      const i = p < 0.35 ? -1 : Math.min(CAPAS.length - 1, Math.floor(((p - 0.35) / 0.65) * CAPAS.length));
      setActiva(i);
    };
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
      ojoEstado.p = 0;
    };
  }, []);

  return (
    <div ref={zona} className="relative h-[420svh] bg-primary-950">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <Ojo className="absolute inset-0" pupila={pupila} />

        {/* textos: derecha en escritorio, abajo en móvil */}
        <div
          className={`pointer-events-none absolute inset-x-5 bottom-10 transition-opacity duration-700 lg:inset-x-auto lg:bottom-auto lg:right-[6vw] lg:top-1/2 lg:w-[34vw] lg:-translate-y-1/2 ${activa >= 0 ? "opacity-100" : "opacity-0"}`}
        >
          <p className="mb-6 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-400">
            Anatomía del ojo
          </p>
          <ol className="space-y-5 lg:space-y-7">
            {CAPAS.map((c, i) => (
              <li
                key={c.n}
                className={`transition-all duration-500 ${i === activa ? "opacity-100" : i < activa ? "opacity-35" : "opacity-0 translate-y-3"} ${i === activa ? "" : "max-lg:hidden"}`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-heading text-sm text-accent-400">{c.n}</span>
                  <h2 className="font-heading text-2xl font-semibold text-white lg:text-4xl">{c.t}</h2>
                </div>
                <p className="mt-2 max-w-[38ch] pl-9 text-sm leading-relaxed text-primary-100 lg:text-base">{c.d}</p>
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
