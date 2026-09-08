"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, type ConsentChoice } from "@/lib/consent";

/**
 * Estado del consentimiento de cookies, leído de localStorage.
 *
 * `undefined` = todavía no se sabe (render de servidor / hidratación: en el
 * HTML estático no existe localStorage). `null` = la persona aún no ha
 * decidido. Distinguir ambos importa: sin ese matiz el HTML exportado tendría
 * que asumir "sin decidir" y el aviso parpadearía en cada visita, también para
 * quien ya aceptó.
 *
 * Se resuelve con useSyncExternalStore y no con useState+useEffect porque
 * localStorage es exactamente eso: un store externo. React re-renderiza solo
 * al terminar la hidratación y cada vez que cambia la preferencia.
 */
export function useConsent(): ConsentChoice | null | undefined {
  const subscribe = useCallback((onStoreChange: () => void) => {
    // CONSENT_EVENT cubre el cambio hecho en esta pestaña; "storage" cubre el
    // hecho en otra (ese evento no se dispara en la pestaña que escribe).
    window.addEventListener(CONSENT_EVENT, onStoreChange);
    window.addEventListener("storage", onStoreChange);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onStoreChange);
      window.removeEventListener("storage", onStoreChange);
    };
  }, []);

  return useSyncExternalStore(subscribe, readConsent, () => undefined);
}
