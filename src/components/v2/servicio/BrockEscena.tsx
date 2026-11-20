"use client";

/**
 * Cordón de Brock en 3D — pieza de la landing de Estrabismo.
 *
 * El cordón sale de entre los dos ojos (el modelo de la home, en pequeño) y se
 * aleja con tres cuentas. Los ojos giran de verdad hacia la cuenta fijada; en
 * la desviación el OD se va hacia adentro (endotropía, la más común en niños),
 * su línea se aparta y aparece la cuenta doble (diplopía no cruzada).
 *
 * Dos modos:
 * - "auto" (hero): ciclo de desviación y cambio de cuenta; hover fija una cuenta.
 * - "scroll" (BrockRecorrido): todo lo manda `brockScroll.p` (0…1), escrito
 *   por la sección desde el DOM; la cámara viaja entre planos.
 *
 * Modelo procedural (cordón y cuentas) + OjoModelo, con la luz de la home.
 * Las etiquetas son DOM proyectado (no `Html` de drei: da "synchronously
 * unmount a root" en desarrollo).
 */
import { Suspense, useId, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Line } from "@react-three/drei";
import type { Line2 } from "three/addons/lines/Line2.js";
import * as THREE from "three";
import { OjoEstudio, OjoModelo } from "@/components/three/OjoEscena";
import Lienzo, { Respaldo } from "@/components/three/Lienzo";
import { brockScroll, guionBrock } from "../estadoEscenas";


const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------- geometría ----------
const R_OJO = 0.4;
const OI = new THREE.Vector3(-0.54, 0, 2.6);
const OD = new THREE.Vector3(0.54, 0, 2.6);
const curva = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -0.1, 2.35),
  new THREE.Vector3(0, -0.22, 0.4),
  new THREE.Vector3(0, -0.27, -1.8),
  new THREE.Vector3(0, -0.12, -4.2),
]);
const CUENTAS = [
  { s: 0.2, color: "#a8cf45" },
  { s: 0.52, color: "#e0893a" },
  { s: 0.86, color: "#2f7fb8" },
].map((c) => ({ ...c, pos: curva.getPointAt(c.s) }));
const CLAVE = [OI, OD, curva.getPointAt(1), ...CUENTAS.map((c) => c.pos)];
/**
 * La escena se modela con los ojos mirando hacia -z y luego se gira 180° (el
 * grupo raíz) para que miren hacia +z: ahí están la luz de estudio de la home y
 * la cámara. `mundo()` pasa un punto del modelo a coordenadas del mundo.
 */
const mundo = (p: THREE.Vector3, out = new THREE.Vector3()) => out.set(-p.x, p.y, -p.z);
const CLAVE_W = CLAVE.map((p) => mundo(p));
const CENTRO = CLAVE_W.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(CLAVE_W.length);

const CICLO = 6.5;
const DESVIO = THREE.MathUtils.degToRad(9);

// ---------- guion del scroll (4 pasos) ----------
/** Planos de cámara (dirección desde el centro) a lo largo del recorrido. */
const PLANOS: [number, THREE.Vector3][] = (
  [
    [0.0, new THREE.Vector3(4.6, 1.5, 0.9)], // 1 · el cordón, de lado
    [0.32, new THREE.Vector3(2.3, 1.7, 3.2)], // 2 · desde las cuentas hacia los ojos
    [0.6, new THREE.Vector3(1.0, 0.9, 3.6)], // 3 · casi de frente: el OD que se desvía
    [0.86, new THREE.Vector3(4.2, 2.6, 1.2)], // 4 · de lado y arriba: de cuenta en cuenta
  ] as [number, THREE.Vector3][]
).map(([p, v]) => [p, v.normalize()]);

function planoScroll(p: number, out: THREE.Vector3) {
  let i = 0;
  while (i < PLANOS.length - 2 && p > PLANOS[i + 1][0]) i++;
  const [pa, a] = PLANOS[i];
  const [pb, b] = PLANOS[i + 1];
  return out.copy(a).lerp(b, ss(pa, pb, p)).normalize();
}


