"use client";

/**
 * Panel de cookies con la piel de la v2. Misma lógica que
 * components/layout/ConsentPreferences (consultar y CAMBIAR la decisión: el
 * derecho a revocar de la Ley 1581, art. 8); solo cambia el aspecto.
 */
import { writeConsent } from "@/lib/consent";
import { hasRealGtmId } from "@/lib/constants";
import { useConsent } from "@/hooks/useConsent";

export default function PreferenciasCookies() {
  const consent = useConsent();
  if (!hasRealGtmId()) return null;

  const estado =
    consent === undefined
      ? "Consultando tu preferencia…"
      : consent === null
        ? "Todavía no has decidido. Mientras tanto, la analítica está desactivada."
        : consent === "granted"
          ? "Aceptaste las cookies de analítica."
          : "Rechazaste las cookies de analítica.";

  const boton =
    "rounded-full px-5 py-3 text-sm font-semibold transition-[background-color,opacity] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8cf45]";

  return (
    <div className="rounded-[2rem] bg-[#02223b] p-7 text-white lg:p-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">Tu decisión sobre las cookies</p>
      <p aria-live="polite" className="mt-4 text-lg leading-snug text-white lg:text-xl">
        {estado}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => writeConsent("granted")} disabled={consent === "granted"} className={`${boton} bg-[#a8cf45] text-[#02223b]`}>
          Aceptar cookies de analítica
        </button>
        <button type="button" onClick={() => writeConsent("denied")} disabled={consent === "denied"} className={`${boton} border border-white/30 text-white hover:bg-white/10`}>
          Rechazar / revocar
        </button>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-[#b9c9d6]">
        Al revocar, el sitio deja de escribir cookies de medición. Las que ya estuvieran en tu navegador puedes
        borrarlas desde sus ajustes de privacidad, junto con las de cualquier otro sitio.
      </p>
    </div>
  );
}
