"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@/hooks/useGSAP";

const DURATION = 0.5;

type Timelines = {
  close: gsap.core.Timeline;
  open: gsap.core.Timeline;
};

/**
 * Transición entre páginas: un "parpadeo" de marca (eco del ojo del logo).
 * Dos párpados navy se cierran desde arriba/abajo cubriendo la pantalla,
 * un hairline lima marca el cierre (mismo lenguaje que el underline del nav
 * y el iris del CTA del header), y se abren de nuevo sobre la ruta ya montada.
 *
 * Intercepta clicks en <a> internos a nivel de documento (capture) para poder
 * animar la salida ANTES de que Next intercambie el contenido — no requiere
 * tocar los `<Link>` existentes en el resto del sitio. El estado "cerrado" se
 * sostiene hasta que cambia `pathname` (nueva página ya montada), así nunca
 * se descubre contenido a medio cargar en redes lentas.
 *
 * Los párpados parten OCULTOS por CSS (scale-y-0/scale-x-0), no por gsap.set:
 * así, si prefers-reduced-motion está activo y el setup de useGSAP nunca
 * corre, igual quedan invisibles en vez de tapar la pantalla a medias.
 *
 * Los onComplete se fijan UNA vez al crear los timelines (no se reasignan por
 * click): leen el href pendiente desde un ref, evitando depender del orden en
 * que GSAP resuelve reasignaciones de eventCallback.
 */
export default function PageTransition() {
  const pathname = usePathname();
  // useRouter() de App Router devuelve una instancia estable: capturarla una
  // sola vez en el closure de useGSAP (deps: []) es seguro, no queda obsoleta.
  const router = useRouter();

  const timelinesRef = useRef<Timelines | null>(null);
  const isAnimatingRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const isFirstRenderRef = useRef(true);

  const scope = useGSAP<HTMLDivElement>(({ self, gsap }) => {
    const top = self.querySelector<HTMLElement>("[data-lid='top']");
    const bottom = self.querySelector<HTMLElement>("[data-lid='bottom']");
    const seam = self.querySelector<HTMLElement>("[data-seam]");
    if (!top || !bottom || !seam) return;

    const close = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (pendingHrefRef.current) router.push(pendingHrefRef.current);
      },
    });
    close
      .to([top, bottom], { scaleY: 1, duration: DURATION, ease: "power3.inOut" }, 0)
      .to(seam, { scaleX: 1, opacity: 1, duration: DURATION * 0.6, ease: "power2.out" }, DURATION * 0.35);

    const open = gsap.timeline({
      paused: true,
      onComplete: () => {
        isAnimatingRef.current = false;
        self.style.pointerEvents = "none";
      },
    });
    open
      .to(seam, { opacity: 0, duration: 0.15, ease: "power1.out" }, 0)
      .to(top, { scaleY: 0, duration: DURATION, ease: "power3.inOut" }, 0.05)
      .to(bottom, { scaleY: 0, duration: DURATION, ease: "power3.inOut" }, 0.12)
      .set(seam, { scaleX: 0 });

    timelinesRef.current = { close, open };

    return () => {
      timelinesRef.current = null;
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const rawHref = anchor.getAttribute("href") ?? "";
      if (rawHref.startsWith("#")) return; // ancla en la misma página

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      const timelines = timelinesRef.current;
      if (!timelines || isAnimatingRef.current) return; // reduced motion → navegación nativa

      e.preventDefault();
      isAnimatingRef.current = true;
      pendingHrefRef.current = url.pathname + url.search + url.hash;

      if (scope.current) scope.current.style.pointerEvents = "auto";
      timelines.open.pause(0);
      timelines.close.restart();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [scope]);

  // Nueva ruta ya montada: abre el párpado. Se salta el primer render (carga inicial).
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    timelinesRef.current?.open.restart();
  }, [pathname]);

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      <div
        data-lid="top"
        className="absolute inset-x-0 top-0 h-1/2 origin-top scale-y-0 bg-slate-ink-900"
      />
      <div
        data-lid="bottom"
        className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom scale-y-0 bg-slate-ink-900"
      />
      <div
        data-seam
        className="absolute inset-x-0 top-1/2 h-[3px] origin-center -translate-y-1/2 scale-x-0 bg-accent-500 opacity-0"
      />
    </div>
  );
}