// ---------- estado por instancia ----------
type Estado = {
  fija: number;
  desv: number;
  lineas: number;
  manual: number;
  ai: { x: number; y: number };
  ad: { x: number; y: number };
};
type Etiquetas = { fij: HTMLDivElement | null; desv: HTMLDivElement | null };
/** Registro de etiquetas DOM por instancia (el hero y el recorrido conviven). */
const ETIQUETAS = new Map<string, Etiquetas>();
function etiquetasDe(id: string) {
  let e = ETIQUETAS.get(id);
  if (!e) ETIQUETAS.set(id, (e = { fij: null, desv: null }));
  return e;
}

const proy = new THREE.Vector3();
function colocar(el: HTMLDivElement | null, p: THREE.Vector3, cam: THREE.Camera, w: number, h: number, dx: string, dy = 0, alfa = 1) {
  if (!el) return;
  mundo(p, proy).project(cam);
  const x = ((proy.x + 1) / 2) * w;
  // si la etiqueta va a la izquierda y no cabe, pasa al otro lado
  if (dx.startsWith("calc(-100%") && x < el.offsetWidth + 36) dx = "28px";
  el.style.transform = `translate(${x}px, ${((1 - proy.y) / 2) * h + dy}px) translate(${dx}, -50%)`;
  el.style.opacity = String(alfa);
}

/** Giro (local del ojo, que mira hacia -z del mundo) para apuntar de `ojo` a `obj`. */
function angulos(ojo: THREE.Vector3, obj: THREE.Vector3, out: { x: number; y: number }) {
  const lx = -(obj.x - ojo.x),
    lz = -(obj.z - ojo.z),
    ly = obj.y - ojo.y;
  out.x = Math.atan2(lx, lz);
  out.y = Math.atan2(ly, Math.hypot(lx, lz));
}

function Cuenta({ i, pos, color, fija, onFijar }: { i: number; pos: THREE.Vector3; color: string; fija: () => number; onFijar: (i: number) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    const m = ref.current;
    if (m) m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, fija() === i ? 1.18 : 1, 8, dt));
  });
  return (
    <mesh
      ref={ref}
      position={pos}
      castShadow
      onPointerOver={() => onFijar(i)}
    >
      <sphereGeometry args={[0.2, 64, 48]} />
      <meshPhysicalMaterial color={color} roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} />
    </mesh>
  );
}

const poseOjo = () => ({ x: 0, y: 0, rx: 0, ry: 0, s: R_OJO, sep: 0 });

