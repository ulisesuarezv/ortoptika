"use client";

/**
 * «Lo que manda cada ojo» — pieza de la landing de Ambliopía.
 *
 * No hay un objeto propio del consultorio para ambliopía: se reutiliza el
 * tablero de cuentas (CuentasEscena), pero aquí no es la actividad sino LA
 * IMAGEN. El tablero ya armado se dibuja a una textura y un shader lo parte en
 * dos: a un lado, lo que manda el ojo que ve bien (nítido); al otro, lo que
 * manda el ojo ambliope (borroso y apagado). Así no se atribuye efecto
 * terapéutico al objeto: lo que se muestra como tratamiento (gafas, parche o
 * atropina) es lo que tiene evidencia (PEDIG, AAO 2023). Ver
 * ~/Desktop/KayaoCC/docs/ortoptika-v2/ambliopia-research.md.
 *
 * Dos modos:
 * - "auto" (hero): la división sigue al cursor, como un comparador; sin cursor,
 *   se mece sola.
 * - "scroll" (AmbliopiaRecorrido): todo lo manda `ambliopiaScroll.p` (0…1).
 */
import { useId, useLayoutEffect, useMemo, useRef } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { OjoEstudio } from "@/components/three/OjoEscena";
import Lienzo, { Respaldo } from "@/components/three/Lienzo";
import { C0, COLOR, DIBUJO, F0, LADO, MESA, MITAD, P, PLACA, enTablero, geoCuenta } from "./CuentasEscena";

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const ambliopiaScroll = { p: 0 };

/** Estado de la imagen: dónde va la división, cuánto se emborrona y apaga el ojo ambliope, etc. */
type Vista = {
  /** posición de la división en pantalla (0 = izquierda, 1 = derecha) */
  div: number;
  /** desenfoque del lado ambliope (0…1) */
  blur: number;
  /** viveza del lado ambliope (1 = igual que el sano) */
  viva: number;
  /** el ojo que ve bien, tapado (parche o atropina) */
  tapa: number;
  /** visibilidad de la línea divisoria */
  linea: number;
};

/**
 * Guion del recorrido:
 * 1 · cada ojo manda su imagen · 2 · el cerebro se queda con la nítida
 * 3 · las gafas la aclaran en parte · 4 · el ojo sano tapado: el ambliope trabaja
 * y, al final, las dos imágenes se parecen y se funden.
 */
export function guionAmbliopia(p: number): Vista & { etqs: number; suprime: number; gafas: number; parche: number; juntos: number } {
  const suprime = ss(0.28, 0.36, p) * (1 - ss(0.48, 0.55, p));
  const gafas = ss(0.52, 0.6, p);
  const parche = ss(0.77, 0.83, p) * (1 - ss(0.9, 0.95, p));
  const mejora = ss(0.8, 0.92, p);
  const juntos = ss(0.92, 0.98, p);
  return {
    // en el paso 2 el lado sano se come la imagen: el cerebro usa solo ese ojo
    div: 0.5 + 0.5 * suprime,
    blur: 1 - 0.4 * gafas - 0.5 * mejora,
    viva: 0.45 + 0.2 * gafas + 0.35 * mejora,
    tapa: parche,
    linea: (1 - suprime) * (1 - juntos),
    etqs: (1 - suprime) * (1 - juntos),
    suprime,
    gafas,
    parche,
    juntos,
  };
}

// ---------- el tablero ya armado ----------
const o = new THREE.Object3D();
function Tablero({ oscuro }: { oscuro: boolean }) {
  const cuentas = useRef<THREE.InstancedMesh>(null);
  const pivotes = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => geoCuenta(), []);
  const celdas = useMemo(() => {
    const out: { pos: THREE.Vector3; color: THREE.Color }[] = [];
    DIBUJO.forEach((fila, r) =>
      [...fila].forEach((c, k) => {
        if (c !== ".") out.push({ pos: enTablero(C0 + k, F0 + r), color: new THREE.Color(COLOR[c]) });
      }),
    );
    return out;
  }, []);

  useLayoutEffect(() => {
    const pv = pivotes.current,
      cu = cuentas.current;
    if (!pv || !cu) return;
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
    celdas.forEach((c, k) => {
      o.position.copy(c.pos);
      o.updateMatrix();
      cu.setMatrixAt(k, o.matrix);
      cu.setColorAt(k, c.color);
    });
    cu.instanceMatrix.needsUpdate = true;
    if (cu.instanceColor) cu.instanceColor.needsUpdate = true;
  }, [celdas]);

  const plastico = oscuro ? { color: "#cfe0ec", opacity: 0.16 } : { color: "#ffffff", opacity: 0.26 };
  return (
    <group scale={P}>
      <RoundedBox args={[PLACA, 0.3, PLACA]} radius={0.12} smoothness={3} position-y={-0.2}>
        <meshPhysicalMaterial {...plastico} transparent roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} depthWrite={false} />
      </RoundedBox>
      <instancedMesh ref={pivotes} args={[undefined, undefined, LADO * LADO]}>
        <cylinderGeometry args={[0.11, 0.15, 0.6, 10]} />
        <meshPhysicalMaterial {...plastico} opacity={Math.min(1, plastico.opacity * 1.25)} transparent roughness={0.15} clearcoat={1} depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={cuentas} args={[geo, undefined, celdas.length]} castShadow>
        <meshPhysicalMaterial roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.25} />
      </instancedMesh>
    </group>
  );
}

