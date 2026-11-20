"use client";

/**
 * Dos ojos que miran juntos un punto lima que se acerca: la convergencia.
 * Es la prueba de la regla de convergencia contada en 3D. En el tramo 3 el ojo
 * derecho se queda atrás y se va hacia afuera (aparece el punto fantasma de la
 * visión doble); en el 4 vuelven a coordinarse.
 *
 * El progreso llega por `dosOjosEstado.p` (lo escribe el scroll en el DOM).
 */
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { OjoEstudio, OjoModelo, type OjoPose } from "@/components/three/OjoEscena";
import Lienzo, { Respaldo } from "@/components/three/Lienzo";
import { dosOjosEstado } from "./estadoEscenas";


const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Distancia del punto a los ojos, desvío del ojo derecho y punto fantasma. */
function guion(p: number) {
  let zt = mix(4.6, 1.5, ss(0.2, 0.46, p));
  zt = mix(zt, 3.2, ss(0.76, 0.9, p));
  const desvio = ss(0.52, 0.62, p) * (1 - ss(0.78, 0.88, p));
  const lineas = ss(0.04, 0.16, p);
  return { zt, desvio, lineas };
}

/** Colocación del par según la forma de la pantalla. */
function maqueta(aspect: number, halfH: number) {
  const halfW = halfH * aspect;
  // el par va centrado en su propio canvas; el canvas se coloca con CSS
  return aspect >= 1
    ? { cx: 0, cy: 0, d: 1.05, s: 0.78 }
    : { cx: 0, cy: 0, d: halfW * 0.44, s: halfW * 0.34 };
}

const estado = { p: 0, zt: 6, desvio: 0, lineas: 0, cx: 0, cy: 0, d: 1, s: 1 };
const angulo = () => Math.atan2(estado.d, Math.max(0.2, estado.zt));

function Par() {
  const { size, camera } = useThree();
  const punto = useRef<THREE.Mesh>(null);
  const fantasma = useRef<THREE.Mesh>(null);
  const lineaI = useRef<THREE.Line & { geometry: { setPositions: (p: number[]) => void } }>(null);
  const lineaD = useRef<THREE.Line & { geometry: { setPositions: (p: number[]) => void } }>(null);

  useFrame((_, dt) => {
    estado.p += (dosOjosEstado.p - estado.p) * Math.min(1, dt * 6);
    const g = guion(estado.p);
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const m = maqueta(size.width / size.height, halfH);
    Object.assign(estado, g, m);

    const { cx, cy, d, s, zt, desvio, lineas } = estado;
    punto.current?.position.set(cx, cy, zt);
    if (fantasma.current) {
      fantasma.current.position.set(cx + 0.55 * desvio * (zt / 3), cy, zt);
      (fantasma.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * desvio;
    }
    // líneas de mirada: desde la córnea de cada ojo hacia donde mira
    const a = angulo();
    const aD = -a + desvio * (a + 0.38);
    const largo = Math.hypot(d, zt) - s;
    const ojoI = [cx - d + Math.sin(a) * s, cy, Math.cos(a) * s];
    const ojoD = [cx + d + Math.sin(aD) * s, cy, Math.cos(aD) * s];
    lineaI.current?.geometry.setPositions([...ojoI, ojoI[0] + Math.sin(a) * largo, cy, ojoI[2] + Math.cos(a) * largo]);
    lineaD.current?.geometry.setPositions([...ojoD, ojoD[0] + Math.sin(aD) * largo, cy, ojoD[2] + Math.cos(aD) * largo]);
    for (const l of [lineaI.current, lineaD.current]) {
      if (l) (l.material as THREE.Material).opacity = 0.75 * lineas;
    }
  });

  const pose = (lado: -1 | 1) => (): OjoPose => ({
    x: estado.cx + lado * estado.d,
    y: estado.cy,
    rx: 0,
    ry: 0,
    s: estado.s,
    sep: 0,
  });

  return (
    <>
      <OjoModelo seguir={false} pupila={0.32} pose={pose(-1)} mirar={() => ({ x: angulo(), y: 0 })} />
      <OjoModelo
        seguir={false}
        pupila={0.32}
        pose={pose(1)}
        mirar={() => {
          const a = angulo();
          return { x: -a + estado.desvio * (a + 0.38), y: 0 };
        }}
      />
      <mesh ref={punto}>
        <sphereGeometry args={[0.06, 32, 16]} />
        <meshBasicMaterial color="#a8cf45" toneMapped={false} />
      </mesh>
      <mesh ref={fantasma}>
        <sphereGeometry args={[0.06, 32, 16]} />
        <meshBasicMaterial color="#a8cf45" transparent opacity={0} toneMapped={false} />
      </mesh>
      <Line ref={lineaI as never} points={[[0, 0, 0], [0, 0, 1]]} color="#a8cf45" lineWidth={1.2} dashed dashSize={0.08} gapSize={0.06} transparent opacity={0} />
      <Line ref={lineaD as never} points={[[0, 0, 0], [0, 0, 1]]} color="#a8cf45" lineWidth={1.2} dashed dashSize={0.08} gapSize={0.06} transparent opacity={0} />
    </>
  );
}

export default function DosOjosEscena({ activo }: { activo: boolean }) {
  return (
    <Lienzo
      respaldo={<Respaldo src="/3d/respaldo/dos-ojos.webp" />}
      frameloop={activo ? "always" : "never"}
      camera={{ position: [0, 1.6, 8.85], fov: 30 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0.8)}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
    >
      <OjoEstudio />
      <Par />
    </Lienzo>
  );
}
