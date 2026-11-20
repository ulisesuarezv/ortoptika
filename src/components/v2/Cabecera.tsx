/**
 * Cabecera de las páginas interiores de la v2 (landings, sobre mí, contacto…).
 * La home tiene la suya dentro de HeroV2 (va sobre el ojo, con anclas propias).
 */
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";
import { rutaV2 } from "./rutas";

export default function Cabecera({
  mensaje,
  actual,
}: {
  mensaje?: string; // mensaje precargado de WhatsApp
  actual?: "servicios" | "sobre-mi" | "contacto";
}) {
  const enlaces = [
    ["servicios", `${rutaV2("/")}#servicios`, "Servicios"],
    ["sobre-mi", rutaV2("/sobre-mi/"), "Yeimmy"],
    ["contacto", rutaV2("/contacto/"), "Consultorio"],
  ] as const;
  return (
    <nav className="relative z-20 flex items-center justify-between px-5 py-5 text-sm text-[#02223b] lg:px-14 lg:py-7">
      <Link href={rutaV2("/")} className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.14em]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/logo-mark-eye-brain-sm.webp" alt="" width={48} height={26} className="h-[26px] w-auto" />
        ORTOPTIKA
      </Link>
      <div className="hidden gap-9 text-[#02223b]/75 lg:flex">
        {enlaces.map(([id, href, t]) => (
          <Link
            key={id}
            href={href}
            aria-current={actual === id ? "page" : undefined}
            className="transition-colors hover:text-[#02223b] aria-[current]:text-[#02223b] aria-[current]:underline aria-[current]:decoration-[#a8cf45] aria-[current]:decoration-2 aria-[current]:underline-offset-8"
          >
            {t}
          </Link>
        ))}
      </div>
      <a
        href={whatsappLink(mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 rounded-full bg-[#02223b] px-4 py-2.5 font-medium text-white lg:px-5 lg:py-3"
      >
        <span className="h-2 w-2 rounded-full bg-[#a8cf45]" />
        <span>
          Agendar<span className="max-lg:hidden">&nbsp;cita</span>
        </span>
      </a>
    </nav>
  );
}
