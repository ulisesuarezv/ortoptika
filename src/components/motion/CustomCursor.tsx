"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Variant = "" | "link" | "media";

/**
 * Variante según lo que hay bajo el puntero. Delegado a nivel de documento
 * (sin tocar el resto del sitio): "link" cubre <a>/<button>/roles de botón,
 * "media" cubre imágenes reales (incluye next/image, que renderiza <img>).
 * Un link que contiene una imagen (p. ej. el logo del header) se resuelve
 * como "link" — prioriza la afordancia de click sobre el hover de imagen.
 */
function resolveVariant(target: EventTarget | null): Variant {
  if (!(target instanceof Element)) return "";
  if (
    target.closest(
      "a, button, [role='button'], input[type='submit'], input[type='button'], label, summary",
    )
  ) {
    return "link";
  }
  if (target.closest("img, picture, video")) return "media";
  return "";
}

/**
 * Tema de la superficie bajo el puntero. El cursor es navy (slate-ink-900),
 * el mismo color exacto que los fondos oscuros del sitio: sobre el footer o
 * las bandas de consultorio quedaba invisible. Las secciones oscuras se
 * marcan con data-cursor-theme="dark" y aquí se lee para invertirlo.
 */
function resolveTheme(target: EventTarget | null): "dark" | "" {
  if (!(target instanceof Element)) return "";
  return target.closest('[data-cursor-theme="dark"]') ? "dark" : "";
}

/**
 * Cursor custom: un punto (sigue exacto) + un anillo (sigue con inercia vía
 * gsap.quickTo). La POSICIÓN la mueve GSAP sobre un wrapper propio (x/y →
 * transform); el TAMAÑO/COLOR de variante lo resuelve una transición CSS en
 * un hijo interno — así ambos sistemas de transform no se pisan.
 *
 * Se activa solo si hay puntero fino real (hover:hover + pointer:fine) y NO
 * hay prefers-reduced-motion; además se auto-desactiva si llega CUALQUIER
 * touchstart real (dispositivos híbridos). El cursor nativo nunca se oculta
 * hasta confirmar que el custom está listo (evita quedarse sin cursor).
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotWrapRef = useRef<HTMLDivElement>(null);
  const ringWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDesktopPointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!isDesktopPointer || prefersReduced) return;

    const root = rootRef.current;
    const dotWrap = dotWrapRef.current;
    const ringWrap = ringWrapRef.current;
    const ring = ringRef.current;
    if (!root || !dotWrap || !ringWrap || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dotWrap, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dotWrap, "y", { duration: 0.08, ease: "power3.out" });
    const ringX = gsap.quickTo(ringWrap, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ringWrap, "y", { duration: 0.45, ease: "power3.out" });

    let currentVariant: Variant = "";
    let currentTheme: "dark" | "" = "";

    function onMove(e: PointerEvent) {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const variant = resolveVariant(e.target);
      if (variant !== currentVariant) {
        currentVariant = variant;
        if (variant) ring!.dataset.variant = variant;
        else delete ring!.dataset.variant;
      }

      const theme = resolveTheme(e.target);
      if (theme !== currentTheme) {
        currentTheme = theme;
        if (theme) root!.dataset.theme = theme;
        else delete root!.dataset.theme;
      }
    }

    function onLeaveWindow() {
      gsap.to([dotWrap, ringWrap], { autoAlpha: 0, duration: 0.2 });
    }
    function onEnterWindow() {
      gsap.to([dotWrap, ringWrap], { autoAlpha: 1, duration: 0.2 });
    }

    // Híbrido (mouse + touch): al primer toque real, apaga el cursor custom
    // y no vuelve a activarse en esta carga de página.
    function onTouch() {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);
    window.addEventListener("touchstart", onTouch, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      window.removeEventListener("touchstart", onTouch);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="cursor-root pointer-events-none fixed inset-0 z-[200]"
    >
      <div ref={dotWrapRef} className="cursor-wrap">
        <div className="cursor-dot" />
      </div>
      <div ref={ringWrapRef} className="cursor-wrap">
        <div ref={ringRef} className="cursor-ring" />
      </div>
    </div>
  );
}
