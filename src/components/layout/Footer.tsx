import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE_CONFIG, whatsappLink } from "@/lib/constants";
import Backdrop from "@/components/ui/Backdrop";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import MagneticLink from "@/components/ui/MagneticLink";

/**
 * Footer: continuación editorial del flujo (banda CTA display + datos).
 * Sigue siendo Server Component: el motion vive en los client leaves
 * <Reveal>/<Parallax>/<MagneticLink>.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-cursor-theme="dark"
      className="relative overflow-hidden bg-slate-ink-900 text-slate-ink-200"
    >
      {/* Capa de fondo: ondas ópticas en tono oscuro, muy sutiles */}
      <Parallax className="absolute inset-0 z-0" amount={8}>
        <Backdrop variant="waves" tone="dark" />
      </Parallax>
      {/* Banda CTA: cierre cálido a escala extrema, continuación del flujo */}
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 lg:pt-28">
        <Reveal className="border-b border-slate-ink-800 pb-16">
          <h2 className="max-w-[14ch] text-5xl leading-[0.95] text-white sm:text-7xl lg:text-8xl">
            ¿Hablamos de la visión de{" "}
            <em className="accent-word text-accent-300">tu familia</em>?
          </h2>
          {/* El offset estático (lg:-translate-y-4 lg:translate-x-4) vive en
              este wrapper, NO en el <a> magnético: useMagnetic fija el x/y
              vía GSAP sobre el nodo que anima, y eso pisaría permanentemente
              cualquier translate-* de Tailwind puesto en ese mismo nodo (ver
              memoria del proyecto — mismo gotcha de ServicesGrid/TrustBar). */}
          <span className="mt-10 inline-block lg:-translate-y-4 lg:translate-x-4">
            <MagneticLink
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-500 px-8 py-4 font-heading text-lg font-semibold text-slate-ink-900 transition-colors hover:bg-accent-400"
            >
              Escribir por WhatsApp
            </MagneticLink>
          </span>
        </Reveal>
      </div>

      <Reveal
        stagger
        className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3"
      >
        <div>
          {/* Logo completo sobre tarjeta clara: el line-art azul del original
              sería ilegible directamente sobre navy. */}
          <div className="inline-block rounded-2xl bg-cream px-5 py-4">
            <Image
              src="/images/brand/logo-ortoptika-full-sm.webp"
              alt="Ortoptika — Optometría especializada en terapia visual, Dra. Yeimmy Barragan"
              width={320}
              height={217}
              className="h-auto w-40"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-ink-300">
            {SITE_CONFIG.profesional}
            <br />
            {SITE_CONFIG.titulo}
          </p>
        </div>

        <nav aria-label="Navegación del pie de página">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-ink-400">
            Navegación
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block py-2.5 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-ink-400">
            Contacto
          </p>
          <address className="mt-3 space-y-2 text-sm not-italic leading-relaxed text-slate-ink-300">
            <p>{SITE_CONFIG.direccion.completa}</p>
            <p>
              <a
                href={SITE_CONFIG.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-2.5 transition-colors hover:text-white"
              >
                WhatsApp: {SITE_CONFIG.telefono}
              </a>
            </p>
            <p>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-2.5 transition-colors hover:text-white"
              >
                Instagram {SITE_CONFIG.social.instagramHandle}
              </a>
            </p>
            {/* Condicional: si algún día se retira la página, basta con poner
                social.facebook en null y desaparece de aquí y del sameAs. */}
            {SITE_CONFIG.social.facebook ? (
              <p>
                <a
                  href={SITE_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2.5 transition-colors hover:text-white"
                >
                  Facebook {SITE_CONFIG.social.facebookHandle}
                </a>
              </p>
            ) : null}
          </address>
        </div>
      </Reveal>

      <div className="relative flex flex-col items-center gap-2 border-t border-slate-ink-800 px-5 pb-24 pt-6 text-center text-xs text-slate-ink-400 sm:flex-row sm:justify-between sm:px-8 sm:pb-6 sm:pr-48 sm:text-left">
        <p>© {year} {SITE_CONFIG.name}. Todos los derechos reservados.</p>
        <Link
          href="/privacidad/"
          className="inline-block py-2 transition-colors hover:text-white"
        >
          Política de tratamiento de datos y cookies
        </Link>
      </div>
    </footer>
  );
}
