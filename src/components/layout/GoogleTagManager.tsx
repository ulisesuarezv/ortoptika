import Script from "next/script";
import { hasRealGtmId, SITE_CONFIG } from "@/lib/constants";

/**
 * Integración de Google Tag Manager, lista pero INACTIVA:
 * mientras SITE_CONFIG.gtmId siga siendo el placeholder "GTM-XXXXXXX" no se
 * inyecta nada (cero peso en el HTML). Al crear el contenedor real, basta con
 * sustituir el ID en constants.ts.
 *
 * <GtmScript/> va en el <body> del layout (next/script afterInteractive: no
 * bloquea el LCP, importante para Lighthouse); <GtmNoScript/> es el fallback
 * estándar para navegadores sin JS.
 */
export function GtmScript() {
  if (!hasRealGtmId()) return null;
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${SITE_CONFIG.gtmId}');`}
    </Script>
  );
}

export function GtmNoScript() {
  if (!hasRealGtmId()) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${SITE_CONFIG.gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
