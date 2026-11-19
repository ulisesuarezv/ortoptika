"use client";

/**
 * Señales en casa: la mamá marca lo que reconoce y el botón arma un mensaje de
 * WhatsApp con esas señales. No es un diagnóstico; es la forma de empezar la
 * conversación. Las frases salen de las listas ya escritas para las landings
 * (services-content.ts), mezcladas para no centrarse en estrabismo.
 */
import { useState } from "react";
import { whatsappLink } from "@/lib/constants";
import Aparece from "./Aparece";

// BORRADOR: validar con la doctora.
const SENALES = [
  "Se acerca mucho a los libros, cuadernos o pantallas",
  "Entrecierra los ojos o tuerce la cabeza para mirar",
  "Pierde el renglón o usa el dedo para no perderse al leer",
  "Le duele la cabeza o se le cansan los ojos después del colegio o de las pantallas",
  "Dice que ve doble o que las letras «se mueven»",
  "Cierra o se tapa un ojo para leer o ver televisión",
  "Tropieza o calcula mal las distancias, como al atrapar una pelota",
  "Un ojo se desvía, aunque sea a ratos o solo en las fotos",
];

function mensaje(marcadas: string[]) {
  if (!marcadas.length) return undefined;
  return `Hola, Yeimmy. Vi la página y en casa he notado:\n${marcadas
    .map((s) => `• ${s}`)
    .join("\n")}\n¿Podemos agendar una valoración?`;
}

export default function Senales() {
  const [marcadas, setMarcadas] = useState<number[]>([]);
  const lista = marcadas.map((i) => SENALES[i]);
  const n = marcadas.length;

  return (
    <section id="senales" aria-labelledby="senales-titulo" className="relative bg-[#f6f2ea] px-5 py-24 text-[#02223b] lg:px-14 lg:py-40">
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Aparece as="p" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0e4d7a]">
              Señales en casa
            </Aparece>
            <Aparece retraso={80}>
              <h2 id="senales-titulo" className="mt-5 max-w-[11ch] font-[family-name:var(--font-v2-serif)] text-[clamp(2.8rem,1rem+4.6vw,5.6rem)] leading-[0.95] tracking-[-0.02em]">
                ¿Qué has notado <em className="text-[#0e4d7a]">en casa</em>?
              </h2>
            </Aparece>
            <Aparece as="p" retraso={160} className="mt-7 max-w-[34ch] text-[15px] leading-relaxed text-[#33506a] lg:text-lg">
              Marca lo que reconozcas. No es un diagnóstico: es una forma de empezar la conversación, y me
              llega tal cual por WhatsApp.
            </Aparece>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="border-t border-[#02223b]/15">
            {SENALES.map((s, i) => {
              const on = marcadas.includes(i);
              return (
                <Aparece as="li" key={s} retraso={i * 50} className="border-b border-[#02223b]/15">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => setMarcadas((m) => (on ? m.filter((x) => x !== i) : [...m, i]))}
                    className="group flex w-full items-center gap-5 py-5 text-left transition-colors lg:gap-7 lg:py-7"
                  >
                    <span
                      aria-hidden="true"
                      className={`relative flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-all duration-300 lg:h-10 lg:w-10 ${
                        on ? "border-[#a8cf45] bg-[#a8cf45]" : "border-[#02223b]/25 group-hover:border-[#02223b]/60"
                      }`}
                    >
                      <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-all duration-300 lg:h-4 lg:w-4 ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
                        <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="#02223b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span
                      className={`text-[17px] leading-snug transition-colors duration-300 lg:text-[26px] lg:leading-tight lg:tracking-[-0.01em] ${
                        on ? "text-[#02223b]" : "text-[#02223b]/70 group-hover:text-[#02223b]"
                      }`}
                    >
                      {s}
                    </span>
                  </button>
                </Aparece>
              );
            })}
          </ul>

          <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#02223b] p-4 pl-6 text-white shadow-[0_24px_60px_-30px_rgba(2,34,59,.6)] lg:p-5 lg:pl-8">
            <p className="text-sm text-white/75 lg:text-base" aria-live="polite">
              {n === 0
                ? "Aún no has marcado nada."
                : n === 1
                  ? "1 señal marcada."
                  : `${n} señales marcadas.`}
            </p>
            <a
              href={whatsappLink(mensaje(lista))}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#a8cf45] px-6 py-3.5 text-sm font-semibold text-[#02223b] transition-transform hover:-translate-y-0.5"
            >
              {n === 0 ? "Escribir por WhatsApp" : "Contárselo a Yeimmy por WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
