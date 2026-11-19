"use client";

/**
 * Índice lateral fijo de la landing: marca la sección que se está leyendo.
 * La barra lima crece con el avance de lectura de todo el cuerpo.
 */
import { useEffect, useRef, useState } from "react";

export default function Indice({ secciones }: { secciones: { id: string; t: string }[] }) {
  const [actual, setActual] = useState(secciones[0]?.id);
  const barra = useRef<HTMLSpanElement>(null);
  const previa = useRef(actual);

  useEffect(() => {
    const els = secciones.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const tick = () => {
      const linea = window.innerHeight * 0.35;
      let id = els[0]?.id;
      for (const el of els) if (el.getBoundingClientRect().top <= linea) id = el.id;
      if (id !== previa.current) {
        previa.current = id;
        setActual(id);
      }
      const primero = els[0], ultimo = els[els.length - 1];
      if (primero && ultimo && barra.current) {
        const a = primero.getBoundingClientRect().top - linea;
        const b = ultimo.getBoundingClientRect().bottom - linea;
        barra.current.style.transform = `scaleY(${Math.min(1, Math.max(0, -a / (b - a)))})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [secciones]);

  return (
    <nav aria-label="En esta página" className="relative pl-6">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-[#02223b]/12">
        <span ref={barra} className="absolute inset-0 origin-top scale-y-0 bg-[#a8cf45]" />
      </span>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e4d7a]">En esta página</p>
      <ol className="mt-6 space-y-3.5">
        {secciones.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={actual === s.id ? "true" : undefined}
              className="group flex gap-3 text-[15px] text-[#4d6880] transition-colors hover:text-[#02223b] aria-[current]:text-[#02223b]"
            >
              <span className="w-5 text-xs leading-[1.6rem] text-[#0e4d7a]/60 group-aria-[current]:text-[#0e4d7a]">0{i + 1}</span>
              <span className="leading-snug transition-transform duration-300 group-aria-[current]:translate-x-1 group-aria-[current]:font-medium">{s.t}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
