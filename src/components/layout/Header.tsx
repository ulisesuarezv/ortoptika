"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS, whatsappLink } from "@/lib/constants";
import Button from "@/components/ui/Button";

/**
 * ¿Está activo el link para la ruta actual? Compara por primer segmento
 * ("Servicios" apunta a /servicios/terapia-visual pero cubre /servicios/*).
 * Con trailingSlash, pathname llega como "/sobre-mi/".
 */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const section = `/${href.split("/")[1]}`;
  return pathname.startsWith(section);
}

/**
 * Header con navegación responsive y comportamiento scroll-aware.
 * Lenguaje: barra FLOTANTE tipo píldora — limpia y transparente en el tope,
 * que al scrollear se despega de los bordes ganando superficie cream, blur,
 * sombra `lift` y un hairline. El LOGO se mantiene (solo se compacta por
 * transform). CLAVE de rendimiento: la ALTURA total del header NO cambia entre
 * estados (los huecos vertical/horizontal son constantes; solo cambian
 * background/shadow/ring/radius/transform/color) → sin CLS. Todo el movimiento
 * queda anulado por el bloque global de prefers-reduced-motion.
 * Cliente por el estado del menú; cierra al navegar (onClick) o con Escape.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  // Cierra con Escape y bloquea el scroll del body cuando está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scroll-aware: listener pasivo; setState con el mismo boolean no re-renderiza.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El menú móvil abierto fuerza el estado "flotante" (superficie sólida para
  // que el panel cuelgue de una barra con cuerpo, no del aire).
  const raised = scrolled || open;

  return (
    <header className="sticky top-0 z-40">
      {/* Gutter CONSTANTE (vertical y horizontal): reserva el hueco para que la
          píldora pueda despegarse de los bordes sin alterar la altura → sin CLS. */}
      <div className="mx-auto max-w-6xl px-3 pb-2 pt-2 sm:px-5 sm:pb-3 sm:pt-3">
        <div
          className={`relative flex items-center justify-between rounded-2xl px-4 py-2.5 transition-[background-color,box-shadow,border-radius] duration-300 ease-out sm:px-6 sm:py-3 ${
            raised
              ? "bg-cream/85 shadow-lift ring-1 ring-line backdrop-blur-md"
              : "bg-transparent ring-1 ring-transparent"
          }`}
        >
          {/* Lockup horizontal del logo: icono ojo+cerebro + wordmark real
              (recortados de public/images/brand/, regenerables con sharp).
              Se compacta por transform al scrollear (la caja no cambia → sin CLS). */}
          <Link
            href="/"
            className={`flex shrink-0 origin-left items-center gap-2.5 transition-transform duration-300 ${
              scrolled ? "scale-95" : ""
            }`}
            aria-label="Ortoptika — inicio"
          >
            <Image
              src="/images/brand/logo-mark-eye-brain-sm.webp"
              alt=""
              width={160}
              height={87}
              className="h-8 w-auto sm:h-9"
            />
            <Image
              src="/images/brand/logo-wordmark.webp"
              alt="Ortoptika"
              width={560}
              height={92}
              className="h-[1.05rem] w-auto sm:h-5"
            />
          </Link>

          {/* Nav desktop: links en caja UI con tracking editorial; subrayado lima
              que crece desde la izquierda + micro-lift al hover. La página activa
              lo lleva fijo + aria-current + color de marca. */}
          <nav aria-label="Navegación principal" className="hidden sm:block">
            <ul className="flex items-center gap-1 font-heading text-[0.8125rem] font-medium tracking-wide text-slate-ink-700">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-block rounded-lg px-3 py-2 transition-[color,transform] duration-200 ease-out after:absolute after:inset-x-3 after:bottom-1 after:h-[2px] after:origin-left after:rounded-full after:bg-accent-500 after:transition-transform after:duration-300 after:ease-out ${
                        active
                          ? "font-semibold text-primary-700 after:scale-x-100"
                          : "after:scale-x-0 hover:-translate-y-px hover:text-primary-700 hover:after:scale-x-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA de marca: píldora navy con iris lima cuya pupila "parpadea"
              (scale-y) al hover — eco del logo ojo. Lima solo como forma; texto
              crema sobre navy (AA). El label se desliza un pelo al hover. */}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-2.5 rounded-full bg-slate-ink-900 py-2.5 pl-3.5 pr-5 font-heading text-sm font-semibold text-cream shadow-soft ring-1 ring-inset ring-white/5 transition-[translate,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-card active:translate-y-0 sm:inline-flex"
          >
            <span
              aria-hidden="true"
              className="grid h-5 w-5 place-items-center rounded-full bg-accent-500 transition-transform duration-300 ease-out group-hover:scale-105"
            >
              <span className="h-2 w-2 rounded-full bg-slate-ink-900 transition-transform duration-200 ease-out group-hover:scale-y-[0.18]" />
            </span>
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">
              Agendar cita
            </span>
          </a>

          {/* Disparador móvil */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-ink-800 transition-colors hover:bg-slate-ink-100 sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          {/* Panel móvil: tarjeta redondeada que cuelga de la barra (no empuja el
              layout), coherente con la píldora. Transición opacidad+translate y
              cascada sutil en los links. `inert` lo saca del tab-order y de los
              lectores cuando está cerrado. */}
          <div
            id="mobile-menu"
            inert={!open}
            className={`absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-2xl border border-line bg-cream shadow-lift transition-[opacity,translate,visibility] duration-300 ease-out sm:hidden ${
              open
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0"
            }`}
          >
            <nav aria-label="Navegación principal (móvil)" className="px-3 py-3">
              <ul className="flex flex-col gap-1 text-base font-medium text-slate-ink-800">
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li
                      key={link.href}
                      className={`transition-[opacity,translate] duration-300 ease-out ${
                        open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      }`}
                      style={{ transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
                    >
                      <Link
                        href={link.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-xl px-3 py-2.5 transition-colors ${
                          active
                            ? "border-l-2 border-accent-500 bg-primary-50 font-semibold text-primary-700"
                            : "hover:bg-primary-50 hover:text-primary-700"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div
                className={`mt-3 transition-[opacity,translate] duration-300 ease-out ${
                  open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: open ? "240ms" : "0ms" }}
              >
                <Button
                  href={whatsappLink()}
                  external
                  variant="primary"
                  className="w-full"
                >
                  Agendar cita por WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
