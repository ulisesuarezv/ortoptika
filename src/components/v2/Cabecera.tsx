/**
 * Cabecera de las páginas interiores de la v2 (landings, sobre mí, contacto…),
 * en el flujo de la página. La home tiene la suya dentro de HeroV2 (va sobre el
 * ojo). Al bajar, la reemplaza la CabeceraFlotante global (layout raíz).
 */
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";
import MenuMovil from "./MenuMovil";
import { ENLACES, rutaV2, type EnlaceId } from "./rutas";

export const enlaceNav =
  "transition-colors hover:text-[#02223b] aria-[current]:text-[#02223b] aria-[current]:underline aria-[current]:decoration-[#a8cf45] aria-[current]:decoration-2 aria-[current]:underline-offset-8";

export function Logo() {
  return (
    <Link href={rutaV2("/")} className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.14em] text-[#02223b]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/brand/logo-mark-eye-brain-sm.webp" alt="" width={48} height={26} className="h-[26px] w-auto" />
      ORTOPTIKA
    </Link>
  );
}

export function BotonAgendar({ mensaje }: { mensaje?: string }) {
  return (
    <a
      href={whatsappLink(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center gap-2.5 rounded-full bg-[#02223b] px-4 font-medium text-white lg:h-auto lg:px-5 lg:py-3"
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#a8cf45]" />
      <span>
        Agendar<span className="max-lg:hidden">&nbsp;cita</span>
      </span>
    </a>
  );
}

export default function Cabecera({ mensaje, actual }: { mensaje?: string; actual?: EnlaceId }) {
  return (
    <div className="relative z-20 flex items-center justify-between px-5 py-5 text-sm text-[#02223b] lg:px-14 lg:py-7">
      <Logo />
      <nav aria-label="Principal" className="hidden gap-9 text-[#02223b]/75 lg:flex">
        {ENLACES.map((e) => (
          <Link key={e.id} href={e.href} aria-current={actual === e.id ? "page" : undefined} className={enlaceNav}>
            {e.t}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <BotonAgendar mensaje={mensaje} />
        <MenuMovil />
      </div>
    </div>
  );
}
