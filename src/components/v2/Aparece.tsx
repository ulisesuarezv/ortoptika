"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Entrada al hacer scroll: sube y aparece una sola vez cuando entra en pantalla.
 * Solo CSS (transform + opacity); con reduced-motion aparece sin animación.
 */
export default function Aparece({
  children,
  className = "",
  retraso = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  retraso?: number; // ms
  as?: "div" | "li" | "p" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.on = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${retraso}ms` }}
      className={`translate-y-8 opacity-0 transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] data-[on]:translate-y-0 data-[on]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
    >
      {children}
    </Tag>
  );
}
