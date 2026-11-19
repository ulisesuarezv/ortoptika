"use client";

/**
 * Cordón de Brock en 3D — la pieza del hero de Estrabismo.
 *
 * El cordón sale de entre los dos ojos (OI/OD) y se aleja con tres cuentas.
 * Las dos líneas de mirada llegan a la cuenta fijada; en cada ciclo el OD se
 * va hacia adentro (endotropía, la desviación más común en niños), su línea
 * se aparta y aparece la cuenta doble (diplopía no cruzada: del lado del ojo
 * desviado). Luego vuelve. Al pasar el cursor por una cuenta, se fija esa.
 *
 * Modelo procedural, sin GLB: cordón (TubeGeometry), cuentas lacadas
 * (MeshPhysicalMaterial con clearcoat) y la luz de estudio del ojo de la home.
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Line } from "@react-three/drei";
import type { Line2 } from "three/addons/lines/Line2.js";
import * as THREE from "three";
import { OjoEstudio } from "@/components/three/OjoEscena";

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ojos, separados ~ la distancia interpupilar a escala; el cordón nace entre ellos
const OI = new THREE.Vector3(-0.42, 0, 2.6);
const OD = new THREE.Vector3(0.42, 0, 2.6);
const curva = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -0.06, 2.45),
  new THREE.Vector3(0, -0.2, 0.4),
  new THREE.Vector3(0, -0.26, -1.8),
  new THREE.Vector3(0, -0.12, -4.2),
]);
const CUENTAS = [
  { s: 0.2, color: "#a8cf45" },
  { s: 0.52, color: "#e0893a" },
  { s: 0.86, color: "#0e4d7a" },
].map((c) => ({ ...c, pos: curva.getPointAt(c.s) }));

const CICLO = 6.5;
const DESVIO = THREE.MathUtils.degToRad(6);

const etiqueta =
  "pointer-events-none select-none whitespace-nowrap font-[family-name:var(--font-v2-sans)] text-[10px] font-semibold uppercase tracking-[0.2em]";

// estado compartido sin re-render: la cuenta fijada y la desviación (0…1)
const estado = { fija: 1, desv: 0, manual: -100 };

/** Etiquetas en el DOM (fuera del Canvas), proyectadas desde 3D en cada frame. */
type Etiquetas = { oi: HTMLDivElement | null; od: HTMLDivElement | null; fij: HTMLDivElement | null; desv: HTMLDivElement | null };
const etiquetas: Etiquetas = { oi: null, od: null, fij: null, desv: null };
const proy = new THREE.Vector3();
function colocar(el: HTMLDivElement | null, p: THREE.Vector3, obj: THREE.Object3D, cam: THREE.Camera, w: number, h: number, dx: string, dy = 0) {
  if (!el) return;
  proy.copy(p);
  obj.localToWorld(proy).project(cam);
  el.style.transform = `translate(${((proy.x + 1) / 2) * w}px, ${((1 - proy.y) / 2) * h + dy}px) translate(${dx}, -50%)`;
}

function Cuenta({ i, pos, color }: { i: number; pos: THREE.Vector3; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    const m = ref.current;
    if (m) m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, estado.fija === i ? 1.18 : 1, 8, dt));
  });
  return (
    <mesh
      ref={ref}
      position={pos}
      castShadow
      onPointerOver={() => {
        estado.fija = i;
        estado.manual = performance.now() / 1000;
      }}
    >
      <sphereGeometry args={[0.21, 64, 48]} />
      <meshPhysicalMaterial color={color} roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} />
    </mesh>
  );
}

