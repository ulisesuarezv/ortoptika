"use client";

import { writeConsent, type ConsentChoice } from "@/lib/consent";
import { hasRealGtmId } from "@/lib/constants";
import { useConsent } from "@/hooks/useConsent";

const LABELS: Record<ConsentChoice, string> = {
  granted: "Aceptaste las cookies de analítica.",
  denied: "Rechazaste las cookies de analítica.",
};

/**
 * Panel de /privacidad para consultar y CAMBIAR la decisión sobre cookies.
 * Materializa el derecho a revocar la autorización (Ley 1581 de 2012, art. 8),
 * que un aviso de "aceptar" sin retorno dejaría en el papel.
 */
export default function ConsentPreferences() {
  const consent = useConsent();

  if (!hasRealGtmId()) return null;

  return (
    <div className="rounded-2xl border border-slate-ink-200 bg-surface p-6">
      <p className="font-heading text-lg font-semibold text-slate-ink-900">
        Tu decisión sobre las cookies
      </p>
      <p
        aria-live="polite"
        className="mt-2 text-sm leading-relaxed text-slate-ink-700"
      >
        {consent === undefined
          ? "Consultando tu preferencia…"
          : consent === null
            ? "Todavía no has decidido. Mientras tanto, la analítica está desactivada."
            : LABELS[consent]}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          disabled={consent === "granted"}
          className="rounded-full bg-accent-500 px-5 py-2.5 font-heading text-sm font-semibold text-slate-ink-900 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Aceptar cookies de analítica
        </button>
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          disabled={consent === "denied"}
          className="rounded-full px-5 py-2.5 font-heading text-sm font-semibold text-primary-800 ring-1 ring-inset ring-slate-ink-200 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Rechazar / revocar
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-ink-500">
        Al revocar, el sitio deja de escribir cookies de medición. Las que ya
        estuvieran en tu navegador puedes borrarlas desde sus ajustes de
        privacidad, junto con las de cualquier otro sitio.
      </p>
    </div>
  );
}
