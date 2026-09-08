import { hasRealGtmId } from "@/lib/constants";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

/**
 * Estado por defecto de Google Consent Mode v2.
 *
 * DEBE ejecutarse ANTES de gtm.js: si el default llegara después del
 * contenedor, GTM ya habría escrito _ga y el "rechazar" sería decorativo.
 *
 * Por eso es un <script> inline crudo y no <Script beforeInteractive/>: con
 * `output: "export"` next/script difiere incluso beforeInteractive al runtime
 * de Next (self.__next_s), mientras que esto se ejecuta durante el parseo del
 * HTML, antes de cualquier bundle. Es el mismo patrón de los snippets
 * anti-parpadeo de tema.
 *
 * Todo denegado de entrada; si hay una aceptación previa en localStorage se
 * concede analytics_storage en el mismo tick, sin perder medición.
 * Aquí se define window.gtag (GTM no la crea) para que lib/consent.ts pueda
 * emitir el 'consent update' cuando la persona pulsa un botón del aviso.
 */
const SNIPPET = `(function(){
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent','default',{
'ad_storage':'denied',
'ad_user_data':'denied',
'ad_personalization':'denied',
'analytics_storage':'denied',
'personalization_storage':'denied'
});
try{
if(window.localStorage.getItem('${CONSENT_STORAGE_KEY}')==='granted'){
gtag('consent','update',{'analytics_storage':'granted'});
}
}catch(e){}
})();`;

export default function ConsentMode() {
  if (!hasRealGtmId()) return null;

  return <script dangerouslySetInnerHTML={{ __html: SNIPPET }} />;
}
