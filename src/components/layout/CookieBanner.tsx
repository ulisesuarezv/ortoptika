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
 * Se ancla abajo a la IZQUIERDA y, en móvil, por encima del FAB de WhatsApp
 * (bottom-24) para no taparlo: los dos son fixed y el CTA de contacto manda.
 */
export default function CookieBanner() {
  const consent = useConsent();

  // Sin contenedor real de GTM no hay cookies que consentir.
  // `undefined` = aún sin hidratar; `null` = pendiente de decidir → se muestra.
  if (!hasRealGtmId() || consent !== null) return null;

  return (
    <aside
      aria-label="Aviso de cookies"
      className="fixed bottom-24 left-4 right-4 z-50 rounded-2xl border border-slate-ink-200 bg-surface p-5 shadow-card sm:bottom-5 sm:right-auto sm:max-w-md lg:left-14"
    >
      <p className="font-heading text-base font-semibold text-slate-ink-900">
        Cookies en este sitio
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-ink-700">
        Uso cookies de analítica para saber qué contenidos resultan útiles y
        mejorar el sitio. No son necesarias para navegar y puedes rechazarlas.
        Consulta la{" "}
        <Link
          href="/privacidad/"
          className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
        >
          política de tratamiento de datos
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className="rounded-full bg-accent-500 px-5 py-2.5 font-heading text-sm font-semibold text-slate-ink-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          className="rounded-full px-5 py-2.5 font-heading text-sm font-semibold text-primary-800 ring-1 ring-inset ring-slate-ink-200 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Rechazar
        </button>
      </div>
    </aside>
  );
}