// ---------- la imagen partida (render a textura + shader) ----------
const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const frag = /* glsl */ `
uniform sampler2D tImg;
uniform vec2 uRes;
uniform float uDiv, uBlur, uViva, uTapa, uLinea;
uniform vec3 uLineaCol;
varying vec2 vUv;

// la textura ya sale premultiplicada: la escena se dibuja con mezcla normal sobre un fondo transparente
vec4 pm(vec2 uv) { return texture2D(tImg, uv); }

void main() {
  vec4 c;
  bool ambliope = vUv.x > uDiv;
  if (ambliope && uBlur > 0.001) {
    // desenfoque en disco (ángulo áureo): radio en píxeles según el tamaño del lienzo
    float r = uBlur * min(uRes.x, uRes.y) * 0.022;
    vec4 acc = vec4(0.0);
    const int N = 40;
    for (int i = 0; i < N; i++) {
      float k = (float(i) + 0.5) / float(N);
      float a = float(i) * 2.39996;
      vec2 off = vec2(cos(a), sin(a)) * sqrt(k) * r / uRes;
      acc += pm(vUv + off);
    }
    c = acc / float(N);
  } else {
    c = pm(vUv);
  }
  if (ambliope) {
    // apagada: menos color y menos contraste
    float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
    c.rgb = mix(vec3(l), c.rgb, uViva);
    c *= 0.55 + 0.45 * uViva;
  } else {
    // el ojo que ve bien, tapado: su imagen se va
    c *= 1.0 - 0.88 * uTapa;
  }
  // línea divisoria
  float px = abs(vUv.x - uDiv) * uRes.x;
  float l1 = (1.0 - smoothstep(0.75, 1.75, px)) * uLinea * smoothstep(0.1, 0.16, vUv.y) * (1.0 - smoothstep(0.84, 0.9, vUv.y));
  c = mix(c, vec4(uLineaCol, 1.0), l1 * 0.8);
  // de premultiplicado a recto para el tone mapping y la salida
  vec3 rgb = c.a > 0.0001 ? c.rgb / c.a : vec3(0.0);
  gl_FragColor = vec4(rgb, c.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}
`;

/** Dibuja la escena a la textura y luego la imagen partida en pantalla. */
function pintar(
  gl: THREE.WebGLRenderer,
  camera: THREE.Camera,
  escena: THREE.Scene,
  rt: THREE.WebGLRenderTarget,
  quad: { s: THREE.Scene; m: THREE.ShaderMaterial },
  ortho: THREE.Camera,
  buf: THREE.Vector2,
  v: Vista,
) {
  gl.getDrawingBufferSize(buf);
  if (rt.width !== buf.x || rt.height !== buf.y) rt.setSize(buf.x, buf.y);
  const u = quad.m.uniforms;
  u.uRes.value.copy(buf);
  u.uDiv.value = v.div;
  u.uBlur.value = v.blur;
  u.uViva.value = v.viva;
  u.uTapa.value = v.tapa;
  u.uLinea.value = v.linea;
  gl.setRenderTarget(rt);
  gl.setClearColor(0x000000, 0);
  gl.clear();
  gl.render(escena, camera);
  gl.setRenderTarget(null);
  gl.clear();
  gl.render(quad.s, ortho);
}

