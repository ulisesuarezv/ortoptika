"use client";

/**
 * Canvas común de las escenas 3D de la v2.
 *
 * - Resolución adaptativa SIN perder calidad donde no hace falta: arranca a la
 *   máxima (dpr 2) y solo la baja si ESE dispositivo no sostiene la fluidez
 *   (PerformanceMonitor); si se recupera, vuelve a subir. En equipos capaces se
 *   ve exactamente igual que antes.
 * - Respaldo sin WebGL: si el navegador no puede crear un contexto, se muestra
 *   `respaldo` (una imagen fija de la propia escena) en lugar del lienzo.
 */
import { useState, type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";

let webgl: boolean | null = null;
function hayWebGL() {
  if (webgl === null) {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      webgl = !!gl;
      // liberar el contexto de prueba: si no, queda vivo y ocupa la GPU
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

const DPR_MAX = 2;
const DPR_MIN = 1.25;

export default function Lienzo({ respaldo, children, ...props }: Omit<CanvasProps, "dpr"> & { respaldo?: ReactNode }) {
  const [ok] = useState(hayWebGL);
  const [dpr, setDpr] = useState(DPR_MAX);
  if (!ok) return <>{respaldo ?? null}</>;
  return (
    <Canvas dpr={[1, dpr]} {...props}>
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(DPR_MIN, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(DPR_MAX, d + 0.25))}
        onFallback={() => setDpr(DPR_MIN)}
      />
      {children}
    </Canvas>
  );
}

/** Imagen fija para el respaldo sin WebGL (decorativa: la escena es aria-hidden). */
export function Respaldo({ src, className = "" }: { src: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" decoding="async" className={`h-full w-full object-contain ${className}`} />;
}
