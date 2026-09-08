/**
 * Consentimiento de cookies (Consent Mode v2 de Google).
 *
 * Marco legal aplicable: Ley 1581 de 2012 y Decreto 1377 de 2013 (Colombia).
 * La SIC considera las cookies analíticas tratamiento de datos personales, así
 * que el sitio arranca con `analytics_storage: 'denied'` y solo lo concede si
 * la persona acepta. El aviso NO bloquea la navegación (Colombia no exige el
 * consentimiento previo bloqueante del RGPD), pero "Rechazar" sí es real: sin
 * aceptación, GTM no escribe cookies de medición.
 *
 * La preferencia vive en localStorage (NO en cookie): así la propia decisión de
 * rechazar no obliga a escribir una cookie, y no viaja en cada request.
 */

/** Clave de localStorage. Lleva versión: subirla vuelve a pedir el consentimiento. */
export const CONSENT_STORAGE_KEY = "ortoptika.consent.v1";

export type ConsentChoice = "granted" | "denied";

/** Evento interno para que el banner y la página de privacidad se sincronicen. */
export const CONSENT_EVENT = "ortoptika:consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    // Definida por el snippet inline de <ConsentMode/> (beforeInteractive), de
    // modo que exista antes de que cargue gtm.js.
    gtag?: (...args: unknown[]) => void;
  }
}

/** Lee la decisión guardada. `null` = aún no ha decidido (mostrar aviso). */
export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Safari en modo privado / almacenamiento bloqueado: se trata como
    // "sin decisión", que es el estado más conservador (analítica denegada).
    return null;
  }
}

/**
 * Guarda la decisión, la comunica a Google Consent Mode y avisa a la UI.
 * Al revocar (`denied`) no se puede borrar la cookie _ga desde aquí (es de
 * dominio propio pero la escribe GTM); lo que sí se garantiza es que deje de
 * escribirse a partir de la siguiente carga.
 */
export function writeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Sin persistencia se vuelve a preguntar en la próxima visita: aceptable.
  }

  window.gtag?.("consent", "update", {
    analytics_storage: choice === "granted" ? "granted" : "denied",
  });

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}