function Partida({ vista, oscuro, children }: { vista: () => Vista; oscuro: boolean; children: React.ReactNode }) {
  const escena = useMemo(() => new THREE.Scene(), []);
  const rt = useMemo(() => new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }), []);
  const quad = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        tImg: { value: rt.texture },
        uRes: { value: new THREE.Vector2(1, 1) },
        uDiv: { value: 0.5 },
        uBlur: { value: 1 },
        uViva: { value: 0.5 },
        uTapa: { value: 0 },
        uLinea: { value: 1 },
        uLineaCol: { value: new THREE.Color(oscuro ? "#a8cf45" : "#0e4d7a") },
      },
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
      premultipliedAlpha: true,
      toneMapped: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m);
    mesh.frustumCulled = false;
    const s = new THREE.Scene();
    s.add(mesh);
    return { s, m };
  }, [rt, oscuro]);
  const ortho = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const buf = useMemo(() => new THREE.Vector2(), []);

  useLayoutEffect(() => () => rt.dispose(), [rt]);

  // prioridad 1: este useFrame dibuja la escena (R3F deja de hacerlo solo)
  useFrame(({ gl, camera }) => pintar(gl, camera, escena, rt, quad, ortho, buf, vista()), 1);

  return <>{createPortal(children, escena)}</>;
}

// ---------- cámara ----------
const PT = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
].map(([a, b]) => new THREE.Vector3(((a * PLACA) / 2) * P, 0, ((b * PLACA) / 2) * P));
const v = new THREE.Vector3();
function encuadrar(cam: THREE.PerspectiveCamera, size: { width: number; height: number }, dir: THREE.Vector3, m: number) {
  cam.aspect = size.width / size.height;
  cam.updateProjectionMatrix();
  const c = new THREE.Vector3(0, 0, 0);
  let lo = 1,
    hi = 80;
  for (let k = 0; k < 20; k++) {
    const d = (lo + hi) / 2;
    cam.position.copy(c).addScaledVector(dir, d);
    cam.lookAt(c);
    cam.updateMatrixWorld();
    if (PT.every((p) => (v.copy(p).project(cam), Math.abs(v.x) < m && Math.abs(v.y) < m))) hi = d;
    else lo = d;
  }
  cam.position.copy(c).addScaledVector(dir, hi);
  cam.lookAt(c);
  cam.updateMatrixWorld();
}
/** De frente y desde arriba, algo inclinado: el dibujo se lee entero. */
const DIR_HERO = new THREE.Vector3(0, 1.75, 0.62).normalize();
const DIR_A = new THREE.Vector3(-0.04, 1.75, 0.7).normalize();
const DIR_B = new THREE.Vector3(0.04, 1.85, 0.5).normalize();
const dTmp = new THREE.Vector3();

// ---------- etiquetas DOM ----------
type Etiquetas = { sano: HTMLDivElement | null; ambl: HTMLDivElement | null; extra: HTMLDivElement | null; extraTxt: HTMLSpanElement | null };
const ETIQUETAS = new Map<string, Etiquetas>();
function etiquetasDe(id: string) {
  let e = ETIQUETAS.get(id);
  if (!e) ETIQUETAS.set(id, (e = { sano: null, ambl: null, extra: null, extraTxt: null }));
  return e;
}
function colocar(el: HTMLElement | null, xFrac: number, ancho: number, alfa: number) {
  if (!el) return;
  el.style.transform = `translate(${xFrac * ancho}px, 0) translate(-50%, 0)`;
  el.style.opacity = String(alfa);
}

