"use client";

/**
 * Cabecera fija global (layout raíz). Cada página trae su cabecera en el flujo;
 * esta aparece solo cuando ya se bajó más de media pantalla y la persona sube
 * un poco (gesto de «quiero navegar»), y se esconde al volver a bajar. Así
 * nunca tapa los recorridos con sticky mientras se leen.
 * Escondida queda `inert` (fuera del orden de tabulación y del lector). Al
 * cambiar de página el scroll vuelve arriba y eso ya la esconde.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BotonAgendar, Logo, enlaceNav } from "./Cabecera";
import MenuMovil from "./MenuMovil";
import { ENLACES } from "./rutas";

export default function CabeceraFlotante() {
  const [visible, setVisible] = useState(false);
  const ruta = usePathname();

  useEffect(() => {
    let ultimo = window.scrollY;
    let raf = 0;
    const revisar = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < window.innerHeight * 0.5) setVisible(false);
      else if (y < ultimo - 6) setVisible(true);
      else if (y > ultimo + 6) setVisible(false);
      if (Math.abs(y - ultimo) > 6) ultimo = y;
    };
    const alScroll = () => {
      if (!raf) raf = requestAnimationFrame(revisar);
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const actual = ruta.startsWith("/sobre-mi") ? "sobre-mi" : ruta.startsWith("/contacto") ? "contacto" : ruta.startsWith("/servicios") ? "servicios" : undefined;

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-3 top-3 z-40 flex items-center justify-between rounded-full border border-[#02223b]/10 bg-white/85 py-1.5 pl-5 pr-1.5 text-sm text-[#02223b] shadow-[0_20px_50px_-30px_rgba(2,34,59,.5)] backdrop-blur-md transition-[translate,opacity] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] font-[family-name:var(--font-v2-sans)] motion-reduce:transition-none lg:inset-x-6 lg:pl-7 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-[140%] opacity-0"
      }`}
    >
      <Logo compacto />
      <nav aria-label="Accesos rápidos" className="hidden gap-9 text-[#02223b]/75 lg:flex">
        {ENLACES.map((e) => (
          <Link key={e.id} href={e.href} aria-current={actual === e.id ? "page" : undefined} className={enlaceNav}>
            {e.t}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <BotonAgendar />
        <MenuMovil />
      </div>
    </div>
  );
}
