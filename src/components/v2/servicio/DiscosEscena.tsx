"use client";

/**
 * Discos de luz reactivos — pieza de la landing de Terapia visual.
 *
 * Objeto real del consultorio: discos con un anillo de LED bajo una cúpula
 * transparente y un sensor en el centro que detecta el toque. Uno va pegado en
 * la pared como referencia; los del suelo se encienden de colores distintos y
 * el niño toca (o pisa) el que tiene el color de la referencia. El equipo mide
 * el tiempo de reacción. Modelo procedural, sin marcas.
 *
 * Modo "auto" (hero): rondas solas; con el cursor (o un toque en el móvil) se
 * puede jugar: pasar por encima del disco correcto lo «toca».
 */
import { useId, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { OjoEstudio } from "@/components/three/OjoEscena";
import Lienzo, { Respaldo } from "@/components/three/Lienzo";

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------- medidas (1 unidad ≈ 10 cm) ----------
const R_GOMA = 0.66; // radio exterior del aro de goma (disco de ~13 cm)
const R_CUPULA = 0.54;
const ALTO = 0.36; // alto del aro
const R_LED = 0.44;
const N_LED = 12; // pares de LED

/** Colores del equipo, afinados a la paleta del sitio. */
const COLORES = ["#a8cf45", "#2b7bff", "#ff3a2c", "#b04bff", "#ffb020"].map((c) => new THREE.Color(c));

// suelo: cinco discos en una fila algo desordenada (como en el consultorio)
// en arco frente a la pared: el del centro, más cerca
const SUELO = [-2.7, -1.4, 0, 1.4, 2.7].map((x, i) => new THREE.Vector3(x, 0, 2.3 - 0.24 * x * x + [0.05, -0.15, 0, 0.12, -0.05][i]));
const PARED_Z = -2.2;
const REF = new THREE.Vector3(0, 2.7, PARED_Z + 0.02);

// ---------- geometrías compartidas ----------
function perfilGoma() {
  // sección del aro (r, y): base, costado algo curvo, labio superior redondeado
  const p: THREE.Vector2[] = [];
  p.push(new THREE.Vector2(R_CUPULA - 0.02, 0.02));
  p.push(new THREE.Vector2(R_GOMA - 0.05, 0));
  for (let k = 0; k <= 6; k++) {
    const a = -Math.PI / 2 + (k / 6) * (Math.PI / 2);
    p.push(new THREE.Vector2(R_GOMA - 0.05 + Math.cos(a) * 0.05, 0.05 + Math.sin(a) * 0.05));
  }
  for (let k = 1; k <= 6; k++) {
    const t = k / 6;
    p.push(new THREE.Vector2(R_GOMA + 0.012 * Math.sin(Math.PI * t), 0.05 + t * (ALTO - 0.13)));
  }
  for (let k = 0; k <= 10; k++) {
    const a = (k / 10) * Math.PI;
    p.push(new THREE.Vector2(R_GOMA - 0.065 + Math.cos(a) * 0.065, ALTO - 0.08 + Math.sin(a) * 0.08));
  }
  p.push(new THREE.Vector2(R_CUPULA - 0.01, ALTO - 0.1));
  p.push(new THREE.Vector2(R_CUPULA - 0.02, 0.02));
  return p;
}

function useGeometrias() {
  return useMemo(() => {
    const goma = new THREE.LatheGeometry(perfilGoma(), 64);
    goma.computeVertexNormals();
    // cúpula: casquete bajo que asoma un poco sobre el aro
    const cupula = new THREE.SphereGeometry(1, 64, 16, 0, Math.PI * 2, 0, 0.62);
    const s = R_CUPULA / Math.sin(0.62);
    cupula.scale(s, s * 0.42, s);
    cupula.translate(0, ALTO - 0.11 - s * 0.42 * Math.cos(0.62), 0);
    // halo y charco de luz: degradado radial
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(255,255,255,0.45)");
    grad.addColorStop(0.65, "rgba(255,255,255,0.1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const halo = new THREE.CanvasTexture(c);
    halo.colorSpace = THREE.SRGBColorSpace;
    // velo: rectángulo de bordes muy suaves (pared y suelo que se funden)
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const gv = cv.getContext("2d")!;
    const img = gv.createImageData(256, 256);
    for (let y = 0; y < 256; y++)
      for (let x = 0; x < 256; x++) {
        const u = Math.abs(x / 255 - 0.5) * 2,
          w = Math.abs(y / 255 - 0.5) * 2;
        const a = (1 - ss(0.35, 1, u)) * (1 - ss(0.35, 1, w));
        const k = (y * 256 + x) * 4;
        img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
        img.data[k + 3] = Math.round(a * 255);
      }
    gv.putImageData(img, 0, 0);
    const velo = new THREE.CanvasTexture(cv);
    return { goma, cupula, halo, velo };
  }, []);
}

// ---------- estado de las luces ----------
type Luz = { color: THREE.Color; on: number; flash: number; tiembla: number };

const negro = { color: "#141518", roughness: 0.78, metalness: 0 } as const;
const apagado = new THREE.Color("#d7dadd");
const o = new THREE.Object3D();

/** Un disco. Lee su luz de `luz()` en cada frame. */
function Disco({ geo, luz, alToque, pared = false }: { geo: ReturnType<typeof useGeometrias>; luz: () => Luz; alToque?: () => void; pared?: boolean }) {
  const leds = useRef<THREE.InstancedMesh>(null);
  const matLed = useRef<THREE.MeshBasicMaterial>(null);
  const matAro = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.Sprite>(null);
  const charco = useRef<THREE.Mesh>(null);
  const cuerpo = useRef<THREE.Group>(null);
  const nivel = useRef({ n: 0, f: 0 });
  const col = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const m = leds.current;
    if (!m) return;
    o.rotation.set(0, 0, 0);
    o.scale.setScalar(1);
    for (let k = 0; k < N_LED; k++) {
      const a = (k / N_LED) * Math.PI * 2;
      for (const d of [-0.028, 0.028]) {
        o.position.set(Math.cos(a) * R_LED + Math.cos(a + Math.PI / 2) * d, ALTO - 0.17, Math.sin(a) * R_LED + Math.sin(a + Math.PI / 2) * d);
        o.rotation.set(0, -a, 0);
        o.updateMatrix();
        m.setMatrixAt(k * 2 + (d > 0 ? 1 : 0), o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, dt) => {
    const l = luz();
    const e = nivel.current;
    e.n = THREE.MathUtils.damp(e.n, l.on, 18, dt);
    e.f = THREE.MathUtils.damp(e.f, l.flash, 14, dt);
    // destello del acierto: el disco pasa a blanco un instante
    col.copy(apagado).lerp(l.color, e.n).lerp(new THREE.Color(1, 1, 1), e.f * 0.75);
    if (matLed.current) matLed.current.color.copy(col);
    if (matAro.current) {
      matAro.current.color.copy(l.color).lerp(new THREE.Color(1, 1, 1), e.f * 0.6);
      matAro.current.opacity = Math.min(1, e.n * 0.55 + e.f * 0.4);
    }
    if (halo.current) {
      (halo.current.material as THREE.SpriteMaterial).color.copy(l.color);
      (halo.current.material as THREE.SpriteMaterial).opacity = e.n * 0.55 + e.f * 0.35;
      halo.current.scale.setScalar(1.7 + e.f * 0.9);
    }
    if (charco.current) {
      const m = charco.current.material as THREE.MeshBasicMaterial;
      m.color.copy(l.color);
      m.opacity = e.n * 0.5;
    }
    if (cuerpo.current) {
      // al tocarlo se hunde un poco; si es el equivocado, tiembla
      cuerpo.current.position.y = -0.05 * e.f;
      cuerpo.current.rotation.z = Math.sin(l.tiembla * 40) * 0.05 * l.tiembla;
    }
  });

  const tocar = alToque
    ? (ev: ThreeEvent<PointerEvent>) => {
        ev.stopPropagation();
        alToque();
      }
    : undefined;

  return (
    <group rotation-x={pared ? Math.PI / 2 : 0}>
      <group ref={cuerpo}>
        <mesh geometry={geo.goma} castShadow receiveShadow>
          <meshStandardMaterial {...negro} side={THREE.DoubleSide} />
        </mesh>
        {/* fondo bajo la cúpula */}
        <mesh position-y={0.04} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[R_CUPULA, 48]} />
          <meshStandardMaterial color="#1c1e21" roughness={0.6} />
        </mesh>
        {/* anillo de prismas: aro claro con divisiones */}
        <mesh position-y={ALTO - 0.19} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[R_LED - 0.08, R_LED + 0.08, 64]} />
          <meshStandardMaterial color="#9aa3ab" roughness={0.2} transparent opacity={0.35} />
        </mesh>
        {/* los LED (pares) */}
        <instancedMesh ref={leds} args={[undefined, undefined, N_LED * 2]}>
          <boxGeometry args={[0.04, 0.03, 0.05]} />
          <meshBasicMaterial ref={matLed} color={apagado} toneMapped={false} />
        </instancedMesh>
        {/* luz difusa del anillo bajo los prismas */}
        <mesh position-y={ALTO - 0.16} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[R_LED - 0.07, R_LED + 0.07, 64]} />
          <meshBasicMaterial ref={matAro} transparent opacity={0} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
        </mesh>
        {/* núcleo: sensor con aro rojo y puntos */}
        <mesh position-y={0.12}>
          <cylinderGeometry args={[0.16, 0.18, 0.16, 40]} />
          <meshStandardMaterial color="#0d0e10" roughness={0.45} />
        </mesh>
        <mesh position-y={0.205} rotation-x={-Math.PI / 2}>
          <torusGeometry args={[0.035, 0.009, 8, 32]} />
          <meshBasicMaterial color="#d8312a" />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = (k / 6) * Math.PI * 2 + 0.3;
          return (
            <mesh key={k} position={[Math.cos(a) * 0.11, 0.203, Math.sin(a) * 0.11]} rotation-x={-Math.PI / 2}>
              <circleGeometry args={[k % 2 ? 0.014 : 0.02, 12]} />
              <meshBasicMaterial color={k % 2 ? "#f2f2f2" : "#3a3d42"} />
            </mesh>
          );
        })}
        {/* cúpula transparente */}
        <mesh geometry={geo.cupula} renderOrder={2}>
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.16} roughness={0.04} clearcoat={1} clearcoatRoughness={0.02} depthWrite={false} />
        </mesh>
        <sprite ref={halo} position-y={ALTO + 0.05} renderOrder={3}>
          <spriteMaterial map={geo.halo} blending={THREE.AdditiveBlending} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </sprite>
      </group>
      {/* la luz que cae sobre el suelo o la pared alrededor del disco */}
      <mesh ref={charco} position-y={0.006} rotation-x={-Math.PI / 2} renderOrder={1}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial map={geo.halo} transparent opacity={0} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {tocar && (
        <mesh position-y={0.2} onPointerOver={tocar} onPointerDown={tocar} visible={false}>
          <cylinderGeometry args={[R_GOMA * 1.15, R_GOMA * 1.15, 0.6, 24]} />
        </mesh>
      )}
    </group>
  );
}