function Escena({ id, modo, oscuro, reducir }: { id: string; modo: "auto" | "scroll"; oscuro: boolean; reducir: boolean }) {
  const est = useRef({ vista: { div: 0.5, blur: 1, viva: 0.45, tapa: 0, linea: 1 } as Vista, px: 0, ultimo: -100, clave: "" });
  const grupo = useRef<THREE.Group>(null);
  const leer = useMemo(() => () => est.current.vista, []);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    if (modo === "auto") encuadrar(camera as THREE.PerspectiveCamera, size, DIR_HERO, 0.82);
  }, [camera, size, modo]);

  useFrame(({ clock, pointer, camera, size }, dt) => {
    const e = est.current;
    const t = clock.elapsedTime;
    const V = e.vista;
    const etq = etiquetasDe(id);
    let alfaEtq = 1;
    let extra = "";
    let alfaExtra = 0;
    let xExtra = 0.5;

    if (modo === "scroll") {
      const G = guionAmbliopia(ambliopiaScroll.p);
      Object.assign(V, { div: G.div, blur: G.blur, viva: G.viva, tapa: G.tapa, linea: G.linea });
      alfaEtq = G.etqs;
      if (G.suprime > 0.02) {
        extra = "Lo que usa el cerebro";
        alfaExtra = G.suprime;
      } else if (G.parche > 0.02) {
        extra = "Ojo sano tapado";
        alfaExtra = G.parche;
        xExtra = V.div / 2;
      } else if (ambliopiaScroll.p > 0.55 && ambliopiaScroll.p < 0.74) {
        extra = "Con gafas";
        alfaExtra = ss(0.55, 0.6, ambliopiaScroll.p) * (1 - ss(0.7, 0.74, ambliopiaScroll.p));
        xExtra = (1 + V.div) / 2;
      } else if (G.juntos > 0.02) {
        extra = "Los dos ojos";
        alfaExtra = G.juntos;
      }
      // la cámara se desliza un poco entre pasos
      const clave = `${ambliopiaScroll.p.toFixed(4)}|${size.width}x${size.height}`;
      if (clave !== e.clave) {
        e.clave = clave;
        dTmp.copy(DIR_A).lerp(DIR_B, ss(0, 1, ambliopiaScroll.p)).normalize();
        encuadrar(camera as THREE.PerspectiveCamera, size, dTmp, 0.8);
      }
    } else {
      // comparador: la división sigue al cursor; sin cursor, se mece sola
      if (Math.abs(pointer.x - e.px) > 1e-4) {
        e.px = pointer.x;
        e.ultimo = t;
      }
      const meta = reducir ? 0.5 : t - e.ultimo < 3 ? 0.5 + pointer.x * 0.5 : 0.5 + 0.16 * Math.sin(t * 0.45);
      V.div = reducir ? meta : THREE.MathUtils.damp(V.div, Math.min(0.9, Math.max(0.1, meta)), 5, dt);
      V.blur = 1;
      V.viva = 0.45;
      V.tapa = 0;
      V.linea = 1;
      if (grupo.current && !reducir) grupo.current.rotation.y = THREE.MathUtils.damp(grupo.current.rotation.y, pointer.x * 0.04, 3, dt);
    }

    colocar(etq.sano, V.div / 2, size.width, alfaEtq);
    colocar(etq.ambl, (1 + V.div) / 2, size.width, alfaEtq);
    if (etq.extraTxt && etq.extraTxt.textContent !== extra && extra) etq.extraTxt.textContent = extra;
    colocar(etq.extra, xExtra, size.width, alfaExtra);
  });

  return (
    <Partida vista={leer} oscuro={oscuro}>
      <OjoEstudio />
      <group ref={grupo}>
        <Tablero oscuro={oscuro} />
        {!oscuro && <ContactShadows frames={1} position={[0, MESA * P - 0.01, 0]} scale={11} blur={2.4} opacity={0.2} far={2.5} color="#02223b" />}
      </group>
    </Partida>
  );
}

const etiqueta =
  "pointer-events-none absolute left-0 select-none whitespace-nowrap font-[family-name:var(--font-v2-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] will-change-transform";

export default function AmbliopiaEscena({ activo = true, modo = "auto", oscuro = false }: { activo?: boolean; modo?: "auto" | "scroll"; oscuro?: boolean }) {
  const reducir = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id = useId();
  const tono = oscuro ? "text-[#a8cf45]" : "text-[#0e4d7a]";
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div ref={(e) => void (etiquetasDe(id).sano = e)} className={`${etiqueta} top-[6%] ${tono}`} style={{ opacity: 0 }}>
          Ojo que ve bien
        </div>
        <div ref={(e) => void (etiquetasDe(id).ambl = e)} className={`${etiqueta} top-[6%] ${oscuro ? "text-[#b9c9d6]" : "text-[#4d6880]"}`} style={{ opacity: 0 }}>
          Ojo ambliope
        </div>
        <div
          ref={(e) => void (etiquetasDe(id).extra = e)}
          className={`${etiqueta} bottom-[6%] rounded-full px-3 py-1.5 ${oscuro ? "bg-white text-[#02223b]" : "bg-[#02223b] text-white"}`}
          style={{ opacity: 0 }}
        >
          <span ref={(e) => void (etiquetasDe(id).extraTxt = e)} />
        </div>
      </div>
      <Lienzo
        respaldo={<Respaldo src={modo === "scroll" ? "/3d/respaldo/ambliopia-recorrido.webp" : "/3d/respaldo/ambliopia.webp"} />}
        frameloop={activo ? "always" : "never"}
        shadows
        camera={{ fov: 28 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      >
        <Escena id={id} modo={modo} oscuro={oscuro} reducir={reducir} />
      </Lienzo>
    </div>
  );
}
