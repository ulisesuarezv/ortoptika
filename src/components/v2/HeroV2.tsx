"use client";

/**
 * Hero de la v2.
 *
 * Arranca como la dirección B del tablero (titular cálido a la izquierda, ojo
 * enorme entrando por la derecha y siguiendo al cursor) y, con el scroll, el ojo
 * se gira, se centra y se despieza como la dirección C (lámina técnica con
 * etiquetas). La sección queda fija mientras dura la transformación.
 *
 * Todo el movimiento es función continua del progreso suavizado: si el scroll se
 * detiene, la escena también. El DOM se escribe desde un rAF (sin re-render de
 * React) y el 3D lee el mismo progreso desde `ojoEstado`.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Ojo from "@/components/three/Ojo";
import type { OjoPose } from "@/components/three/OjoEscena";
import { ojoEstado } from "@/components/three/ojoEstado";
import { SITE_CONFIG, whatsappLink } from "@/lib/constants";
import { BotonAgendar, Logo, enlaceNav } from "./Cabecera";
import MenuMovil from "./MenuMovil";
import { ENLACES } from "./rutas";

// BORRADOR de copy: validar con la doctora antes de publicar.
const CAPAS = [
  { k: "cornea", n: "01", t: "Córnea", d: "La primera lente del ojo." },
  { k: "iris", n: "02", t: "Iris y pupila", d: "Regula cuánta luz entra." },
  { k: "cristalino", n: "03", t: "Cristalino", d: "Enfoca de lejos y de cerca." },
  { k: "esclera", n: "04", t: "Esclera", d: "Aquí se insertan los músculos que mueven el ojo." },
] as const;

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Tramos del progreso del hero (0 = como B, 1 = como C)
const T = {
  mover: [0.0, 0.5] as const, // el ojo viaja de la derecha al centro y gira a 3/4
  separar: [0.22, 0.72] as const, // las capas se abren
  textos: [0.0, 0.22] as const, // se retiran párrafo, botones y tarjeta
  etiquetas: 0.62, // empiezan a aparecer las etiquetas
};
const DURACION_ENTRADA = 1.6; // s

// progreso de la entrada al cargar (0 → 1), lo escribe el rAF del DOM
const entrada = { v: 0 };

/** Dónde está el ojo en cada momento (unidades de mundo de la escena). */
function poseHero(p: number, { halfH, aspect }: { halfH: number; aspect: number }): OjoPose {
  const halfW = halfH * aspect;
  const m = ss(T.mover[0], T.mover[1], p);
  const sep = ss(T.separar[0], T.separar[1], p);
  const i = 1 - Math.pow(1 - entrada.v, 3); // easeOutCubic

  if (aspect >= 1) {
    // B: enorme, a la derecha, sangrando por el borde. Entra desde fuera girando.
    // En pantallas más cuadradas que 16:10 (1024×768, iPad apaisado) el ojo pisaba el
    // párrafo: se corre a la derecha. Desde 16:10 (el encuadre aprobado) no cambia.
    const corrida = Math.min(0.14, Math.max(0, (1.6 - aspect) * 0.4));
    const bx = halfW * (0.56 + corrida) + (1 - i) * halfW * 0.55;
    const bs = 1.8 * (0.82 + 0.18 * i);
    const bry = -(1 - i) * 0.9;
    // C: a la izquierda y un poco abajo, girado a 3/4: las capas se abren a la derecha
    return {
      x: mix(bx, -halfW * 0.42, m),
      y: mix(-0.04 * halfH, -0.1 * halfH, m),
      rx: mix(0, 0.1, m),
      ry: mix(bry, 1.12, m),
      s: mix(bs, 0.98, m),
      sep,
    };
  }
  // Móvil: B abajo a la derecha; C con despiece vertical a la izquierda (etiquetas a la derecha)
  const by = -halfH * 0.5 - (1 - i) * halfH * 0.5;
  return {
    x: mix(halfW * 0.42, -halfW * 0.4, m),
    y: mix(by, -halfH * 0.36, m),
    rx: mix(0, -1.2, m),
    ry: mix(-(1 - i) * 0.6, 0.12, m),
    s: mix(1.45, 0.7, m),
    sep,
  };
}

