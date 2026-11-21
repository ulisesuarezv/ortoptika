"use client";

/**
 * Recorrido con scroll del cordón de Brock (landing de Estrabismo), con el
 * mismo patrón que «Ver es trabajo de equipo» de la home: sección navy alta,
 * escena sticky y cuatro pasos que se relevan.
 *
 * 1 · el cordón y las cuentas · 2 · los dos ojos fijan la misma cuenta
 * 3 · un ojo se desvía · 4 · de cuenta en cuenta (el ejercicio).
 *
 * El recuadro «Lo que se ve» dibuja la percepción real del ejercicio: dos
 * cordones que se cruzan en X en la cuenta fijada; con la endotropía la X se
 * cruza antes de la cuenta y la cuenta se ve doble.
 *
 * Copy de los pasos VALIDADO por la doctora (19-nov-2026): no tocarlo sin ella.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ESCENA_PROTAGONISTA } from "../escenas";
import { brockScroll, guionBrock } from "../estadoEscenas";

const BrockEscena = dynamic(() => import("./BrockEscena"), { ssr: false });

const PASOS = [
  {
    n: "01",
    t: "Un cordón y tres cuentas",
    d: "El cordón de Brock se sostiene junto a la nariz y se estira hacia el frente. Es sencillo, pero muestra con mucha claridad cómo trabajan los dos ojos.",
  },
  {
    n: "02",
    t: "Los dos ojos miran la misma cuenta",
    d: "Cuando los ojos están coordinados, se ven dos cordones que se cruzan justo en la cuenta que se mira, como una X.",
  },
  {
    n: "03",
    t: "Cuando un ojo se desvía",
    d: "Si un ojo se va hacia adentro, la X se cruza antes de la cuenta y la cuenta se ve doble. A veces uno de los cordones desaparece: el cerebro deja de usar ese ojo.",
  },
  {
    n: "04",
    t: "De cuenta en cuenta",
    d: "En terapia, pasar la mirada de una cuenta a otra ayuda a que los ojos trabajen en equipo. Cuándo y cómo usarlo lo decide la profesional en cada caso.",
  },
];

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// recuadro «Lo que se ve»: el cordón visto por el paciente (abajo = cerca)
const CUENTAS_Y = [196, 124, 56]; // verde (cerca), naranja, azul (lejos)
const CUENTAS_R = [10, 8, 6];
const CUENTAS_C = ["#a8cf45", "#e0893a", "#2f7fb8"];
const K = 0.46; // abertura de la X

export default function BrockRecorrido() {
  const zona = useRef<HTMLElement>(null);
  const pasos = useRef<(HTMLLIElement | null)[]>([]);
  const barra = useRef<HTMLSpanElement>(null);
  const vista = useRef<HTMLDivElement>(null);
  const cordA = useRef<SVGLineElement>(null);
  const cordB = useRef<SVGLineElement>(null);
  const cuentasA = useRef<(SVGCircleElement | null)[]>([]);
  const cuentasB = useRef<(SVGCircleElement | null)[]>([]);
  const [activo, setActivo] = useState(false);
  const [precalentar, setPrecalentar] = useState(false);

  useEffect(() => {
    const el = zona.current;
    if (!el) return;
    // Una sola escena 3D dibujando a la vez: el recorrido se activa cuando ya ocupa
    // la pantalla (no cuando asoma) y avisa para que el hero se pause.
    const io = new IntersectionObserver(
      ([e]) => {
        setActivo(e.isIntersecting);
        window.dispatchEvent(new CustomEvent(ESCENA_PROTAGONISTA, { detail: e.isIntersecting }));
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    // Precalentar: con el navegador libre, dibuja unos frames fuera de pantalla para
    // compilar shaders y cargar los ojos; así no hay tirón al llegar a la sección.
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
    let yc = CUENTAS_Y[1];
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      suave += (p - suave) * (reduce ? 1 : 0.12);
      brockScroll.p = suave;

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

      // «Lo que se ve»: la X se cruza en la cuenta fijada; con la desviación, antes
      const g = guionBrock(suave);
      const meta = CUENTAS_Y[g.fija] + 52 * g.desv;
      yc += (meta - yc) * (reduce ? 1 : 0.15);
      const x = (y: number, s: number) => 110 + s * K * (y - yc);
      cordA.current?.setAttribute("x1", String(x(240, -1)));
      cordA.current?.setAttribute("x2", String(x(0, -1)));
      cordB.current?.setAttribute("x1", String(x(240, 1)));
      cordB.current?.setAttribute("x2", String(x(0, 1)));
      CUENTAS_Y.forEach((y, i) => {
        cuentasA.current[i]?.setAttribute("cx", String(x(y, -1)));
        cuentasB.current[i]?.setAttribute("cx", String(x(y, 1)));
      });
      if (vista.current) {
        const v = ss(0.22, 0.3, suave);
        vista.current.style.opacity = String(v);
        vista.current.style.transform = `translate3d(0,${(1 - v) * 16}px,0)`;
      }
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
    <section ref={zona} aria-labelledby="cordon-titulo" className="relative h-[460svh] bg-[#02223b] text-white">
      <div className="sticky top-0 flex h-[100lvh] flex-col overflow-hidden lg:block">
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:80px_80px]"
        />
        <div aria-hidden="true" className="relative min-h-0 flex-1 lg:absolute lg:inset-x-0 lg:top-0 lg:left-[38%] lg:h-full">
          <BrockEscena activo={activo || precalentar} modo="scroll" oscuro />
          {/* lo que ve el paciente: dentro de la zona de la escena (en móvil, abajo a la derecha; nunca sobre el texto) */}
          <div
            ref={vista}
            aria-hidden="true"
            className="absolute bottom-2 right-4 z-10 w-[100px] rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-sm lg:bottom-12 lg:right-14 lg:w-[210px] lg:p-5"
            style={{ opacity: 0 }}
          >
            <p className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a8cf45] lg:text-[10px] lg:tracking-[0.22em]">Lo que se ve</p>
            <svg viewBox="0 0 220 240" className="mt-2 w-full lg:mt-3">
              <line ref={cordA} y1={240} y2={0} stroke="#efe8da" strokeWidth={2} strokeOpacity={0.85} />
              <line ref={cordB} y1={240} y2={0} stroke="#efe8da" strokeWidth={2} strokeOpacity={0.85} />
              {CUENTAS_Y.map((y, i) => (
                <g key={i}>
                  <circle ref={(e) => void (cuentasA.current[i] = e)} cy={y} r={CUENTAS_R[i]} fill={CUENTAS_C[i]} fillOpacity={0.75} />
                  <circle ref={(e) => void (cuentasB.current[i] = e)} cy={y} r={CUENTAS_R[i]} fill={CUENTAS_C[i]} fillOpacity={0.75} />
                </g>
              ))}
            </svg>
          </div>
        </div>


        <div className="relative mx-5 mb-[calc(100lvh-100svh+1.5rem)] mt-3 shrink-0 lg:absolute lg:m-0 lg:inset-x-auto lg:bottom-auto lg:left-14 lg:top-1/2 lg:w-[34rem] lg:-translate-y-1/2">
          <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">
            El ejercicio del cordón
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span ref={barra} className="absolute inset-0 origin-left scale-x-0 bg-[#a8cf45]" />
            </span>
          </p>
          <h2
            id="cordon-titulo"
            className="mt-4 font-[family-name:var(--font-v2-serif)] text-[clamp(2.4rem,1rem+3.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em] text-white"
          >
            Un cordón que muestra <em className="text-[#a8cf45]">hacia dónde mira cada ojo</em>.
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
