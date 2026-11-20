"use client";

/**
 * Tablero de cuentas para planchar — pieza de la landing de Optometría pediátrica.
 *
 * Objeto real del consultorio: tabla transparente de pivotes y tubitos de
 * colores que los niños colocan uno a uno copiando un modelo (lo usa la doctora
 * en terapia). La figura NO es la de la foto de referencia (personaje con
 * derechos): es un ojo en píxeles con la paleta de Ortoptika.
 *
 * Dos modos:
 * - "auto" (hero): las cuentas saltan del montón al tablero y arman el ojo; se
 *   sostiene, se vacía y vuelve a empezar.
 * - "scroll" (CuentasRecorrido): todo lo manda `cuentasScroll.p` (0…1); una
 *   cuenta queda fuera de lugar en el paso 3 y luego salta a su sitio.
 *
 * Modelo procedural con instancias (pivotes, cuentas del dibujo y del montón) y
 * la luz de la home. Etiquetas en DOM proyectado (no `Html` de drei).
 */
import { useId, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { OjoEstudio } from "@/components/three/OjoEscena";
import Lienzo, { Respaldo } from "@/components/three/Lienzo";

export const cuentasScroll = { p: 0 };

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const azar = (k: number) => {
  const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

// ---------- el dibujo (21 × 13) ----------
/** N contorno · W blanco · A iris · L aro lima · K pupila · . vacío */
export const DIBUJO = [
  ".........NNN.........",
  "......NNNWWWNNN......",
  "....NNWWWAAAWWWNN....",
  "...NWWWAAAAAAAWWWN...",
  "..NWWWWALLLLLAWWWWN..",
  ".NWWWWAALWKKLAAWWWWN.",
  "NWWWWWAALKKKLAAWWWWWN",
  ".NWWWWAALKKKLAAWWWWN.",
  "..NWWWWALLLLLAWWWWN..",
  "...NWWWAAAAAAAWWWN...",
  "....NNWWWAAAWWWNN....",
  "......NNNWWWNNN......",
  ".........NNN.........",
];
export const COLOR: Record<string, string> = { N: "#0b2236", W: "#f3efe6", A: "#2f7fb8", L: "#a8cf45", K: "#081420" };
const MONTON_COLORES = ["#0b2236", "#f3efe6", "#2f7fb8", "#a8cf45", "#f3efe6", "#2f7fb8"];

// ---------- medidas (en pasos de pivote; todo el grupo se escala por P) ----------
export const P = 0.36;
export const LADO = 23; // pivotes por lado
export const MITAD = (LADO - 1) / 2;
export const PLACA = LADO + 0.6;
export const MESA = -0.35; // cara inferior de la placa = la mesa
export const BR_IN = 0.23,
  BR_OUT = 0.46,
  BH = 0.86;
export const C0 = 1,
  F0 = 5; // celda (0,0) del dibujo en el tablero

export const enTablero = (i: number, j: number) => new THREE.Vector3(i - MITAD, BH / 2, j - MITAD);

type Cuenta = { destino: THREE.Vector3; color: THREE.Color; origen: THREE.Vector3; giro: number; alto: number };
const CUENTAS: Cuenta[] = [];
{
  const celdas: { i: number; j: number; c: string; d: number }[] = [];
  DIBUJO.forEach((fila, r) =>
    [...fila].forEach((c, k) => {
      if (c === ".") return;
      const x = k - 10,
        y = r - 6;
      celdas.push({ i: C0 + k, j: F0 + r, c, d: Math.hypot(x, y * 1.4) + azar(r * 31 + k) * 1.2 });
    }),
  );
  // del centro hacia afuera: el ojo «crece» desde la pupila
  celdas.sort((a, b) => a.d - b.d);
  celdas.forEach((c, n) => {
    const a = azar(n + 7) * Math.PI * 2,
      rr = 0.4 + azar(n + 3) * 1.8;
    CUENTAS.push({
      destino: enTablero(c.i, c.j),
      color: new THREE.Color(COLOR[c.c]),
      origen: new THREE.Vector3(MITAD + 4.2 + Math.cos(a) * rr, MESA + BR_OUT, 8 + Math.sin(a) * rr),
      giro: azar(n + 11) * Math.PI * 2,
      alto: 2.6 + azar(n + 5) * 1.6,
    });
  });
}
const N = CUENTAS.length;
const VUELO = 7; // cuántas cuentas van en el aire a la vez

/** La cuenta que se coloca mal en el paso 3: una blanca del borde derecho, fuera de la figura. */
const ERROR = (() => {
  for (let n = Math.floor(N * 0.58); n < N; n++) {
    const d = CUENTAS[n].destino;
    const k = Math.round(d.x + MITAD) - C0,
      r = Math.round(d.z + MITAD) - F0;
    const fila = DIBUJO[r];
    if (fila[k] === "W" && k > 10 && r > 0 && (fila[k + 3] ?? ".") === "." && (DIBUJO[r - 1][k + 3] ?? ".") === "." && k + C0 + 3 < LADO)
      return { n, mal: enTablero(k + C0 + 3, r + F0 - 1) };
  }
  return { n: Math.floor(N * 0.6), mal: enTablero(LADO - 1, MITAD) };
})();

// montón de cuentas sueltas junto al tablero
const MONTON = Array.from({ length: 44 }, (_, n) => {
  const a = azar(n + 101) * Math.PI * 2,
    rr = Math.sqrt(azar(n + 202)) * 2.8;
  const capa = n > 30 ? 1 : 0;
  return {
    pos: new THREE.Vector3(MITAD + 4.2 + Math.cos(a) * rr, MESA + BR_OUT + capa * 0.55, 8 + Math.sin(a) * rr * 0.9),
    giro: azar(n + 303) * Math.PI * 2,
    vuelco: Math.PI / 2 + (azar(n + 404) - 0.5) * 0.5,
    color: new THREE.Color(MONTON_COLORES[n % MONTON_COLORES.length]),
  };
});

// tarjeta del modelo, de pie y algo recostada detrás del tablero
const TARJ = { w: 15, h: 10.2, inc: 0.3, pos: new THREE.Vector3(-3, 0, -MITAD - 2.2) };
const tarjBase = TARJ.pos.clone().setY(MESA);
const tarjArriba = new THREE.Vector3(tarjBase.x, MESA + TARJ.h * Math.cos(TARJ.inc), tarjBase.z - TARJ.h * Math.sin(TARJ.inc));

// ---------- encuadre ----------
const w = (v: THREE.Vector3) => v.clone().multiplyScalar(P);
const ESQ = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
].map(([a, b]) => new THREE.Vector3((a * PLACA) / 2, 0, (b * PLACA) / 2));
const PT_TABLERO = [...ESQ, ...ESQ.map((e) => e.clone().setY(BH))].map(w);
const PT_TARJETA = [
  new THREE.Vector3(tarjArriba.x - TARJ.w / 2, tarjArriba.y, tarjArriba.z),
  new THREE.Vector3(tarjArriba.x + TARJ.w / 2, tarjArriba.y, tarjArriba.z),
].map(w);
const PT_MONTON = [new THREE.Vector3(MITAD + 7.2, MESA, 8), new THREE.Vector3(MITAD + 2, MESA, 11), new THREE.Vector3(MITAD + 4.2, MESA, 5)].map(w);

type Plano = { p: number; dir: THREE.Vector3; pts: THREE.Vector3[]; margen: number };
const PLANOS: Plano[] = [
  { p: 0, dir: new THREE.Vector3(0.95, 1.05, 1.1), pts: [...PT_TABLERO, ...PT_TARJETA, ...PT_MONTON], margen: 0.82 }, // 1 · la mesa de trabajo
  { p: 0.32, dir: new THREE.Vector3(0.75, 0.62, 1.0), pts: [...PT_TABLERO, ...PT_MONTON], margen: 0.86 }, // 2 · bajo, desde el montón
  { p: 0.6, dir: new THREE.Vector3(-0.35, 0.95, 1.15), pts: [...PT_TABLERO, ...PT_TARJETA, ...PT_MONTON], margen: 0.86 }, // 3 · el modelo y la copia
  { p: 0.86, dir: new THREE.Vector3(0.08, 1.7, 0.42), pts: [...PT_TABLERO, ...PT_TARJETA], margen: 0.86 }, // 4 · desde arriba: el ojo
].map((pl) => ({ ...pl, dir: pl.dir.normalize() }));

const centroDe = (pts: THREE.Vector3[]) => pts.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(pts.length);
const v = new THREE.Vector3();
/** Distancia (bisección) a la que todos los puntos caben con margen, mirando a `centro` desde `dir`. */
function distancia(cam: THREE.PerspectiveCamera, centro: THREE.Vector3, dir: THREE.Vector3, pts: THREE.Vector3[], margen: number) {
  let lo = 1,
    hi = 80;
  for (let k = 0; k < 18; k++) {
    const d = (lo + hi) / 2;
    cam.position.copy(centro).addScaledVector(dir, d);
    cam.lookAt(centro);
    cam.updateMatrixWorld();
    if (pts.every((p) => (v.copy(p).project(cam), Math.abs(v.x) < margen && Math.abs(v.y) < margen))) hi = d;
    else lo = d;
  }
  return hi;
}
const cA = new THREE.Vector3(),
  cB = new THREE.Vector3(),
  dI = new THREE.Vector3();
function encuadrarScroll(cam: THREE.PerspectiveCamera, size: { width: number; height: number }, p: number) {
  cam.aspect = size.width / size.height;
  cam.updateProjectionMatrix();
  let i = 0;
  while (i < PLANOS.length - 2 && p > PLANOS[i + 1].p) i++;
  const a = PLANOS[i],
    b = PLANOS[i + 1];
  const t = ss(a.p, b.p, p);
  cA.copy(centroDe(a.pts));
  cB.copy(centroDe(b.pts));
  const da = distancia(cam, cA, a.dir, a.pts, a.margen);
  const db = distancia(cam, cB, b.dir, b.pts, b.margen);
  cA.lerp(cB, t);
  dI.copy(a.dir).lerp(b.dir, t).normalize();
  cam.position.copy(cA).addScaledVector(dI, THREE.MathUtils.lerp(da, db, t));
  cam.lookAt(cA);
  cam.updateMatrixWorld();
}

/** Guion del recorrido: cuántas cuentas van puestas y qué pasa con la equivocada. */
export function guionScroll(p: number) {
  const f = 0.45 * ss(0.27, 0.5, p) + 0.37 * ss(0.52, 0.7, p) + 0.18 * ss(0.77, 0.9, p);
  return {
    puestas: f * (N + VUELO),
    corrige: ss(0.71, 0.76, p),
    marca: ss(0.56, 0.62, p) * (1 - ss(0.72, 0.75, p)),
    modelo: ss(0.5, 0.56, p) * (1 - ss(0.8, 0.86, p)),
  };
}

// ---------- geometrías ----------
export function geoCuenta() {
  const r = 0.11;
  const pts: THREE.Vector2[] = [new THREE.Vector2(BR_IN, 0.05), new THREE.Vector2(BR_IN + 0.05, 0)];
  const arco = (cx: number, cy: number, a0: number, a1: number) => {
    for (let k = 0; k <= 5; k++) {
      const a = a0 + ((a1 - a0) * k) / 5;
      pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  };
  arco(BR_OUT - r, r, -Math.PI / 2, 0);
  arco(BR_OUT - r, BH - r, 0, Math.PI / 2);
  pts.push(new THREE.Vector2(BR_IN + 0.05, BH), new THREE.Vector2(BR_IN, BH - 0.05), new THREE.Vector2(BR_IN, 0.05));
  const g = new THREE.LatheGeometry(pts, 28);
  g.translate(0, -BH / 2, 0);
  g.computeVertexNormals();
  return g;
}

function texturaModelo() {
  const c = document.createElement("canvas");
  const S = 40;
  c.width = 22 * S + 2 * S;
  c.height = Math.round((c.width * TARJ.h) / TARJ.w);
  const x = c.getContext("2d")!;
  x.fillStyle = "#fbf8f2";
  x.fillRect(0, 0, c.width, c.height);
  const ox = S * 1.5,
    oy = (c.height - 13 * S) / 2 + S * 0.2;
  // rejilla tenue, como en las plantillas impresas
  x.fillStyle = "#e4ddd0";
  for (let r = -1; r < 14; r++) for (let k = -1; k < 22; k++) {
    x.beginPath();
    x.arc(ox + k * S + S / 2, oy + r * S + S / 2, S * 0.09, 0, Math.PI * 2);
    x.fill();
  }
  DIBUJO.forEach((fila, r) =>
    [...fila].forEach((ch, k) => {
      if (ch === ".") return;
      const cx = ox + k * S + S / 2,
        cy = oy + r * S + S / 2;
      x.fillStyle = COLOR[ch];
      x.beginPath();
      x.arc(cx, cy, S * 0.44, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = ch === "W" ? "#d6cfc1" : "rgba(255,255,255,.28)";
      x.beginPath();
      x.arc(cx, cy, S * 0.17, 0, Math.PI * 2);
      x.fill();
      if (ch === "W") {
        x.strokeStyle = "#d6cfc1";
        x.lineWidth = 2;
        x.beginPath();
        x.arc(cx, cy, S * 0.44, 0, Math.PI * 2);
        x.stroke();
      }
    }),
  );
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// ---------- etiquetas DOM ----------
type Etiquetas = { modelo: HTMLDivElement | null; error: HTMLDivElement | null };
const ETIQUETAS = new Map<string, Etiquetas>();
function etiquetasDe(id: string) {
  let e = ETIQUETAS.get(id);
  if (!e) ETIQUETAS.set(id, (e = { modelo: null, error: null }));
  return e;
}
const proy = new THREE.Vector3();
function colocar(el: HTMLDivElement | null, p: THREE.Vector3, cam: THREE.Camera, ancho: number, alto: number, dx: string, dy: number, alfa: number) {
  if (!el) return;
  proy.copy(p).multiplyScalar(P).project(cam);
  const x = ((proy.x + 1) / 2) * ancho;
  // si va a la derecha y no cabe (móvil), sube encima de la cuenta
  if (dx === "24px" && x + el.offsetWidth + 32 > ancho) {
    dx = `calc(-50% - ${Math.max(0, x + el.offsetWidth / 2 + 12 - ancho)}px)`;
    dy -= 26;
  }
  el.style.transform = `translate(${x}px, ${((1 - proy.y) / 2) * alto + dy}px) translate(${dx}, -50%)`;
  el.style.opacity = String(alfa);
}

const o = new THREE.Object3D();
o.rotation.order = "YXZ";

function Escena({ id, modo, oscuro, reducir }: { id: string; modo: "auto" | "scroll"; oscuro: boolean; reducir: boolean }) {
  const cuentas = useRef<THREE.InstancedMesh>(null);
  const monton = useRef<THREE.InstancedMesh>(null);
  const pivotes = useRef<THREE.InstancedMesh>(null);
  const aro = useRef<THREE.Mesh>(null);
  const matAro = useRef<THREE.MeshBasicMaterial>(null);
  const grupo = useRef<THREE.Group>(null);
  const est = useRef({ puestas: 0, corrige: 0, marca: 0, modelo: 0, clave: "" });
  const geo = useMemo(() => geoCuenta(), []);
  const tex = useMemo(() => texturaModelo(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // instancias fijas: pivotes y montón; colores de las cuentas del dibujo
  useLayoutEffect(() => {
    const pv = pivotes.current,
      mo = monton.current,
      cu = cuentas.current;
    if (!pv || !mo || !cu) return;
    o.rotation.set(0, 0, 0);
    o.scale.setScalar(1);
    let n = 0;
    for (let j = 0; j < LADO; j++)
      for (let i = 0; i < LADO; i++) {
        o.position.set(i - MITAD, 0.3, j - MITAD);
        o.updateMatrix();
        pv.setMatrixAt(n++, o.matrix);
      }
    pv.instanceMatrix.needsUpdate = true;
    MONTON.forEach((m, k) => {
      o.position.copy(m.pos);
      o.rotation.set(m.vuelco, m.giro, 0);
      o.updateMatrix();
      mo.setMatrixAt(k, o.matrix);
      mo.setColorAt(k, m.color);
    });
    mo.instanceMatrix.needsUpdate = true;
    if (mo.instanceColor) mo.instanceColor.needsUpdate = true;
    CUENTAS.forEach((c, k) => cu.setColorAt(k, c.color));
    if (cu.instanceColor) cu.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock, camera, size, pointer }, dt) => {
    const e = est.current;
    let vaciar = 0;
    if (modo === "scroll") {
      const g = guionScroll(cuentasScroll.p);
      const k = reducir ? 1 : 1 - Math.exp(-7 * dt);
      e.puestas += (g.puestas - e.puestas) * k;
      e.corrige += (g.corrige - e.corrige) * k;
      e.marca = g.marca;
      e.modelo = g.modelo;
    } else if (reducir) {
      e.puestas = N + VUELO;
    } else {
      // ciclo: arma (11 s) · se sostiene · se vacía
      const c = clock.elapsedTime % 16;
      e.puestas = Math.min(1, c / 11) * (N + VUELO);
      vaciar = ss(13.6, 15.8, c);
    }

    const cu = cuentas.current;
    if (cu) {
      for (let k = 0; k < N; k++) {
        const c = CUENTAS[k];
        const u = Math.min(1, Math.max(0, (e.puestas - k) / VUELO));
        let esc = u > 0 ? 1 : 0;
        const meta = modo === "scroll" && k === ERROR.n ? tmp.copy(ERROR.mal).lerp(c.destino, e.corrige) : c.destino;
        if (u >= 1) {
          o.position.copy(meta);
          if (modo === "scroll" && k === ERROR.n) o.position.y += Math.sin(Math.PI * e.corrige) * 1.6;
          o.rotation.set(0, 0, 0);
        } else {
          const q = u * u * (3 - 2 * u);
          o.position.lerpVectors(c.origen, meta, q);
          o.position.y += Math.sin(Math.PI * u) * c.alto;
          o.rotation.set((Math.PI / 2) * (1 - q), c.giro * (1 - q), 0);
        }
        if (vaciar > 0) {
          const s = 1 - ss((k / N) * 0.6, (k / N) * 0.6 + 0.4, vaciar);
          esc *= s;
          o.position.y += (1 - s) * 0.8;
        }
        o.scale.setScalar(Math.max(esc, 1e-4));
        o.updateMatrix();
        cu.setMatrixAt(k, o.matrix);
      }
      cu.instanceMatrix.needsUpdate = true;
    }

    // aro que marca la cuenta fuera de lugar
    const colocada = e.puestas - ERROR.n >= VUELO;
    const alfaError = modo === "scroll" && colocada ? e.marca : 0;
    if (aro.current && matAro.current) {
      aro.current.position.set(ERROR.mal.x, 0.03, ERROR.mal.z);
      matAro.current.opacity = alfaError;
      aro.current.visible = alfaError > 0.01;
    }

    if (grupo.current && modo === "auto" && !reducir) {
      grupo.current.rotation.y = THREE.MathUtils.damp(grupo.current.rotation.y, pointer.x * 0.06, 3, dt);
      grupo.current.rotation.x = THREE.MathUtils.damp(grupo.current.rotation.x, -pointer.y * 0.03, 3, dt);
    }

    if (modo === "scroll") {
      const clave = `${cuentasScroll.p.toFixed(4)}|${size.width}x${size.height}`;
      if (clave !== e.clave) {
        e.clave = clave;
        encuadrarScroll(camera as THREE.PerspectiveCamera, size, cuentasScroll.p);
      }
    }

    const etq = etiquetasDe(id);
    colocar(etq.modelo, tarjArriba, camera, size.width, size.height, "-50%", -18, modo === "scroll" ? e.modelo : 0);
    colocar(etq.error, ERROR.mal, camera, size.width, size.height, "24px", 0, alfaError);
  });

  const plastico = oscuro
    ? { color: "#cfe0ec", opacity: 0.16 }
    : { color: "#ffffff", opacity: 0.26 };

  return (
    <group ref={grupo}>
      <group scale={P}>
        {/* placa transparente con sus pivotes y la X de refuerzo por debajo */}
        <RoundedBox args={[PLACA, 0.3, PLACA]} radius={0.12} smoothness={3} position-y={-0.2}>
          <meshPhysicalMaterial {...plastico} transparent roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} depthWrite={false} />
        </RoundedBox>
        {[1, -1].map((s) => (
          <mesh key={s} position-y={-0.3} rotation-y={(s * Math.PI) / 4}>
            <boxGeometry args={[PLACA * 1.36, 0.06, 0.28]} />
            <meshPhysicalMaterial {...plastico} opacity={plastico.opacity * 1.4} transparent roughness={0.2} depthWrite={false} />
          </mesh>
        ))}
        <instancedMesh ref={pivotes} args={[undefined, undefined, LADO * LADO]}>
          <cylinderGeometry args={[0.11, 0.15, 0.6, 10]} />
          <meshPhysicalMaterial {...plastico} opacity={Math.min(1, plastico.opacity * 1.25)} transparent roughness={0.15} clearcoat={1} depthWrite={false} />
        </instancedMesh>

        {/* las cuentas del dibujo (vuelan del montón a su pivote) y el montón */}
        <instancedMesh ref={cuentas} args={[geo, undefined, N]} castShadow frustumCulled={false}>
          <meshPhysicalMaterial roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.25} />
        </instancedMesh>
        <instancedMesh ref={monton} args={[geo, undefined, MONTON.length]} castShadow>
          <meshPhysicalMaterial roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.25} />
        </instancedMesh>

        <mesh ref={aro} rotation-x={-Math.PI / 2} visible={false}>
          <ringGeometry args={[0.62, 0.74, 48]} />
          <meshBasicMaterial ref={matAro} color="#e0893a" transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* la tarjeta con el modelo a copiar */}
        <group position={tarjBase.toArray()} rotation-x={-TARJ.inc}>
          <mesh position-y={TARJ.h / 2}>
            <boxGeometry args={[TARJ.w, TARJ.h, 0.08]} />
            <meshStandardMaterial color="#efe9de" roughness={0.9} />
          </mesh>
          <mesh position={[0, TARJ.h / 2, 0.045]}>
            <planeGeometry args={[TARJ.w - 0.2, TARJ.h - 0.2]} />
            <meshStandardMaterial map={tex} roughness={0.85} />
          </mesh>
        </group>
        <mesh position={[tarjBase.x, MESA + 1.6, tarjBase.z - 3.2]} rotation-x={0.55}>
          <boxGeometry args={[1.2, 4, 0.08]} />
          <meshStandardMaterial color="#e2dacb" roughness={0.9} />
        </mesh>
      </group>
      {!oscuro && <ContactShadows frames={1} position={[0, MESA * P - 0.01, 0]} scale={22} blur={2.4} opacity={0.2} far={2.5} color="#02223b" />}
    </group>
  );
}

/** Hero: de tres cuartos, con el montón delante y el modelo detrás. */
const HERO = { dir: new THREE.Vector3(0.85, 1.15, 1.2).normalize(), pts: [...PT_TABLERO, ...PT_TARJETA, ...PT_MONTON] };
function encuadrarHero(cam: THREE.PerspectiveCamera, size: { width: number; height: number }) {
  cam.aspect = size.width / size.height;
  cam.updateProjectionMatrix();
  const c = centroDe(HERO.pts);
  const d = distancia(cam, c, HERO.dir, HERO.pts, 0.84);
  cam.position.copy(c).addScaledVector(HERO.dir, d);
  cam.lookAt(c);
}
function CamaraHero() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    encuadrarHero(camera as THREE.PerspectiveCamera, size);
  }, [camera, size]);
  return null;
}

const etiqueta =
  "pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap font-[family-name:var(--font-v2-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] will-change-transform";

export default function CuentasEscena({ activo = true, modo = "auto", oscuro = false }: { activo?: boolean; modo?: "auto" | "scroll"; oscuro?: boolean }) {
  const reducir = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id = useId();
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div ref={(e) => void (etiquetasDe(id).modelo = e)} className={`${etiqueta} ${oscuro ? "text-[#a8cf45]" : "text-[#0e4d7a]"}`} style={{ opacity: 0 }}>
          El modelo
        </div>
        <div ref={(e) => void (etiquetasDe(id).error = e)} className={`${etiqueta} text-[#e0893a]`} style={{ opacity: 0 }}>
          Fuera de lugar
        </div>
      </div>
      <Lienzo
        respaldo={<Respaldo src={modo === "scroll" ? "/3d/respaldo/cuentas-recorrido.webp" : "/3d/respaldo/cuentas.webp"} />}
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
