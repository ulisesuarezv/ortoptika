"use client";

/**
 * Barra de luces + gafas de filtros rojo/azul — pieza de la landing de Visión
 * binocular. Los dos objetos son el tratamiento real del consultorio: la barra
 * enciende LED rojos y azules alternos; con las gafas, cada ojo ve un solo color
 * (el filtro rojo apaga las azules y el azul apaga las rojas), así que ver las
 * dos luces pide que los dos ojos trabajen a la vez.
 *
 * El filtro es de verdad: cada lente se dibuja con mezcla multiplicativa sobre
 * lo que hay detrás, como un filtro de color. Una luz azul vista por el lente
 * rojo queda casi negra, sin trucos por luz.
 *
 * Dos modos:
 * - "auto" (hero): de frente y en horizontal, a todo el ancho bajo el texto;
 *   luces en programa alternado y gafas que siguen al cursor.
 * - "scroll" (BarraRecorrido): todo lo manda `barraScroll.p` (0…1). La barra
 *   gira a vertical y diagonal (las gafas se invierten, como en el manual) y al
 *   final apunta a la nariz: las luces vienen de lejos a cerca y la franja
 *   blanca se ve como dos líneas en X que se cruzan en la luz que se mira.
 *
 * El hero va Modelo procedural a partir de las fotos del consultorio (barra de ~91 cm
 * con 12 LED alternos, panel central con dos perillas, trípode con abrazadera).
 * Sin marcas. Las gafas siguen al cursor a lo largo de la barra; sin cursor, se
 * deslizan solas.
 */