function Escena({ id, modo, oscuro, reducir }: { id: string; modo: "auto" | "scroll"; oscuro: boolean; reducir: boolean }) {
  const ultimoEncuadre = useRef("");
  const est = useRef<Estado>({ fija: 1, desv: 0, lineas: 0, manual: -100, ai: { x: 0, y: 0 }, ad: { x: 0, y: 0 } });
  const lineaI = useRef<Line2>(null);
  const lineaD = useRef<Line2>(null);
  const guia = useRef<Line2>(null);
  const fantasma = useRef<THREE.Mesh>(null);
  const matFant = useRef<THREE.MeshPhysicalMaterial>(null);
  const grupo = useRef<THREE.Group>(null);
  const objetivo = useMemo(() => CUENTAS[1].pos.clone(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const ini = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const puntos = useMemo(() => curva.getPoints(120), []);
  const linea = oscuro ? "#ffffff" : "#02223b";

  const fijar = (i: number) => {
    est.current.fija = i;
    est.current.manual = performance.now() / 1000;
  };
  const leerFija = () => est.current.fija;

  useFrame(({ clock, pointer, camera, size }, dt) => {
    const t = clock.elapsedTime;
    const etq = etiquetasDe(id);
    if (modo === "scroll") {
      const g = guionBrock(brockScroll.p);
      est.current.fija = g.fija;
      est.current.desv = reducir ? g.desv : THREE.MathUtils.damp(est.current.desv, g.desv, 6, dt);
      est.current.lineas = THREE.MathUtils.damp(est.current.lineas, g.lineas, 6, dt);
    } else {
      if (!reducir && performance.now() / 1000 - est.current.manual > CICLO * 1.5) est.current.fija = [1, 0][Math.floor(t / CICLO) % 2]; // la azul queda tan cerca de la cámara que la cuenta doble se saldría del cuadro
      const c = t % CICLO;
      est.current.desv = reducir ? 0.7 : ss(1.4, 2.3, c) * (1 - ss(4.3, 5.3, c));
      est.current.lineas = 1;
    }
    objetivo.lerp(CUENTAS[est.current.fija].pos, 1 - Math.exp(-6 * dt));
    const d = est.current.desv;

    // OD: misma distancia, girado hacia adentro (hacia la nariz)
    tmp.copy(objetivo).sub(OD).applyAxisAngle(THREE.Object3D.DEFAULT_UP, -DESVIO * d).add(OD);
    angulos(OI, objetivo, est.current.ai);
    angulos(OD, tmp, est.current.ad);

    // líneas de mirada: desde la córnea de cada ojo
    ini.copy(objetivo).sub(OI).normalize().multiplyScalar(R_OJO * 1.05).add(OI);
    lineaI.current?.geometry.setPositions([ini.x, ini.y, ini.z, objetivo.x, objetivo.y, objetivo.z]);
    dir.copy(tmp).sub(OD).normalize();
    ini.copy(dir).multiplyScalar(R_OJO * 1.05).add(OD);
    lineaD.current?.geometry.setPositions([ini.x, ini.y, ini.z, tmp.x, tmp.y, tmp.z]);
    for (const l of [lineaI.current, lineaD.current]) if (l) (l.material as THREE.Material).opacity = 0.9 * est.current.lineas;
    (lineaD.current?.material as unknown as { color: THREE.Color } | undefined)?.color.set(d > 0.15 ? "#e0893a" : linea);
    if (guia.current) {
      dir.copy(objetivo).sub(OD).normalize().multiplyScalar(R_OJO * 1.05).add(OD);
      guia.current.geometry.setPositions([dir.x, dir.y, dir.z, objetivo.x, objetivo.y, objetivo.z]);
      guia.current.computeLineDistances();
      (guia.current.material as THREE.Material).opacity = 0.5 * d * est.current.lineas;
    }

    // imagen doble (diplopía no cruzada): del lado del ojo desviado
    if (fantasma.current && matFant.current) {
      fantasma.current.position.copy(objetivo);
      fantasma.current.position.x += Math.abs(objetivo.x - tmp.x) * 1.4 + 0.14 * d;
      matFant.current.opacity = (oscuro ? 0.75 : 0.45) * ss(0.3, 0.8, d) * est.current.lineas;
      fantasma.current.visible = d > 0.05;
    }

    // parallax suave con el cursor (solo en el hero)
    if (grupo.current && modo === "auto" && !reducir) {
      grupo.current.rotation.y = THREE.MathUtils.damp(grupo.current.rotation.y, pointer.x * 0.08, 3, dt);
      grupo.current.rotation.x = THREE.MathUtils.damp(grupo.current.rotation.x, -pointer.y * 0.04, 3, dt);
    }

    // cámara en modo scroll: viaja entre planos y se reencuadra
    // (solo si cambió el scroll o el tamaño: el encuadre es una búsqueda)
    if (modo === "scroll") {
      const clave = `${brockScroll.p.toFixed(4)}|${size.width}x${size.height}`;
      if (clave !== ultimoEncuadre.current) {
        ultimoEncuadre.current = clave;
        encuadrar(camera as THREE.PerspectiveCamera, size, planoScroll(brockScroll.p, dir), 0.8);
      }
    }

    // la etiqueta se aparta cuando aparece la cuenta doble (ocuparía su sitio)
    colocar(etq.fij, objetivo, camera, size.width, size.height, "calc(-100% - 28px)", 0, est.current.lineas * (1 - ss(0.15, 0.45, d)));
    const el = etq.desv;
    if (el) {
      colocar(el, OD, camera, size.width, size.height, "-50%", -70, est.current.lineas);
      const txt = d > 0.15 ? `OD hacia adentro · ${Math.round(THREE.MathUtils.radToDeg(DESVIO) * d)}°` : "Ojos alineados";
      if (el.textContent !== txt) el.textContent = txt;
      el.style.color = d > 0.15 ? "#e0893a" : oscuro ? "#b9c9d6" : "#4d6880";
    }
  });

  return (
    <group rotation-y={Math.PI}>
    <group ref={grupo}>
      <mesh castShadow>
        <tubeGeometry args={[curva, 200, 0.019, 12, false]} />
        <meshStandardMaterial color={oscuro ? "#d9d2c3" : "#efe8da"} roughness={0.85} />
      </mesh>
      <Line points={puntos} color={linea} lineWidth={0.4} transparent opacity={0.08} />

      {CUENTAS.map((c, i) => (
        <Cuenta key={i} i={i} pos={c.pos} color={c.color} fija={leerFija} onFijar={fijar} />
      ))}

      <mesh ref={fantasma} visible={false}>
        <sphereGeometry args={[0.23, 48, 32]} />
        <meshPhysicalMaterial ref={matFant} color="#e0893a" emissive="#e0893a" emissiveIntensity={oscuro ? 0.7 : 0} roughness={0.3} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* los ojos: el modelo de la home mirando hacia -z (hacia el cordón) */}
      <Suspense fallback={null}>
        <group position={OI} rotation-y={Math.PI}>
          <OjoModelo seguir={false} vivo={false} pupila={0.3} pose={poseOjo} mirar={() => est.current.ai} />
        </group>
        <group position={OD} rotation-y={Math.PI}>
          <OjoModelo seguir={false} vivo={false} pupila={0.3} pose={poseOjo} mirar={() => est.current.ad} />
        </group>
        {/* sombra de contacto: el modelo casi no se mueve, así que se dibuja UNA vez
            (frames={1}) y dentro del mismo Suspense, para que ya incluya los ojos */}
        {!oscuro && <ContactShadows frames={1} position={[0, -0.75, -0.6]} scale={10} blur={2.6} opacity={0.22} far={1.4} color="#02223b" />}
      </Suspense>

      <Line ref={lineaI} points={[OI, CUENTAS[1].pos]} color={linea} lineWidth={1.6} transparent />
      <Line ref={lineaD} points={[OD, CUENTAS[1].pos]} color={linea} lineWidth={1.6} transparent />
      <Line ref={guia} points={[OD, CUENTAS[1].pos]} color={linea} lineWidth={1} dashed dashSize={0.06} gapSize={0.08} transparent opacity={0} />

    </group>
    </group>
  );
}

/**
 * Encuadre automático: desde el centro del modelo, en la dirección `dir`, busca
 * (bisección) la distancia a la que todos los puntos clave caben con margen.
 */
const v = new THREE.Vector3();
function encuadrar(cam: THREE.PerspectiveCamera, size: { width: number; height: number }, dir: THREE.Vector3, margen: number) {
  cam.aspect = size.width / size.height;
  cam.updateProjectionMatrix();
  let lo = 2,
    hi = 40;
  for (let k = 0; k < 18; k++) {
    const d = (lo + hi) / 2;
    cam.position.copy(CENTRO).addScaledVector(dir, d);
    cam.lookAt(CENTRO);
    cam.updateMatrixWorld();
    const cabe = CLAVE_W.every((p) => (v.copy(p).project(cam), Math.abs(v.x) < margen && Math.abs(v.y) < margen));
    if (cabe) hi = d;
    else lo = d;
  }
  cam.position.copy(CENTRO).addScaledVector(dir, hi);
  cam.lookAt(CENTRO);
}

/** Hero: de tres cuartos, por delante de la cara: se ven los iris y el cordón viene hacia nosotros. */
const DIR_HERO = new THREE.Vector3(1.7, 2.1, 3.4).normalize();
function CamaraHero() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    encuadrar(camera as THREE.PerspectiveCamera, size, DIR_HERO, 0.8);
  }, [camera, size]);
  return null;
}

const etiqueta =
  "pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap font-[family-name:var(--font-v2-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] will-change-transform";

export default function BrockEscena({ activo = true, modo = "auto", oscuro = false }: { activo?: boolean; modo?: "auto" | "scroll"; oscuro?: boolean }) {
  const reducir = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id = useId();
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div ref={(e) => void (etiquetasDe(id).fij = e)} className={`${etiqueta} ${oscuro ? "text-white" : "text-[#02223b]"}`} style={{ opacity: 0 }}>
          Punto de fijación
        </div>
        <div ref={(e) => void (etiquetasDe(id).desv = e)} className={etiqueta} style={{ opacity: 0 }}>
          Ojos alineados
        </div>
      </div>
      <Lienzo
        respaldo={<Respaldo src={modo === "scroll" ? "/3d/respaldo/brock-recorrido.webp" : "/3d/respaldo/brock.webp"} />}
        frameloop={activo ? "always" : "never"}
        shadows
        camera={{ fov: 30 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      >
        <OjoEstudio />
        {modo === "auto" && <CamaraHero />}
        <Escena id={id} modo={modo} oscuro={oscuro} reducir={reducir} />
      </Lienzo>
    </div>
  );
}