// ---------- etiquetas DOM ----------
type Etiquetas = { ref: HTMLDivElement | null; tiempo: HTMLDivElement | null; tiempoTxt: HTMLSpanElement | null };
const ETIQUETAS = new Map<string, Etiquetas>();
function etiquetasDe(id: string) {
  let e = ETIQUETAS.get(id);
  if (!e) ETIQUETAS.set(id, (e = { ref: null, tiempo: null, tiempoTxt: null }));
  return e;
}
const proy = new THREE.Vector3();
function colocar(el: HTMLDivElement | null, p: THREE.Vector3, cam: THREE.Camera, w: number, h: number, dy: number, alfa: number) {
  if (!el) return;
  proy.copy(p).project(cam);
  el.style.transform = `translate(${((proy.x + 1) / 2) * w}px, ${((1 - proy.y) / 2) * h + dy}px) translate(-50%, -100%)`;
  el.style.opacity = String(alfa);
}

// ---------- rondas ----------
const azar = (k: number) => {
  const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};
/** Ronda k: color de la referencia y orden de los colores del suelo. */
function ronda(k: number) {
  const orden = [0, 1, 2, 3, 4];
  for (let i = orden.length - 1; i > 0; i--) {
    const j = Math.floor(azar(k * 7 + i) * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  // la respuesta no repite sitio de una ronda a la siguiente
  // (k·3 mod 5 más 0 o 1: dos rondas seguidas siempre difieren en 2, 3 o 4 sitios)
  const meta = (k * 3 + Math.floor(azar(k * 13 + 5) * 2)) % 5;
  return { orden, meta, color: orden[meta] };
}

// fases (s): referencia sola · suelo encendido (espera el toque) · acierto · pausa
const T_REF = 0.9;
const T_ESPERA = 2.4;
const T_ACIERTO = 1.1;
const T_PAUSA = 0.45;

function Escena({ id, reducir }: { id: string; reducir: boolean }) {
  const geo = useGeometrias();
  const luces = useRef<Luz[]>(Array.from({ length: SUELO.length + 1 }, () => ({ color: COLORES[0].clone(), on: 0, flash: 0, tiembla: 0 })));
  const est = useRef({ k: 0, t0: 0, fase: "ref" as "ref" | "busca" | "acierto" | "pausa", tReaccion: 0, tocado: -1, iniciado: false });
  const grupo = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const lectores = useMemo(() => Array.from({ length: SUELO.length + 1 }, (_, i) => () => luces.current[i]), []);
  const toques = useMemo(
    () =>
      SUELO.map((_, i) => () => {
        const e = est.current;
        if (e.fase !== "busca") return;
        const r = ronda(e.k);
        if (i === r.meta) {
          e.tocado = i;
          e.tReaccion = performance.now() / 1000 - e.t0;
          e.fase = "acierto";
          e.t0 = performance.now() / 1000;
        } else luces.current[i + 1].tiembla = 1;
      }),
    [],
  );

  useFrame(({ camera, size, pointer }, dt) => {
    const e = est.current;
    const L = luces.current;
    const ahora = performance.now() / 1000;
    if (!e.iniciado) {
      e.iniciado = true;
      e.t0 = ahora;
    }
    const r = ronda(e.k);

    if (reducir) {
      // fijo: referencia y suelo encendidos, sin rondas
      L[0].color.copy(COLORES[r.color]);
      L[0].on = 1;
      SUELO.forEach((_, i) => {
        L[i + 1].color.copy(COLORES[r.orden[i]]);
        L[i + 1].on = 1;
      });
    } else {
      const t = ahora - e.t0;
      if (e.fase === "ref" && t > T_REF) {
        e.fase = "busca";
        e.t0 = ahora;
      } else if (e.fase === "busca" && t > T_ESPERA) {
        // nadie jugó: el «niño» toca el correcto
        e.tocado = r.meta;
        e.tReaccion = 0.48 + azar(e.k * 3 + 1) * 0.42;
        e.fase = "acierto";
        e.t0 = ahora;
      } else if (e.fase === "acierto" && t > T_ACIERTO) {
        e.fase = "pausa";
        e.t0 = ahora;
      } else if (e.fase === "pausa" && t > T_PAUSA) {
        e.k++;
        e.fase = "ref";
        e.t0 = ahora;
        e.tocado = -1;
      }
      const rr = ronda(e.k);
      L[0].color.copy(COLORES[rr.color]);
      L[0].on = e.fase === "pausa" ? 0 : 1;
      L[0].flash = 0;
      SUELO.forEach((_, i) => {
        const l = L[i + 1];
        l.color.copy(COLORES[rr.orden[i]]);
        const acierto = e.fase === "acierto";
        l.on = e.fase === "busca" || (acierto && i === e.tocado) ? 1 : 0;
        l.flash = acierto && i === e.tocado ? 1 - ss(0.25, 0.9, ahora - e.t0) : 0;
        l.tiembla = Math.max(0, l.tiembla - dt * 2.5);
      });
    }

    if (grupo.current && !reducir) {
      grupo.current.rotation.y = THREE.MathUtils.damp(grupo.current.rotation.y, pointer.x * 0.05, 3, dt);
    }

    // etiquetas
    const etq = etiquetasDe(id);
    tmp.copy(REF).add(new THREE.Vector3(0, R_GOMA + 0.25, 0));
    colocar(etq.ref, tmp, camera, size.width, size.height, 0, 1);
    const alfaT = e.fase === "acierto" ? ss(0, 0.15, ahora - e.t0) * (1 - ss(0.85, 1.1, ahora - e.t0)) : 0;
    if (e.tocado >= 0) {
      tmp.copy(SUELO[e.tocado]).add(new THREE.Vector3(0, 1.25 + 0.2 * ss(0, 1.1, ahora - e.t0), -0.3));
      if (etq.tiempoTxt) etq.tiempoTxt.textContent = `${e.tReaccion.toFixed(2).replace(".", ",")} s`;
    }
    colocar(etq.tiempo, tmp, camera, size.width, size.height, 0, alfaT);
  });

  return (
    <group ref={grupo}>
      {/* la pared y el suelo, apenas insinuados: se funden con la página */}
      <mesh position={[0, 2.4, PARED_Z - 0.01]}>
        <planeGeometry args={[9, 6]} />
        <meshBasicMaterial map={geo.velo} color="#ece6da" transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.004, PARED_Z + 3]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[10, 6]} />
        <meshBasicMaterial map={geo.velo} color="#ece6da" transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <group position={REF}>
        <Disco geo={geo} luz={lectores[0]} pared />
      </group>
      {SUELO.map((p, i) => (
        <group key={i} position={p} rotation-y={i * 1.3}>
          <Disco geo={geo} luz={lectores[i + 1]} alToque={toques[i]} />
        </group>
      ))}
      <ContactShadows frames={1} position={[0, -0.001, 0]} scale={12} blur={2} opacity={0.32} far={1.2} color="#02223b" />
    </group>
  );
}