function Escena({ reducir }: { reducir: boolean }) {
  const lineaI = useRef<Line2>(null);
  const lineaD = useRef<Line2>(null);
  const guia = useRef<Line2>(null);
  const fantasma = useRef<THREE.Mesh>(null);
  const matFant = useRef<THREE.MeshPhysicalMaterial>(null);
  const grupo = useRef<THREE.Group>(null);
  const objetivo = useMemo(() => CUENTAS[1].pos.clone(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const puntos = useMemo(() => curva.getPoints(120), []);

  useFrame(({ clock, pointer, camera, size }, dt) => {
    const t = clock.elapsedTime;
    // cambia de cuenta en cada ciclo, salvo que el cursor haya elegido una hace poco
    if (!reducir && performance.now() / 1000 - estado.manual > CICLO * 1.5) estado.fija = [1, 0, 2][Math.floor(t / CICLO) % 3];
    objetivo.lerp(CUENTAS[estado.fija].pos, 1 - Math.exp(-6 * dt));

    const c = t % CICLO;
    const d = reducir ? 0.7 : ss(1.4, 2.3, c) * (1 - ss(4.3, 5.3, c));
    estado.desv = d;

    // OD: misma distancia, girado hacia adentro (hacia la nariz)
    tmp.copy(objetivo).sub(OD).applyAxisAngle(THREE.Object3D.DEFAULT_UP, -DESVIO * d).add(OD);
    lineaI.current?.geometry.setPositions([OI.x, OI.y, OI.z, objetivo.x, objetivo.y, objetivo.z]);
    lineaD.current?.geometry.setPositions([OD.x, OD.y, OD.z, tmp.x, tmp.y, tmp.z]);
    (lineaD.current?.material as unknown as { color: THREE.Color } | undefined)?.color.set(d > 0.15 ? "#e0893a" : "#02223b");
    if (guia.current) {
      guia.current.geometry.setPositions([OD.x, OD.y, OD.z, objetivo.x, objetivo.y, objetivo.z]);
      guia.current.computeLineDistances();
      (guia.current.material as THREE.Material).opacity = 0.5 * d;
    }

    // imagen doble (diplopía no cruzada): del lado del ojo desviado
    if (fantasma.current && matFant.current) {
      fantasma.current.position.copy(objetivo);
      fantasma.current.position.x += Math.abs(objetivo.x - tmp.x) * 1.4 + 0.12 * d;
      matFant.current.opacity = 0.45 * ss(0.3, 0.8, d);
      fantasma.current.visible = d > 0.05;
    }

    const g = grupo.current;
    if (g) {
      colocar(etiquetas.oi, OI, g, camera, size.width, size.height, "-50%", 22);
      colocar(etiquetas.od, OD, g, camera, size.width, size.height, "-50%", 22);
      colocar(etiquetas.fij, objetivo, g, camera, size.width, size.height, "calc(-100% - 26px)");
      colocar(etiquetas.desv, OD, g, camera, size.width, size.height, "22px", -16);
    }
    const el = etiquetas.desv;
    if (el) {
      const txt = d > 0.15 ? `OD hacia adentro · ${Math.round(THREE.MathUtils.radToDeg(DESVIO) * d)}°` : "Ojos alineados";
      if (el.textContent !== txt) el.textContent = txt;
      el.style.color = d > 0.15 ? "#c46d22" : "#4d6880";
    }

    // parallax suave con el cursor
    if (grupo.current && !reducir) {
      grupo.current.rotation.y = THREE.MathUtils.damp(grupo.current.rotation.y, pointer.x * 0.1, 3, dt);
      grupo.current.rotation.x = THREE.MathUtils.damp(grupo.current.rotation.x, -pointer.y * 0.04, 3, dt);
    }
  });

  return (
    <group ref={grupo}>
      {/* cordón */}
      <mesh castShadow>
        <tubeGeometry args={[curva, 200, 0.019, 12, false]} />
        <meshStandardMaterial color="#efe8da" roughness={0.85} />
      </mesh>
      <Line points={puntos} color="#02223b" lineWidth={0.4} transparent opacity={0.08} />

      {CUENTAS.map((c, i) => (
        <Cuenta key={i} i={i} pos={c.pos} color={c.color} />
      ))}

      {/* la cuenta que se ve doble */}
      <mesh ref={fantasma} visible={false}>
        <sphereGeometry args={[0.24, 48, 32]} />
        <meshPhysicalMaterial ref={matFant} color="#e0893a" roughness={0.3} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ojos (solo marcas) y líneas de mirada */}
      {[OI, OD].map((o, i) => (
        <group key={i} position={o}>
          <mesh>
            <sphereGeometry args={[0.07, 32, 24]} />
            <meshPhysicalMaterial color="#02223b" roughness={0.3} clearcoat={1} />
          </mesh>
        </group>
      ))}
      <Line ref={lineaI} points={[OI, CUENTAS[1].pos]} color="#02223b" lineWidth={1.6} />
      <Line ref={lineaD} points={[OD, CUENTAS[1].pos]} color="#02223b" lineWidth={1.6} />
      <Line ref={guia} points={[OD, CUENTAS[1].pos]} color="#02223b" lineWidth={1} dashed dashSize={0.06} gapSize={0.08} transparent opacity={0} />


      <ContactShadows position={[0, -0.7, -0.6]} scale={10} blur={2.6} opacity={0.22} far={1.4} color="#02223b" />
    </group>
  );
}

/**
 * Cámara detrás y por encima de los ojos: el cordón sube en diagonal hacia el
 * fondo. Encuadre automático: busca la distancia a la que los ojos y el final
 * del cordón caben en el lienzo con margen, sea cual sea su proporción.
 */
const DIR = new THREE.Vector3(1.9, 3.4, 5.2).normalize();
const CLAVE = [OI, OD, curva.getPointAt(1), ...CUENTAS.map((c) => c.pos)];
function Camara() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.aspect = size.width / size.height;
    const centro = new THREE.Vector3();
    CLAVE.forEach((p) => centro.add(p));
    centro.divideScalar(CLAVE.length);
    const v = new THREE.Vector3();
    const mx = size.width / size.height < 0.9 ? 0.8 : 0.78;
    let d = 4;
    for (; d < 30; d += 0.1) {
      cam.position.copy(centro).addScaledVector(DIR, d);
      cam.lookAt(centro);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();
      if (CLAVE.every((p) => (v.copy(p).project(cam), Math.abs(v.x) < mx && Math.abs(v.y) < 0.82))) break;
    }
  }, [camera, size]);
  return null;
}

export default function BrockEscena({ activo = true }: { activo?: boolean }) {
  const reducir = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const base = `${etiqueta} absolute left-0 top-0 will-change-transform`;
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div ref={(e) => void (etiquetas.oi = e)} className={`${base} text-[#4d6880]`}>OI</div>
        <div ref={(e) => void (etiquetas.od = e)} className={`${base} text-[#4d6880]`}>OD</div>
        <div ref={(e) => void (etiquetas.fij = e)} className={`${base} text-[#02223b]`}>Punto de fijación</div>
        <div ref={(e) => void (etiquetas.desv = e)} className={`${base} text-[#4d6880]`}>Ojos alineados</div>
      </div>
      <Canvas
      frameloop={activo ? "always" : "never"}
      dpr={[1, 2]}
      shadows
      camera={{ fov: 30 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
    >
      <OjoEstudio />
      <Camara />
      <Escena reducir={reducir} />
      </Canvas>
    </div>
  );
}
