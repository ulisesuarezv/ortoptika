"use client";

import { useId, useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
  /** Permite tener varias respuestas abiertas a la vez (por defecto, solo una). */
  allowMultiple?: boolean;
};

/**
 * Acordeón de preguntas frecuentes, accesible y sin dependencias externas.
 * - Cada disparador es un <button> nativo → foco y teclado (Enter/Espacio) gratis.
 * - `aria-expanded` + `aria-controls` enlazan botón y panel.
 * - El panel usa `hidden` para no ser leído por lectores de pantalla cuando cierra.
 *
 * El schema FAQPage (JSON-LD) se añade en las sesiones 4-5, no aquí.
 */
export default function FAQAccordion({
  items,
  allowMultiple = false,
}: FAQAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;

        return (
          <div key={i} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="group flex w-full items-center justify-between gap-5 py-5 text-left font-display text-lg font-medium text-slate-ink-900 transition-colors hover:text-primary-700"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`relative mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-primary-700 transition-colors group-hover:border-primary-300 group-hover:bg-primary-50 ${
                    isOpen ? "bg-primary-50" : ""
                  }`}
                >
                  <span className="h-0.5 w-3.5 rounded-full bg-current" />
                  <span
                    className={`absolute h-0.5 w-3.5 rounded-full bg-current transition-transform duration-200 ${
                      isOpen ? "rotate-0" : "rotate-90"
                    }`}
                  />
                </span>
              </button>
            </h3>
            {/* Apertura animada con grid-template-rows (0fr→1fr). `inert`
                sustituye a `hidden`: mismo efecto para lectores/tab-order,
                pero permite la transición. Reduced-motion la anula (global). */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`max-w-[62ch] pb-6 leading-relaxed text-slate-ink-700 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