export default function HeroV2() {
  const zona = useRef<HTMLElement>(null);
  const titular = useRef<HTMLHeadingElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const tarjeta = useRef<HTMLDivElement>(null);
  const fondoB = useRef<HTMLDivElement>(null);
  const fondoC = useRef<HTMLDivElement>(null);
  const ctaFinal = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLParagraphElement>(null);
  const etiquetas = useRef<(HTMLLIElement | null)[]>([]);
  const [activo, setActivo] = useState(true);

  // el canvas deja de dibujar cuando el hero sale de pantalla
  useEffect(() => {
    const el = zona.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActivo(e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let suave = 0;
    let raf = 0;

    const tick = () => {
      const el = zona.current;
      if (el) {
        entrada.v = reduce ? 1 : Math.min(1, (performance.now() - t0) / 1000 / DURACION_ENTRADA);
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / total));
        ojoEstado.p = p;
        suave += (p - suave) * (reduce ? 1 : 0.1); // misma inercia que el 3D
        const s = suave;
        const vw = window.innerWidth, vh = window.innerHeight;
        const ancho = vw / vh >= 1;
        const m = ss(T.mover[0], T.mover[1], s);

        // titular: de B (grande, a media altura) a C (más pequeño, arriba)
        if (titular.current) {
          const sube = ancho ? vh * 0.1 : vh * 0.02;
          titular.current.style.transform = `translate3d(0,${-sube * m}px,0) scale(${1 - (ancho ? 0.4 : 0.22) * m})`;
        }
        const fuera = ss(T.textos[0], T.textos[1], s);
        for (const n of [cuerpo.current, tarjeta.current]) {
          if (!n) continue;
          n.style.opacity = String(1 - fuera);
          n.style.transform = `translate3d(0,${-40 * fuera}px,0)`;
          n.style.visibility = fuera > 0.999 ? "hidden" : "visible";
        }
        if (fondoB.current) fondoB.current.style.opacity = String(1 - ss(0, 0.45, s));
        if (fondoC.current) fondoC.current.style.opacity = String(ss(0.3, 0.75, s));
        if (pista.current) pista.current.style.opacity = String((1 - ss(0, 0.08, s)) * ss(0.6, 1, entrada.v));

        // etiquetas: siguen a cada capa en pantalla
        const c = ojoEstado.capas;
        const base = Math.max(c.esclera.y + c.esclera.r, c.iris.y + c.iris.r, c.cornea.y + c.cornea.r) + 28;
        etiquetas.current.forEach((li, i) => {
          if (!li) return;
          const capa = c[CAPAS[i].k];
          const a = ss(T.etiquetas + (3 - i) * 0.06, T.etiquetas + 0.14 + (3 - i) * 0.06, s);
          const linea = li.querySelector<HTMLElement>("[data-linea]");
          li.style.opacity = String(a);
          li.style.visibility = a > 0.001 ? "visible" : "hidden";
          if (ancho) {
            // escritorio: todas en una línea base bajo el despiece, con hilo vertical hasta la pieza
            const desde = capa.y + capa.r + 10;
            li.style.transform = `translate3d(${capa.x}px,${base}px,0)`;
            if (linea) {
              linea.style.height = `${Math.max(0, base - desde)}px`;
              linea.style.transform = `translate3d(0,${-(base - desde)}px,0) scaleY(${a})`;
            }
          } else {
            // móvil: a la derecha de cada pieza, con hilo horizontal
            const x = vw * 0.56;
            const desde = capa.x + capa.r + 8;
            li.style.transform = `translate3d(${x}px,${capa.y - 10}px,0)`;
            if (linea) {
              linea.style.width = `${Math.max(0, x - desde - 6)}px`;
              linea.style.transform = `translate3d(${-(x - desde)}px,0,0) scaleX(${a})`;
            }
          }
        });
        if (ctaFinal.current) {
          const a = ss(0.82, 0.96, s);
          ctaFinal.current.style.opacity = String(a);
          ctaFinal.current.style.visibility = a > 0.001 ? "visible" : "hidden";
        }
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
    <section
      ref={zona}
      aria-labelledby="hero-v2-titulo"
      className="relative h-[300svh] bg-[#f6f2ea] font-[family-name:var(--font-v2-sans)] text-[#02223b]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Fondo B: halo cálido detrás del ojo. Fondo C: cuadrícula de lámina. */}
        <div
          ref={fondoB}
          aria-hidden="true"
          className="absolute -right-[30vw] top-1/2 h-[120vmin] w-[120vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#e3ecdf_0%,#efeee4_45%,transparent_70%)] max-lg:bottom-[-30vmin] max-lg:top-auto max-lg:translate-y-0"
        />
        <div
          ref={fondoC}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 [background-image:linear-gradient(rgba(2,34,59,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(2,34,59,.06)_1px,transparent_1px)] [background-size:80px_80px]"
        />

        <Ojo className="absolute inset-0" pose={poseHero} activo={activo} />

        {/* Cabecera propia de la v2 */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-sm lg:px-14 lg:py-7">
          <Logo />
          <nav aria-label="Principal" className="hidden gap-9 text-[#02223b]/75 lg:flex">
            <a href="#senales" className={enlaceNav}>Señales</a>
            {ENLACES.map((e) => (
              <Link key={e.id} href={e.id === "servicios" ? "#servicios" : e.href} className={enlaceNav}>
                {e.t}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <BotonAgendar />
            <MenuMovil />
          </div>
        </div>

        {/* Texto B */}
        <div className="pointer-events-none absolute inset-x-5 top-[13svh] z-10 lg:inset-x-14 lg:top-[22svh]">
          <h1
            ref={titular}
            id="hero-v2-titulo"
            className="max-w-[12ch] origin-top-left font-[family-name:var(--font-v2-serif)] text-[clamp(3.4rem,1rem+7vw,7.4rem)] leading-[0.92] tracking-[-0.02em] will-change-transform"
          >
            Mirar juntos lo que <em className="text-[#0e4d7a]">tu hijo</em> ve.
          </h1>
          <div ref={cuerpo} className="pointer-events-auto mt-8 max-w-[30rem] will-change-transform lg:mt-14 lg:max-xl:max-w-[26rem]">
            <p className="text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
              Si se acerca mucho a la pantalla, se cansa al leer o algo en su mirada te inquieta, no tienes
              que adivinar. Lo valoramos con calma y te explico cada paso.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#02223b] px-6 py-3.5 text-sm font-medium text-white"
              >
                Escribir por WhatsApp
              </a>
              <a href="#senales" className="rounded-full border border-[#02223b]/20 px-6 py-3.5 text-sm font-medium max-lg:hidden">
                Revisar señales en casa
              </a>
            </div>
          </div>
        </div>

        <div
          ref={tarjeta}
          className="absolute bottom-[6svh] left-[42vw] z-10 hidden items-center gap-3.5 rounded-2xl bg-white py-2.5 pl-2.5 pr-5 text-[13px] leading-snug shadow-[0_20px_50px_-25px_rgba(2,34,59,.35)] lg:flex"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dra-yeimmy-barragan-sm.webp"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-xl object-cover object-[42%_30%]"
          />
          <span>
            <b className="block text-sm font-semibold">{SITE_CONFIG.profesional}</b>
            Optómetra · Ortóptica y terapia visual
          </span>
        </div>

        <p
          ref={pista}
          aria-hidden="true"
          className="absolute bottom-8 left-14 z-10 hidden text-[11px] font-medium uppercase tracking-[0.22em] text-[#5b7489] opacity-0 lg:block"
        >
          Desliza para verlo por dentro ↓
        </p>

        {/* Etiquetas C: se colocan desde el rAF siguiendo cada capa */}
        <ol aria-label="Partes del ojo" className="pointer-events-none absolute inset-0 z-10">
          {CAPAS.map((c, i) => (
            <li
              key={c.k}
              ref={(el) => {
                etiquetas.current[i] = el;
              }}
              className="invisible absolute left-0 top-0 w-[10rem] opacity-0 will-change-transform lg:w-[13rem]"
            >
              <span
                data-linea
                aria-hidden="true"
                className="absolute left-0 top-0 block origin-bottom bg-[#02223b]/35 max-lg:top-3 max-lg:h-px max-lg:origin-left lg:w-px"
              />
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em]">
                <span className="text-[#0e4d7a]">{c.n}</span> {c.t}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-[#4d6880] lg:text-sm">{c.d}</span>
            </li>
          ))}
        </ol>

        <div ref={ctaFinal} className="invisible absolute bottom-6 right-5 z-10 opacity-0 lg:bottom-10 lg:right-14">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#a8cf45] px-6 py-3.5 text-sm font-semibold text-[#02223b]"
          >
            Agendar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
