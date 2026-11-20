"use client";

/**
 * Recorrido con scroll de la barra de luces (landing de Visión binocular), con
 * el mismo patrón que el del cordón de Brock: sección navy alta, escena sticky y
 * cuatro pasos que se relevan.
 *
 * 1 · la barra y sus luces · 2 · un color para cada ojo (las gafas)
 * 3 · en todas las direcciones (la barra gira y las gafas se invierten)
 * 4 · de lejos a cerca (la barra hacia la nariz y la X de la franja blanca).
 *
 * Basado en el manual del EYEPORT II (Bernell). Copy de los pasos: BORRADOR,
 * pendiente de revisión de la doctora.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ESCENA_PROTAGONISTA } from "../escenas";
import { barraScroll } from "../estadoEscenas";

const BarraLucesEscena = dynamic(() => import("./BarraLucesEscena"), { ssr: false });

const PASOS = [
  {
    n: "01",
    t: "Una barra con doce luces",
    d: "Se coloca a unos 70 cm, un poco por debajo de la mirada. Sus luces rojas y azules se encienden una a una y los ojos las siguen sin mover la cabeza.",
  },
  {
    n: "02",
    t: "Un color para cada ojo",
    d: "Con las gafas, el ojo del filtro rojo solo ve las luces rojas y el del filtro azul solo las azules. Para ver las dos, los dos ojos tienen que trabajar a la vez: si un color desaparece, el cerebro está dejando de usar un ojo.",
  },
  {
    n: "03",
    t: "En todas las direcciones",
    d: "La barra se gira en horizontal, en vertical y en diagonal, y en cada posición se dan la vuelta a las gafas para que los dos ojos trabajen por igual.",
  },
  {
    n: "04",
    t: "De lejos a cerca",
    d: "Sin gafas, la barra apunta a la nariz y las luces se acercan. La franja blanca se ve como dos líneas que se cruzan en la luz que se mira: muestra si los dos ojos apuntan al mismo sitio. Cuándo y cómo usarlo lo decide la profesional en cada caso.",
  },
];

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function BarraRecorrido() {
  const zona = useRef<HTMLElement>(null);
  const pasos = useRef<(HTMLLIElement | null)[]>([]);
  const barra = useRef<HTMLSpanElement>(null);
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
    // compilar shaders; así no hay tirón al llegar a la sección.
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
      barraScroll.p = suave;

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
    <section ref={zona} aria-labelledby="barra-titulo" className="relative h-[460svh] bg-[#02223b] text-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:80px_80px]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[54%] lg:left-[38%] lg:h-full">
          <BarraLucesEscena activo={activo || precalentar} modo="scroll" oscuro />
        </div>

        <div className="absolute inset-x-5 bottom-6 lg:inset-x-auto lg:bottom-auto lg:left-14 lg:top-1/2 lg:w-[34rem] lg:-translate-y-1/2">
          <p className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">
            El ejercicio de las luces
            <span className="relative h-px w-16 overflow-hidden bg-white/15">
              <span ref={barra} className="absolute inset-0 origin-left scale-x-0 bg-[#a8cf45]" />
            </span>
          </p>
          <h2
            id="barra-titulo"
            className="mt-4 font-[family-name:var(--font-v2-serif)] text-[clamp(2.4rem,1rem+3.4vw,4.4rem)] leading-[0.95] tracking-[-0.02em] text-white"
          >
            Una barra de luces que <em className="text-[#a8cf45]">pone a trabajar a los dos ojos</em>.
          </h2>
          <ol className="relative mt-6 h-[12.5rem] lg:mt-12 lg:h-[14rem]">
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
                <p className="mt-3 max-w-[44ch] pl-9 text-[15px] leading-relaxed text-[#b9c9d6] lg:text-lg">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