import { useId, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { OjoEstudio } from "@/components/three/OjoEscena";
import Lienzo, { Respaldo } from "@/components/three/Lienzo";
import { barraScroll } from "../estadoEscenas";

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------- medidas (1 unidad ≈ 10 cm) ----------
const LARGO = 9.1; // 36"
const ALTO = 0.5; // alto de la barra en el centro
const FONDO = 0.4;
const Y_BARRA = 1.55; // cara superior de la barra sobre la mesa
const N_LED = 12;
const PASO = 0.7; // 2,75"
const ROJO = new THREE.Color("#ff2414");
const AZUL = new THREE.Color("#1f4dff");

const LEDS = Array.from({ length: N_LED }, (_, i) => ({
  x: (i - (N_LED - 1) / 2) * PASO,
  rojo: i % 2 === 0,
}));

// ---------- carcasa: sección redondeada "barrida" a lo largo de la barra ----------
/** Contorno de la sección (y, z) en el centro de la barra: arriba plana, frente algo abombado. */
function seccion() {
  const pts: [number, number][] = [];
  const esquina = (cy: number, cz: number, r: number, a0: number, a1: number) => {
    for (let k = 0; k <= 8; k++) {
      const a = a0 + ((a1 - a0) * k) / 8;
      pts.push([cy + Math.sin(a) * r, cz + Math.cos(a) * r]);
    }
  };
  const d = FONDO / 2,
    rA = 0.05,
    rB = 0.17;
  // recorrido: arriba-delante → abajo-delante → abajo-detrás → arriba-detrás
  esquina(-rA, d - rA, rA, Math.PI / 2, 0);
  // frente abombado
  for (let k = 1; k < 8; k++) {
    const t = k / 8;
    const y = -rA - t * (ALTO - rA - rB);
    pts.push([y, d + 0.035 * Math.sin(Math.PI * t)]);
  }
  esquina(-ALTO + rB, d - rB, rB, 0, -Math.PI / 2);
  esquina(-ALTO + rB, -d + rB, rB, -Math.PI / 2, -Math.PI);
  esquina(-rA, -d + rA, rA, Math.PI, Math.PI / 2);
  return pts;
}

/** Barre la sección a lo largo de x: el fondo se adelgaza hacia las puntas y los extremos se redondean. */
function cuerpoBarra() {
  const sec = seccion();
  const m = sec.length;
  const xs: number[] = [];
  const RR = 0.24; // radio de las puntas
  const n = 120;
  for (let i = 0; i <= n; i++) {
    // más estaciones cerca de las puntas
    const u = i / n;
    const s = Math.sign(u - 0.5) * Math.pow(Math.abs(u - 0.5) * 2, 0.6);
    xs.push((s * LARGO) / 2);
  }
  const pos: number[] = [];
  for (const x of xs) {
    const ax = Math.abs(x);
    const fondo = 1 - 0.36 * ss(0.12, 0.98, ax / (LARGO / 2));
    let k = 1;
    if (ax > LARGO / 2 - RR) {
      const q = (ax - (LARGO / 2 - RR)) / RR;
      k = Math.sqrt(Math.max(0, 1 - q * q));
    }
    const yc = (-ALTO * fondo) / 2;
    for (const [y, z] of sec) {
      const yy = y * fondo;
      pos.push(x, yc + (yy - yc) * k, z * (0.55 + 0.45 * k));
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < xs.length - 1; i++)
    for (let j = 0; j < m; j++) {
      const a = i * m + j,
        b = i * m + ((j + 1) % m),
        c = (i + 1) * m + j,
        d = (i + 1) * m + ((j + 1) % m);
      idx.push(a, c, b, b, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** La cápsula de abajo, donde va la electrónica y se fija el trípode. */
function siluetaCapsula() {
  const s = new THREE.Shape();
  const a = 0.84,
    b = 0.62,
    h = 0.4;
  s.moveTo(-a, 0.1);
  s.lineTo(a, 0.1);
  s.bezierCurveTo(a, -h * 0.55, b + 0.05, -h, b - 0.12, -h);
  s.lineTo(-b + 0.12, -h);
  s.bezierCurveTo(-b - 0.05, -h, -a, -h * 0.55, -a, 0.1);
  return s;
}

function useGeometrias() {
  return useMemo(() => {
    const barra = cuerpoBarra();
    const capsula = new THREE.ExtrudeGeometry(siluetaCapsula(), {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 6,
      curveSegments: 40,
    });
    capsula.translate(0, 0, -0.08);
    // halo de los LED: núcleo apretado, sin bruma
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.14, "rgba(255,255,255,0.85)");
    grad.addColorStop(0.32, "rgba(255,255,255,0.22)");
    grad.addColorStop(0.62, "rgba(255,255,255,0.04)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const halo = new THREE.CanvasTexture(c);
    halo.colorSpace = THREE.SRGBColorSpace;
    return { barra, capsula, halo };
  }, []);
}

const plastico = { color: "#17191c", roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.35 } as const;

function Perilla({ x }: { x: number }) {
  const zf = FONDO / 2 + 0.035;
  return (
    <group position={[x, -0.27, zf]} rotation-x={Math.PI / 2}>
      <mesh castShadow>
        <cylinderGeometry args={[0.085, 0.1, 0.08, 40]} />
        <meshPhysicalMaterial {...plastico} color="#0f1012" />
      </mesh>
      {/* aleta para girarla */}
      <mesh position={[0, 0.055, 0]} rotation-y={0.6}>
        <boxGeometry args={[0.17, 0.045, 0.035]} />
        <meshPhysicalMaterial {...plastico} color="#0f1012" />
      </mesh>
      {/* marcas impresas alrededor */}
      {Array.from({ length: 9 }, (_, k) => {
        const a = -Math.PI * 0.85 + (k / 8) * Math.PI * 1.7;
        return (
          <mesh key={k} position={[Math.sin(a) * 0.15, -0.035, -Math.cos(a) * 0.15]}>
            <boxGeometry args={[0.012, 0.004, 0.012]} />
            <meshBasicMaterial color="#cfcfcf" />
          </mesh>
        );
      })}
    </group>
  );
}

function Boton({ x }: { x: number }) {
  return (
    <mesh position={[x, -0.29, FONDO / 2 + 0.03]} rotation-x={Math.PI / 2}>
      <cylinderGeometry args={[0.036, 0.036, 0.05, 24]} />
      <meshPhysicalMaterial {...plastico} color="#0a0b0c" />
    </mesh>
  );
}

function Tripode() {
  // una pata hacia atrás y dos abiertas a los lados: ninguna apunta a la cámara
  // (de frente, una pata hacia delante se lee como un palo vertical)
  const pies = [
    [0, -0.72],
    [-0.95, 0.38],
    [0.95, 0.38],
  ] as const;
  const cubo = new THREE.Vector3(0, 0.42, 0);
  return (
    <group>
      {/* abrazadera en C y tornillo */}
      <mesh position={[0, Y_BARRA - ALTO - 0.66, -0.02]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.18]} />
        <meshPhysicalMaterial {...plastico} />
      </mesh>
      <mesh position={[0, Y_BARRA - ALTO - 0.98, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
        <meshStandardMaterial color="#2a2c2f" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={cubo} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.14, 20]} />
        <meshPhysicalMaterial {...plastico} />
      </mesh>
      {pies.map(([px, pz], i) => {
        const pie = new THREE.Vector3(px, 0.03, pz);
        const medio = pie.clone().add(cubo).multiplyScalar(0.5);
        const dir = pie.clone().sub(cubo);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return (
          <group key={i}>
            <mesh position={medio} quaternion={q} castShadow>
              <cylinderGeometry args={[0.014, 0.014, dir.length(), 10]} />
              <meshStandardMaterial color="#1a1b1d" roughness={0.4} metalness={0.3} />
            </mesh>
            <mesh position={pie} castShadow>
              <sphereGeometry args={[0.035, 16, 12]} />
              <meshStandardMaterial color="#1a1b1d" roughness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ---------- luces ----------
/** Qué luz está encendida: por grupo de color (alternado) o una sola (secuencial). */
type Luces = { grupo: boolean; valor: number };
/** Alternado: todas las rojas y luego todas las azules (0 = rojas, 1 = azules). */
const alternado = (t: number) => Math.floor(t / 0.9) % 2;
/** Secuencial: una luz a la vez, de un extremo al otro y de vuelta. */
const secuencial = (t: number) => {
  const n = N_LED * 2 - 2;
  const k = Math.floor(t / 0.36) % n;
  return k < N_LED ? k : n - k;
};
/** De lejos a cerca: con la barra hacia la nariz, el extremo +x queda cerca. */
const lejosCerca = (t: number) => Math.floor(t / 0.4) % N_LED;

const haloW = new THREE.Vector3();
const haloD = new THREE.Vector3();
const apagadoR = new THREE.Color("#7d140e");
const apagadoA = new THREE.Color("#c3cdd8");

function Led({ i, x, rojo, halo, luces }: { i: number; x: number; rojo: boolean; halo: THREE.Texture; luces: () => Luces }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const brillo = useRef<THREE.Sprite>(null);
  const base = useRef<THREE.Group>(null);
  const nivel = useRef(0);
  const color = rojo ? ROJO : AZUL;
  useFrame(({ camera }, dt) => {
    const l = luces();
    const on = l.grupo ? l.valor === (rojo ? 0 : 1) : l.valor === i;
    nivel.current = THREE.MathUtils.damp(nivel.current, on ? 1 : 0, 22, dt);
    const n = nivel.current;
    // encendida: el plástico toma el color pleno (sin tone mapping, nítido); apagada: su tono de reposo
    if (mat.current) {
      mat.current.color.copy(rojo ? apagadoR : apagadoA).lerp(color, n);
      mat.current.emissive.copy(color).multiplyScalar(n * 0.45);
    }
    // el halo se adelanta hacia la cámara: no se corta contra la barra y las gafas sí lo tapan
    const b = base.current;
    if (b && brillo.current) {
      b.getWorldPosition(haloW);
      haloD.copy(camera.position).sub(haloW).normalize().multiplyScalar(0.3).add(haloW);
      brillo.current.position.copy(b.worldToLocal(haloD));
      (brillo.current.material as THREE.SpriteMaterial).opacity = n * 0.9;
    }
  });
  return (
    <group ref={base} position={[x, 0.012, 0.03]}>
      {/* casquillo */}
      <mesh>
        <cylinderGeometry args={[0.068, 0.072, 0.024, 28]} />
        <meshStandardMaterial color="#dcdad5" roughness={0.5} />
      </mesh>
      {/* cúpula */}
      <mesh position-y={0.012} scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.056, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial ref={mat} color={rojo ? apagadoR : apagadoA} roughness={0.12} toneMapped={false} />
      </mesh>
      <sprite ref={brillo} renderOrder={1} scale={0.42}>
        <spriteMaterial map={halo} color={color} blending={THREE.AdditiveBlending} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </sprite>
    </group>
  );
}

// ---------- gafas ----------
const R_LENTE = 0.42;
const SEP = 0.98; // distancia entre centros de los lentes
const ESCALA_GAFAS = 0.8;
const DOBLE = THREE.DoubleSide; // al invertir las gafas se ven por detrás

/**
 * Lente con filtro: multiplica lo que hay detrás por su color (el filtro de
 * verdad) y deja un velo muy leve encima, para el brillo del acrílico.
 */
function Lente({ x, filtro, velo }: { x: number; filtro: string; velo: string }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh renderOrder={10}>
        <circleGeometry args={[R_LENTE, 64]} />
        <meshBasicMaterial color={filtro} side={DOBLE} blending={THREE.MultiplyBlending} premultipliedAlpha transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh renderOrder={11} position-z={0.002}>
        <circleGeometry args={[R_LENTE, 64]} />
        <meshBasicMaterial color={velo} side={DOBLE} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh renderOrder={12} position={[-0.14, 0.17, 0.004]} rotation-z={0.7}>
        <planeGeometry args={[0.2, 0.04]} />
        <meshBasicMaterial color="#ffffff" side={DOBLE} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh castShadow>
        <torusGeometry args={[R_LENTE + 0.035, 0.045, 16, 72]} />
        <meshPhysicalMaterial {...plastico} color="#24272b" />
      </mesh>
    </group>
  );
}

function Gafas() {
  return (
    <group>
      <Lente x={-SEP / 2} filtro="#ff1408" velo="#c4161c" />
      <Lente x={SEP / 2} filtro="#0a8cff" velo="#0b6f9a" />
      <mesh position={[0, 0.06, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.045, 0.045, SEP - R_LENTE * 2 + 0.06, 16]} />
        <meshPhysicalMaterial {...plastico} color="#24272b" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (SEP / 2 + R_LENTE + 0.08), 0.12, -0.02]}>
          <boxGeometry args={[0.1, 0.12, 0.06]} />
          <meshPhysicalMaterial {...plastico} color="#24272b" />
        </mesh>
      ))}
    </group>
  );
}

// ---------- encuadre ----------
/**
 * Encuadre automático: desde el centro de `pts`, en la dirección `dir`, busca
 * (bisección) la distancia a la que todos caben con margen.
 */
const v = new THREE.Vector3();
const centroTmp = new THREE.Vector3();
function encuadrar(cam: THREE.PerspectiveCamera, size: { width: number; height: number }, pts: THREE.Vector3[], centro: THREE.Vector3, dir: THREE.Vector3, mx: number, my: number) {
  cam.aspect = size.width / size.height;
  cam.updateProjectionMatrix();
  let lo = 1,
    hi = 80;
  for (let it = 0; it < 20; it++) {
    const d = (lo + hi) / 2;
    cam.position.copy(centro).addScaledVector(dir, d);
    cam.lookAt(centro);
    cam.updateMatrixWorld();
    const cabe = pts.every((p) => (v.copy(p).project(cam), Math.abs(v.x) < mx && Math.abs(v.y) < my));
    if (cabe) hi = d;
    else lo = d;
  }
  cam.position.copy(centro).addScaledVector(dir, hi);
  cam.lookAt(centro);
}

/** Cuánto suben las gafas en el hero al pasar por delante del panel. */
const SALTO = 0.26;

// hero: de frente, algo por encima, la barra a todo el ancho
const CENTRO = new THREE.Vector3(0, Y_BARRA * 0.62, 0);
const DIR = new THREE.Vector3(0, 0.34, 1).normalize();
/**
 * En lienzos estrechos (móvil) la barra entera quedaría diminuta: se encuadra
 * solo el tramo central y las gafas recorren ese tramo.
 */
const tramo = (size: { width: number; height: number }) => Math.min(1, Math.max(0.5, size.width / size.height / 2.6));
function claveHero(k: number) {
  return [
    new THREE.Vector3((-LARGO / 2) * k, Y_BARRA + 0.15, 0),
    new THREE.Vector3((LARGO / 2) * k, Y_BARRA + 0.15, 0),
    new THREE.Vector3((-LARGO / 2) * k, Y_BARRA - ALTO, 0),
    new THREE.Vector3((LARGO / 2) * k, Y_BARRA - ALTO, 0),
    new THREE.Vector3(0, 0, 0.8),
    new THREE.Vector3(0, 0, -0.8),
    // las gafas, levantadas al pasar por el centro, y sus etiquetas
    new THREE.Vector3(0, Y_BARRA + SALTO + 0.55, 0),
  ];
}

function CamaraHero() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    encuadrar(camera as THREE.PerspectiveCamera, size, claveHero(tramo(size)), CENTRO, DIR, 0.94, 0.8);
  }, [camera, size]);
  return null;
}

// ---------- guion del scroll (4 pasos) ----------

/** Pivote de la barra: el centro de su cuerpo (ahí la sujeta el trípode). */
const PIVOTE = new THREE.Vector3(0, Y_BARRA - ALTO / 2, 0);
const DIR_SCROLL = new THREE.Vector3(0, 0.22, 1).normalize();

export function guionBarra(p: number) {
  const nariz = ss(0.77, 0.87, p);
  return {
    /** presencia de las gafas (pasos 2 y 3) */
    gafas: ss(0.25, 0.32, p) * (1 - ss(0.74, 0.79, p)),
    /** paso 2: las gafas recorren la barra */
    desliz: ss(0.3, 0.48, p),
    /** giro en el plano: horizontal → vertical → diagonal de 135°, y de vuelta */
    rz: ((Math.PI / 2) * ss(0.53, 0.6, p) + (Math.PI / 4) * ss(0.65, 0.71, p)) * (1 - nariz),
    /** gafas invertidas (rojo en el ojo izquierdo) mientras la barra está vertical */
    flip: ss(0.55, 0.6, p) * (1 - ss(0.65, 0.7, p)),
    /** paso 4: la barra gira hacia la nariz y la cámara se pone en los ojos */
    nariz,
    /** la franja se ve como dos líneas en X */
    x: ss(0.86, 0.91, p),
    luces: p < 0.27 ? "secuencial" : p < 0.5 ? "alternado" : p < 0.8 ? "secuencial" : "cerca",
  } as const;
}

// ---------- etiquetas DOM ----------
type Etiquetas = {
  rojo: HTMLDivElement | null;
  azul: HTMLDivElement | null;
  xa: SVGLineElement | null;
  xb: SVGLineElement | null;
  xsvg: SVGSVGElement | null;
};
const ETIQUETAS = new Map<string, Etiquetas>();
function etiquetasDe(id: string) {
  let e = ETIQUETAS.get(id);
  if (!e) ETIQUETAS.set(id, (e = { rojo: null, azul: null, xa: null, xb: null, xsvg: null }));
  return e;
}
const proy = new THREE.Vector3();
function aPantalla(p: THREE.Vector3, cam: THREE.Camera, w: number, h: number) {
  proy.copy(p).project(cam);
  return [((proy.x + 1) / 2) * w, ((1 - proy.y) / 2) * h] as const;
}
function colocar(el: HTMLDivElement | null, x: number, y: number, alfa: number, dx: string) {
  if (!el) return;
  el.style.transform = `translate(${x}px, ${y}px) translate(${dx}, -100%)`;
  el.style.opacity = String(alfa);
}

// ---------- escena ----------
/** Las gafas flotan a esta fracción del camino entre la barra y la cámara. */
const K_GAFAS = 0.3;
/**
 * El lienzo es transparente: donde detrás del lente no hay nada, el filtro no
 * tendría qué teñir. Detrás de toda la escena, en los mismos rayos, va un disco
 * del color de la página por cada lente: así el lente se ve rojo o azul sobre el
 * fondo, como el filtro real, y la barra lo tapa donde se cruza.
 */
const LEJOS = 1.9 / (1 - K_GAFAS);
const X_LIM = LARGO / 2 - 0.75;

function Escena({ id, modo, oscuro, reducir }: { id: string; modo: "auto" | "scroll"; oscuro: boolean; reducir: boolean }) {
  const geo = useGeometrias();
  const pivote = useRef<THREE.Group>(null);
  const barra = useRef<THREE.Group>(null);
  const franja = useRef<THREE.MeshStandardMaterial>(null);
  const gafas = useRef<THREE.Group>(null);
  const fondo = useRef<THREE.Group>(null);
  const est = useRef({ u: 0.62, ultimoPuntero: -100, px: 0, aparece: 0, flip: 0, xLed: 0 });
  const luces = useRef<Luces>({ grupo: true, valor: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  const lenteR = useMemo(() => new THREE.Vector3(), []);
  const lenteA = useMemo(() => new THREE.Vector3(), []);
  const pts = useMemo(() => Array.from({ length: 4 }, () => new THREE.Vector3()), []);
  const camA = useMemo(() => new THREE.Vector3(), []);
  const mira = useMemo(() => new THREE.Vector3(), []);
  const leerLuces = () => luces.current;

  useFrame(({ clock, pointer, camera, size }, dt) => {
    const t = clock.elapsedTime;
    const e = est.current;
    const L = luces.current;
    const g = gafas.current;
    const piv = pivote.current;
    const bar = barra.current;
    if (!g || !piv || !bar) return;
    const etq = etiquetasDe(id);
    let presencia = 1;
    let xGafas: number;
    let salto = 0;

    if (modo === "scroll") {
      const G = guionBarra(barraScroll.p);
      // la barra gira en su plano y, al final, hacia la nariz
      piv.rotation.set(0, (-Math.PI / 2) * G.nariz, G.rz);
      piv.updateMatrixWorld();

      // luces según el paso (con menos movimiento: una fija)
      if (G.luces === "alternado") {
        L.grupo = true;
        L.valor = reducir ? 0 : alternado(t);
      } else {
        L.grupo = false;
        L.valor = reducir ? 7 : G.luces === "cerca" ? lejosCerca(t) : secuencial(t);
      }

      // cámara: encuadra la barra girada; en el paso 4 se pone en los ojos del paciente
      for (const [k, q] of [[0, -1], [1, 1]] as const) bar.localToWorld(pts[k].set((q * LARGO) / 2, 0.15, 0));
      bar.localToWorld(pts[2].set(0, -ALTO - 0.4, 0));
      bar.localToWorld(pts[3].set(0, 0.2, 0));
      centroTmp.set(0, 0, 0);
      for (const q of pts) centroTmp.add(q);
      centroTmp.divideScalar(pts.length);
      encuadrar(camera as THREE.PerspectiveCamera, size, pts, centroTmp, DIR_SCROLL, 0.86, 0.8);
      camA.copy(camera.position);
      mira.copy(centroTmp);
      if (G.nariz > 0) {
        // ojos a ~5 cm por encima de la punta cercana, mirando a lo largo de la barra
        // (algo atrás y mirando un poco abajo: la luz más cercana entra entera)
        bar.localToWorld(tmp.set(LARGO / 2 + 1.9, 0.85, 0));
        camA.lerp(tmp, G.nariz);
        bar.localToWorld(tmp.set(-LARGO * 0.18, -0.35, 0));
        mira.lerp(tmp, G.nariz);
        camera.position.copy(camA);
        camera.lookAt(mira);
      }
      // sin esto, project() usaría la matriz de la última prueba del encuadre
      camera.updateMatrixWorld();

      // las gafas: en el paso 2 recorren la barra; en el 3 siguen la luz encendida
      presencia = G.gafas;
      const xLuz = LEDS[L.grupo ? 6 : L.valor].x;
      e.xLed = reducir ? xLuz : THREE.MathUtils.damp(e.xLed, xLuz, 6, dt);
      xGafas = barraScroll.p < 0.5 ? THREE.MathUtils.lerp(-X_LIM * 0.7, X_LIM * 0.7, G.desliz) : e.xLed;
      e.flip = G.flip;

      // la franja blanca se vuelve la X: dos líneas que se cruzan en la luz que se mira
      if (franja.current) franja.current.opacity = 1 - G.x;
      const sv = etq.xsvg;
      if (sv) sv.style.opacity = String(G.x);
      if (G.x > 0) {
        bar.localToWorld(tmp.set(LEDS[L.valor].x, 0.05, 0.03));
        const [px, py] = aPantalla(tmp, camera, size.width, size.height);
        // cada ojo ve la franja desde su lado: las dos imágenes se cruzan en la luz
        const abre = size.width * 0.34;
        for (const [ln, sg] of [[etq.xa, -1], [etq.xb, 1]] as const) {
          if (!ln) continue;
          // desde una esquina de abajo, pasando por la luz y un poco más allá
          ln.setAttribute("x1", String(px + sg * abre));
          ln.setAttribute("y1", String(size.height));
          ln.setAttribute("x2", String(px - 0.3 * sg * abre));
          ln.setAttribute("y2", String(py + 0.3 * (py - size.height)));
        }
      }
    } else {
      piv.rotation.set(0, 0, 0);
      piv.updateMatrixWorld();
      L.grupo = true;
      L.valor = reducir ? 0 : alternado(t);
      const X_MAX = X_LIM * tramo(size) - 0.4;
      // ¿se movió el cursor? entonces manda él; si no, las gafas se deslizan solas
      if (Math.abs(pointer.x - e.px) > 1e-4) {
        e.px = pointer.x;
        e.ultimoPuntero = t;
      }
      let meta: number;
      if (t - e.ultimoPuntero < 3) {
        a.set(-X_MAX, Y_BARRA, 0).project(camera);
        b.set(X_MAX, Y_BARRA, 0).project(camera);
        meta = Math.min(1, Math.max(0, (pointer.x - a.x) / (b.x - a.x)));
      } else {
        meta = reducir ? 0.62 : 0.5 + 0.4 * Math.sin(t * 0.3 + 0.4);
      }
      e.u = reducir ? meta : THREE.MathUtils.damp(e.u, meta, 3.5, dt);
      xGafas = THREE.MathUtils.lerp(-X_MAX, X_MAX, e.u);
      // al pasar por el centro, las gafas suben un poco: tapan los LED con la mitad
      // de abajo y dejan ver el panel (perillas y botones)
      salto = SALTO * (1 - ss(0.55, 1.5, Math.abs(xGafas)));
    }

    // las gafas, entre la cámara y el punto de la fila de LED que tapan
    bar.localToWorld(tmp.set(xGafas, 0.04 + salto, 0));
    g.position.copy(camera.position).lerp(tmp, 1 - K_GAFAS);
    g.quaternion.copy(camera.quaternion);
    // invertir las gafas = darles la vuelta: el filtro rojo pasa al otro ojo
    g.rotateY(Math.PI * e.flip);
    g.rotateZ(reducir ? 0 : Math.sin(t * 0.8) * 0.025);
    e.aparece = THREE.MathUtils.damp(e.aparece, 1, 3, dt);
    const esc = ESCALA_GAFAS * (0.9 + 0.1 * e.aparece) * presencia;
    g.visible = esc > 0.01;
    g.scale.setScalar(Math.max(esc, 1e-4));
    g.updateMatrixWorld();

    const f = fondo.current;
    if (f) {
      f.visible = g.visible;
      f.position.copy(camera.position).lerp(g.position, LEJOS);
      f.quaternion.copy(g.quaternion);
      f.scale.setScalar(g.scale.x * LEJOS);
    }

    // etiquetas: la de la izquierda en pantalla se abre hacia la izquierda
    lenteR.set(-SEP / 2, R_LENTE + 0.16, 0).applyMatrix4(g.matrixWorld);
    lenteA.set(SEP / 2, R_LENTE + 0.16, 0).applyMatrix4(g.matrixWorld);
    const [rx, ry] = aPantalla(lenteR, camera, size.width, size.height);
    const [ax, ay] = aPantalla(lenteA, camera, size.width, size.height);
    const alfa = e.aparece * ss(0.6, 0.95, presencia);
    colocar(etq.rojo, rx, ry, alfa, rx < ax ? "calc(-100% + 0.6em)" : "-0.6em");
    colocar(etq.azul, ax, ay, alfa, rx < ax ? "-0.6em" : "calc(-100% + 0.6em)");
  });

  return (
    <>
      <group ref={pivote} position={PIVOTE}>
        <group ref={barra} position={[0, Y_BARRA - PIVOTE.y, 0]}>
          <mesh geometry={geo.barra} castShadow receiveShadow>
            <meshPhysicalMaterial {...plastico} />
          </mesh>
          {/* franja blanca de arriba, donde asoman los LED */}
          <mesh position={[0, 0.004, 0.015]}>
            <boxGeometry args={[LARGO - 0.42, 0.01, FONDO - 0.11]} />
            <meshStandardMaterial ref={franja} color="#f1efea" roughness={0.55} transparent />
          </mesh>
          {LEDS.map((l, i) => (
            <Led key={i} i={i} x={l.x} rojo={l.rojo} halo={geo.halo} luces={leerLuces} />
          ))}
          {/* cápsula de abajo */}
          <mesh geometry={geo.capsula} position={[0, -ALTO + 0.08, -0.02]} castShadow>
            <meshPhysicalMaterial {...plastico} />
          </mesh>
          {/* panel: dos perillas, dos botones y la rejilla del altavoz */}
          <Perilla x={-0.45} />
          <Perilla x={0.45} />
          <Boton x={-0.82} />
          <Boton x={0.84} />
          {[-0.066, -0.022, 0.022, 0.066].map((x) => (
            <mesh key={x} position={[x, -0.24, FONDO / 2 + 0.034]}>
              <boxGeometry args={[0.02, 0.1, 0.012]} />
              <meshBasicMaterial color="#050505" />
            </mesh>
          ))}
        </group>
      </group>

      {/* en el recorrido la barra gira y se sostiene en la mano: sin trípode ni sombra */}
      {modo === "auto" && <Tripode />}

      <group ref={fondo}>
        {[-1, 1].map((s) => (
          <mesh key={s} position-x={(s * SEP) / 2}>
            <circleGeometry args={[R_LENTE + 0.01, 64]} />
            <meshBasicMaterial color={oscuro ? "#dfe6ee" : "#f6f2ea"} side={DOBLE} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <group ref={gafas}>
        <Gafas />
      </group>

      {/* la barra no se mueve: la sombra se dibuja una vez y solo toma el trípode */}
      {modo === "auto" && <ContactShadows frames={1} position={[0, 0, 0]} scale={7} blur={2.2} opacity={0.3} far={0.6} color="#02223b" />}
    </>
  );
}

const etiqueta =
  "pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap font-[family-name:var(--font-v2-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] will-change-transform";

export default function BarraLucesEscena({ activo = true, modo = "auto", oscuro = false }: { activo?: boolean; modo?: "auto" | "scroll"; oscuro?: boolean }) {
  const reducir = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id = useId();
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div ref={(e) => void (etiquetasDe(id).rojo = e)} className={`${etiqueta} ${oscuro ? "text-[#ff7a6e]" : "text-[#b3261e]"}`} style={{ opacity: 0 }}>
          Filtro rojo
        </div>
        <div ref={(e) => void (etiquetasDe(id).azul = e)} className={`${etiqueta} ${oscuro ? "text-[#7fb2ff]" : "text-[#0e4d7a]"}`} style={{ opacity: 0 }}>
          Filtro azul
        </div>
        {modo === "scroll" && (
          <svg ref={(e) => void (etiquetasDe(id).xsvg = e)} className="absolute inset-0 h-full w-full" style={{ opacity: 0 }}>
            <line ref={(e) => void (etiquetasDe(id).xa = e)} stroke="#efe8da" strokeWidth={2.5} strokeOpacity={0.8} strokeLinecap="round" />
            <line ref={(e) => void (etiquetasDe(id).xb = e)} stroke="#efe8da" strokeWidth={2.5} strokeOpacity={0.8} strokeLinecap="round" />
          </svg>
        )}
      </div>
      <Lienzo
        respaldo={<Respaldo src={modo === "scroll" ? "/3d/respaldo/barra-luces-recorrido.webp" : "/3d/respaldo/barra-luces.webp"} />}
        frameloop={activo ? "always" : "never"}
        shadows
        camera={{ fov: modo === "scroll" ? 32 : 22 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      >
        <OjoEstudio />
        {modo === "auto" && <CamaraHero />}
        <Escena id={id} modo={modo} oscuro={oscuro} reducir={reducir} />
      </Lienzo>
    </div>
  );
}
