/**
 * Coordinación entre escenas 3D de una misma página: solo una dibuja a la vez.
 * Una sección que toma la pantalla emite ESCENA_PROTAGONISTA (detail: boolean) y
 * las demás escenas visibles se pausan mientras dura.
 */
export const ESCENA_PROTAGONISTA = "ortoptika:escena-protagonista";
