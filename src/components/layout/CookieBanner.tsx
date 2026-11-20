"use client";

import Link from "next/link";
import { writeConsent } from "@/lib/consent";
import { hasRealGtmId } from "@/lib/constants";
import { useConsent } from "@/hooks/useConsent";

/**
 * Aviso de cookies. NO bloquea la navegación (Colombia no lo exige) pero sí
 * decide de verdad: hasta que se pulse "Aceptar", Consent Mode mantiene
 * analytics_storage en 'denied' y GTM no mide.
 *
 * Piel de la v2: tarjeta navy abajo a la izquierda (en móvil, a todo el ancho).
 */
export default function CookieBanner() {
  const consent = useConsent();

  // Sin contenedor real de GTM no hay cookies que consentir.
  // `undefined` = aún sin hidratar; `null` = pendiente de decidir → se muestra.
  if (!hasRealGtmId() || consent !== null) return null;

  return (
    <aside
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 z-50 rounded-[1.5rem] bg-[#02223b] p-6 text-white shadow-[0_30px_80px_-30px_rgba(2,34,59,.6)] font-[family-name:var(--font-v2-sans)] sm:bottom-5 sm:right-auto sm:max-w-md lg:left-14"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">
        Cookies en este sitio
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[#b9c9d6]">
        Uso cookies de analítica para saber qué contenidos resultan útiles y
        mejorar el sitio. No son necesarias para navegar y puedes rechazarlas.
        Consulta la{" "}
        <Link
          href="/privacidad/"
          className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
        >
          política de tratamiento de datos
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className="rounded-full bg-[#a8cf45] px-5 py-2.5 text-sm font-semibold text-[#02223b] transition-colors hover:bg-[#bad962] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8cf45]"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8cf45]"
        >
          Rechazar
        </button>
      </div>
    </aside>
  );
}
