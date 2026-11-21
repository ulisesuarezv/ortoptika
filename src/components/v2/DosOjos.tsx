"use client";

/**
 * «Ver es trabajo de equipo»: sección fija con dos ojos en 3D y cuatro textos
 * que se relevan con el scroll (convergencia, desvío, visión doble y terapia).
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { dosOjosEstado } from "./estadoEscenas";
import { servicioV2 } from "./rutas";

const DosOjosEscena = dynamic(() => import("./DosOjosEscena"), { ssr: false });

// BORRADOR de copy: validar con la doctora.
const PASOS = [
  {
    n: "01",
    t: "Cada ojo ve su propia imagen.",
    d: "Un poco distinta a la del otro. El cerebro las une en una sola, y de ahí sale la profundidad.",
  },
  {
    n: "02",
    t: "Para mirar de cerca, los dos giran hacia adentro.",
    d: "Se llama convergencia. Pasa cada vez que tu hijo lee, escribe o mira el celular.",
  },
  {
    n: "03",
    t: "A veces el equipo no se coordina.",
    d: "Un ojo se queda atrás o se va hacia afuera. Aparecen la visión doble, el cansancio al leer o el dolor de cabeza.",
  },
  {
    n: "04",
    t: "Y esa coordinación se puede entrenar.",
    d: "La terapia visual la trabaja con ejercicios en consulta y en casa, al ritmo de cada persona.",
  },
];

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function DosOjos() {
  const zona = useRef<HTMLElement>(null);
  const pasos = useRef<(HTMLLIElement | null)[]>([]);
  const barra = useRef<HTMLSpanElement>(null);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const el = zona.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActivo(e.isIntersecting), { rootMargin: "20% 0px" });
    io.observe(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let suave = 0;
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      dosOjosEstado.p = p;
      suave += (p - suave) * (reduce ? 1 : 0.12);
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
    };
  }, []);

  return (
    <section ref={zona} aria-labelledby="equipo-titulo" className="relative h-[420svh] bg-[#02223b] text-white">
      <div className="sticky top-0 h-[100lvh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:80px_80px]"
        />
        <div className="absolute inset-x-0 top-0 h-[56%] lg:left-[36%] lg:h-full">
          <DosOjosEscena activo={activo} />
        </div>

        <div className="absolute inset-x-5 bottom-[calc(100lvh-100svh+1.5rem)] lg:inset-x-auto lg:bottom-auto lg:left-14 lg:top-1/2 lg:w-[34rem] lg:-translate-y-1/2">
          <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">
            Visión binocular
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span ref={barra} className="absolute inset-0 origin-left scale-x-0 bg-[#a8cf45]" />
            </span>
          </p>
          <h2 id="equipo-titulo" className="mt-4 font-[family-name:var(--font-v2-serif)] text-white text-[clamp(2.4rem,1rem+3.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em]">
            Ver es trabajo <em className="text-[#a8cf45]">de equipo</em>.
          </h2>
          <ol className="relative mt-6 h-[12.5rem] lg:mt-12 lg:h-[13rem]">
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
                <p className="mt-3 max-w-[40ch] pl-9 text-[15px] leading-relaxed text-[#b9c9d6] lg:text-lg">{p.d}</p>
                {i === PASOS.length - 1 && (
                  <p className="mt-4 flex flex-wrap gap-1.5 pl-9 text-xs lg:mt-5 lg:gap-2 lg:text-sm">
                    {[
                      ["Visión binocular", servicioV2("vision-binocular")],
                      ["Terapia visual", servicioV2("terapia-visual")],
                      ["Estrabismo", servicioV2("estrabismo")],
                    ].map(([t, href]) => (
                      <Link key={href} href={href} className="rounded-full border border-white/25 px-3 py-1.5 transition-colors lg:px-4 lg:py-2 hover:border-[#a8cf45] hover:text-[#a8cf45]">
                        {t} →
                      </Link>
                    ))}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