// ---------- encuadre ----------
const PTS = [
  ...SUELO.flatMap((p) => [p.clone().add(new THREE.Vector3(-R_GOMA, 0, R_GOMA)), p.clone().add(new THREE.Vector3(R_GOMA, 0, R_GOMA))]),
  REF.clone().add(new THREE.Vector3(0, R_GOMA + 0.55, 0)),

];
const DIR = new THREE.Vector3(0, 1.15, 1).normalize();
const v = new THREE.Vector3();
function encuadrar(cam: THREE.PerspectiveCamera, size: { width: number; height: number }) {
    cam.aspect = size.width / size.height;
    cam.updateProjectionMatrix();
    // centro de la caja (no el promedio: hay muchos más puntos en el suelo que en la pared)
    const centro = new THREE.Box3().setFromPoints(PTS).getCenter(new THREE.Vector3());
    let lo = 1,
      hi = 80;
    for (let k = 0; k < 20; k++) {
      const d = (lo + hi) / 2;
      cam.position.copy(centro).addScaledVector(DIR, d);
      cam.lookAt(centro);
      cam.updateMatrixWorld();
      if (PTS.every((p) => (v.copy(p).project(cam), Math.abs(v.x) < 0.8 && Math.abs(v.y) < 0.8))) hi = d;
      else lo = d;
    }
    cam.position.copy(centro).addScaledVector(DIR, hi);
    cam.lookAt(centro);
}
function CamaraHero() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    encuadrar(camera as THREE.PerspectiveCamera, size);
  }, [camera, size]);
  return null;
}

const etiqueta =
  "pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap font-[family-name:var(--font-v2-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] will-change-transform";

export default function DiscosEscena({ activo = true }: { activo?: boolean }) {
  const reducir = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id = useId();
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div ref={(e) => void (etiquetasDe(id).ref = e)} className={`${etiqueta} text-[#0e4d7a]`} style={{ opacity: 0 }}>
          Referencia
        </div>
        <div ref={(e) => void (etiquetasDe(id).tiempo = e)} className={`${etiqueta} rounded-full bg-[#02223b] px-3 py-1.5 text-white shadow-[0_6px_18px_rgba(2,34,59,0.25)]`} style={{ opacity: 0 }}>
          <span className="text-[#a8cf45]">Reacción</span> <span ref={(e) => void (etiquetasDe(id).tiempoTxt = e)} className="ml-1 text-[12px] tracking-[0.06em]" />
        </div>
      </div>
      <Lienzo
        respaldo={<Respaldo src="/3d/respaldo/discos.webp" />}
        frameloop={activo ? "always" : "never"}
        shadows
        camera={{ fov: 30 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      >
        <OjoEstudio />
        <CamaraHero />
        <Escena id={id} reducir={reducir} />
      </Lienzo>
    </div>
  );
}
