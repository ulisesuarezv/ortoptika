"use client";

/**
 * Menú de móvil: botón «Menú» + panel navy a pantalla completa.
 * Va en un <dialog> modal: el navegador se encarga del foco, de Escape y de
 * dejar inerte el resto de la página. Solo se ve por debajo de lg.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SERVICES, SITE_CONFIG, whatsappLink } from "@/lib/constants";
import { rutaV2, servicioV2 } from "./rutas";

export default function MenuMovil({ claro = false }: { claro?: boolean }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
    // Sin scroll de fondo mientras está abierto.
    document.documentElement.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [abierto]);

  const cerrar = () => setAbierto(false);
  const enlace = "block py-2 text-white transition-colors hover:text-[#a8cf45]";

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${claro ? "border-white/30 text-white" : "border-[#02223b]/20 text-[#02223b]"}`}
      >
        <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
          <span className="h-[1.5px] w-full bg-current" />
          <span className="h-[1.5px] w-full bg-current" />
        </span>
        <span className="sr-only">Menú</span>
      </button>

      <dialog
        ref={dialogo}
        onClose={cerrar}
        aria-label="Menú"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-[#02223b] p-0 text-white backdrop:bg-transparent open:flex open:flex-col font-[family-name:var(--font-v2-sans)]"
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href={rutaV2("/")} onClick={cerrar} className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.14em]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/logo-mark-eye-brain-sm.webp" alt="" width={48} height={26} className="h-[26px] w-auto brightness-0 invert" />
            ORTOPTIKA
          </Link>
          <button type="button" onClick={cerrar} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-4 text-sm font-medium">
            <span aria-hidden="true" className="relative h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-current" />
            </span>
            Cerrar
          </button>
        </div>

        <nav aria-label="Principal" className="flex-1 overflow-y-auto px-5 pb-8 pt-6">
          <ul className="font-[family-name:var(--font-v2-serif)] text-[2.6rem] leading-[1.05] tracking-[-0.02em]">
            <li><Link href={rutaV2("/")} onClick={cerrar} className={enlace}>Inicio</Link></li>
            <li><Link href={rutaV2("/sobre-mi/")} onClick={cerrar} className={enlace}>Sobre <em>mí</em></Link></li>
            <li><Link href={rutaV2("/contacto/")} onClick={cerrar} className={enlace}>Contacto</Link></li>
          </ul>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8cf45]">Servicios</p>
          <ul className="mt-3 border-t border-white/15">
            {SERVICES.map((s) => (
              <li key={s.slug} className="border-b border-white/15">
                <Link href={servicioV2(s.slug)} onClick={cerrar} className="flex items-center justify-between py-4 text-lg text-white">
                  {s.titulo}
                  <span aria-hidden="true" className="text-[#a8cf45]">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/15 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center rounded-full bg-[#a8cf45] px-6 py-4 text-base font-semibold text-[#02223b]">
            Agendar por WhatsApp
          </a>
          <p className="mt-4 text-center text-xs text-[#b9c9d6]">
            {SITE_CONFIG.direccion.clinica} · {SITE_CONFIG.horarios.dias}
          </p>
        </div>
      </dialog>
    </>
  );
}
