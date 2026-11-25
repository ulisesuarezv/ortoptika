"use client";

/**
 * Alto de pantalla estable para las zonas sticky largas (hero, dos ojos, recorridos).
 *
 * Esas zonas miden varias pantallas (300–460svh). En los navegadores internos
 * (Instagram, Facebook… en iOS son un WKWebView) la barra de la app se esconde o
 * aparece al cambiar de dirección cambiando el alto REAL de la ventana, y ahí
 * `svh` también cambia: 60 px de barra movían el documento ~430 px y el scroll
 * saltaba de golpe. Aquí se fija `--pantalla` en px al cargar y solo se rehace si
 * cambia el ancho (girar el teléfono), nunca por una barra que entra o sale.
 * Sin JS, las zonas usan `100svh` (el respaldo del `var()`).
 */
import { useEffect } from "react";

export default function AltoPantalla() {
  useEffect(() => {
    const raiz = document.documentElement;
    let ancho = 0;
    const fijar = () => {
      if (window.innerWidth === ancho) return;
      ancho = window.innerWidth;
      raiz.style.setProperty("--pantalla", `${window.innerHeight}px`);
    };
    fijar();
    window.addEventListener("resize", fijar);
    return () => window.removeEventListener("resize", fijar);
  }, []);
  return null;
}
