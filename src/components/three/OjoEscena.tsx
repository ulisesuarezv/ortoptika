"use client";

/**
 * Ojo 3D en tiempo real (R3F).
 *
 * Estado entero: una esfera con MeshPhysicalMaterial cuyo color se reemplaza por
 * shader; el iris se dibuja con REFRACCIÓN POR PARALLAX (el rayo de vista se
 * refracta en la córnea y se intersecta con el plano del iris), así se ve hundido
 * bajo la córnea sin transmisión real (barata en móvil).
 *
 * Despiece (ojoEstado.p → 1): el ojo se desplaza a la izquierda, gira a 3/4 y se
 * separa en capas a lo largo del eje óptico: córnea, iris (disco real con la
 * misma textura), cristalino y esclera (con la abertura y el interior visible).
 *
 * El iris es una textura POLAR horneada en Blender (x = ángulo, y = radio entre
 * pupila y limbo), lo que permite dilatar la pupila comprimiendo las fibras.
 * Fuente: KayaoCC/contenido/kayao/2026-11-18_serie-ojo-ortoptika/scripts/iris_textura.py
 */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ojoEstado } from "./ojoEstado";

const R_IRIS = 0.5; // radio del limbo sobre la esfera de radio 1
const Z_LIMBO = Math.sqrt(1 - R_IRIS * R_IRIS);
const PROF = 0.16; // profundidad del iris bajo el limbo
const Z_IRIS = Z_LIMBO - PROF;
// Córnea: casquete que pasa por el limbo y sobresale 0.08 sobre la esfera
const CORNEA_C = 0.3888;
const CORNEA_R = 0.6912;
const CORNEA_ANG = Math.asin(R_IRIS / CORNEA_R);
// separación de cada capa en el despiece (eje óptico, +Z = hacia delante)
const SEP = { cornea: 2.3, iris: 1.65, cristalino: 0.95 };
const ZOOM_CAPAS = 1.45; // las piezas internas crecen al separarse (convención de despiece)

export type OjoProps = {
  /** Radio de la pupila relativo al iris (0.18 contraída … 0.55 dilatada). */
  pupila?: number;
  /** Si el ojo sigue el puntero. */
  seguir?: boolean;
  /** Microsacadas y respiración de la pupila. */
  vivo?: boolean;
};

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// muestreo polar sin la costura del atan (compartido por esclera e iris)
const GLSL_POLAR = `
  vec4 polar(sampler2D t, vec2 h, float s) {
    float a1 = atan(h.y, h.x) / 6.2831853 + 0.5;
    float a2 = fract(a1 + 0.5);
    float dxa = abs(dFdx(a1)) < abs(dFdx(a2)) ? dFdx(a1) : dFdx(a2);
    float dya = abs(dFdy(a1)) < abs(dFdy(a2)) ? dFdy(a1) : dFdy(a2);
    return textureGrad(t, vec2(a1, s), vec2(dxa, dFdx(s)), vec2(dya, dFdy(s)));
  }
  vec3 colorIris(sampler2D ci, sampler2D ca, vec2 h, float pupila) {
    float rad = length(h);
    float s = clamp((rad - pupila) / (1.0 - pupila), 0.0, 1.0);
    vec3 ic = polar(ci, h, s).rgb * mix(0.72, 1.18, polar(ca, h, s).r);
    // anillo limbal: oscuro y NÍTIDO (define el redondo del iris)
    ic *= 1.0 - smoothstep(0.88, 0.985, rad) * 0.7;
    return ic;
  }
`;

function Ojo({ pupila = 0.3, seguir = true, vivo = true }: OjoProps) {
  const [iris, altura] = useTexture(
    ["/3d/ojo/iris-color.webp", "/3d/ojo/iris-altura.webp"],
    (ts) => {
      const [c] = ts as THREE.Texture[];
      c.colorSpace = THREE.SRGBColorSpace;
      for (const t of ts as THREE.Texture[]) {
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.anisotropy = 8;
        t.needsUpdate = true;
      }
    },
  );
  const raiz = useRef<THREE.Group>(null); // posición en pantalla + giro 3/4
  const mira = useRef<THREE.Group>(null); // mirada (puntero + sacadas)
  const esclera = useRef<THREE.Mesh>(null);
  const corneaG = useRef<THREE.Group>(null);
  const irisM = useRef<THREE.Mesh>(null);
  const cristalino = useRef<THREE.Mesh>(null);
  const borde = useRef<THREE.Mesh>(null);
  const { camera, pointer, size } = useThree();

  // uniforms en un ref: se mutan cada frame desde useFrame
  const uRef = useRef({
    uIris: { value: iris },
    uAltura: { value: altura },
    uCamObj: { value: new THREE.Vector3() },
    uPupila: { value: pupila },
    uSep: { value: 0 },
  });

  // ---------- esclera (+ iris pintado por parallax cuando el ojo está entero) ----------
  const matEsclera = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      roughness: 0.42,
      envMapIntensity: 1.25,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, uRef.current);
      s.vertexShader = s.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vObj;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
      s.fragmentShader = s.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying vec3 vObj;
          uniform sampler2D uIris; uniform sampler2D uAltura;
          uniform vec3 uCamObj; uniform float uPupila; uniform float uSep;
          const float R_IRIS = ${R_IRIS.toFixed(4)};
          const float Z_LIMBO = ${Z_LIMBO.toFixed(4)};
          const float Z_IRIS = ${Z_IRIS.toFixed(4)};
          const float CORNEA_C = ${CORNEA_C.toFixed(4)};
          ${GLSL_POLAR}`,
        )
        .replace(
          "#include <map_fragment>",
          `
          vec3 p = normalize(vObj);
          bool frente = p.z > Z_LIMBO;
          // en el despiece la abertura queda libre (el iris sale como disco propio)
          if (uSep > 0.001 && frente) discard;

          vec3 esc = vec3(0.95, 0.93, 0.9);
          esc = mix(esc, vec3(0.93, 0.82, 0.8), smoothstep(0.2, -0.9, p.z) * 0.5);
          esc *= mix(1.0, 0.86, smoothstep(Z_LIMBO - 0.1, Z_LIMBO, p.z));

          vec3 col = esc;
          if (!gl_FrontFacing) {
            // interior: retina / coroides, cálido y oscuro
            col = mix(vec3(0.33, 0.07, 0.04), vec3(0.75, 0.32, 0.12), smoothstep(-1.0, 0.2, -p.z) * 0.6);
          } else if (frente) {
            vec3 v = normalize(vObj - uCamObj);
            vec3 nC = normalize(vObj - vec3(0.0, 0.0, CORNEA_C));
            vec3 r = refract(v, nC, 1.0 / 1.376);
            float t = (Z_IRIS - vObj.z) / min(r.z, -1e-3);
            vec2 h = (vObj + r * t).xy / R_IRIS;
            float rad = length(h);
            vec3 ic = colorIris(uIris, uAltura, h, uPupila);
            float pup = 1.0 - smoothstep(uPupila - 0.01, uPupila + 0.015, rad);
            ic = mix(ic, vec3(0.006, 0.008, 0.012), pup);
            // fuera del iris (visto en ángulo a través de la córnea): esclera, borde nítido
            col = mix(ic, esc * 0.9, smoothstep(0.985, 1.0, rad));
          }
          diffuseColor.rgb = col;
          `,
        );
    };
    return m;
  }, []);

  // ---------- iris como disco real (solo en el despiece): agujero = pupila ----------
  const matIris = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide, transparent: true });
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, uRef.current);
      s.vertexShader = s.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vObj;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
      s.fragmentShader = s.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying vec3 vObj;
          uniform sampler2D uIris; uniform sampler2D uAltura; uniform float uPupila; uniform float uSep;
          ${GLSL_POLAR}`,
        )
        .replace(
          "#include <map_fragment>",
          `
          vec2 h = vObj.xy / ${R_IRIS.toFixed(4)};
          float rad = length(h);
          if (rad < uPupila) discard;
          diffuseColor.rgb = gl_FrontFacing ? colorIris(uIris, uAltura, h, uPupila) : vec3(0.05, 0.04, 0.05);
          diffuseColor.a *= smoothstep(0.0, 0.08, uSep);
          `,
        );
    };
    return m;
  }, []);

  // ---------- córnea: reflejos (aditivo) + borde de fresnel que la dibuja en el despiece ----------
  const matCornea = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.02,
        specularIntensity: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        envMapIntensity: 1.4,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const matBorde = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uBorde: { value: 0 }, uColor: { value: new THREE.Color("#c0dbec") } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
            vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform float uBorde; uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
          void main(){ float f = pow(1.0 - abs(dot(normalize(vN), vV)), 2.5);
            gl_FragColor = vec4(uColor * (0.05 + f * 1.3) * uBorde, 1.0); }`,
      }),
    [],
  );

  // ---------- cristalino: lente biconvexa translúcida ----------
  const matCristalino = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e4f0f8",
        roughness: 0.05,
        clearcoat: 1,
        transparent: true,
        opacity: 0,
        envMapIntensity: 1.5,
      }),
    [],
  );

  // mirada: objetivo suavizado + microsacadas
  const mirada = useRef(new THREE.Vector2());
  const sacada = useRef({ off: new THREE.Vector2(), proxima: 0 });
  const tmp = useRef(new THREE.Matrix4());
  const prog = useRef(0);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state, dt) => {
    const r = raiz.current, g = mira.current;
    if (!r || !g || !esclera.current || !corneaG.current || !irisM.current || !cristalino.current) return;
    const u = uRef.current;
    const tt = state.clock.elapsedTime;

    // progreso del scroll suavizado (inercia)
    prog.current += (ojoEstado.p - prog.current) * Math.min(1, dt * 6);
    const p = prog.current;
    const mover = ss(0.0, 0.3, p);
    const sep = ss(0.12, 0.42, p);

    // posición: escritorio → izquierda; móvil (vertical) → arriba
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const aspect = size.width / size.height;
    if (aspect >= 1) {
      r.position.set(-halfH * aspect * 0.58 * mover, 0, 0);
    } else {
      r.position.set(0, halfH * 0.42 * mover, 0);
    }
    r.rotation.set(0.1 * sep, 1.12 * sep, 0); // 3/4: las capas se abren hacia la derecha
    r.scale.setScalar(1 - 0.24 * sep);

    // microsacadas: saltos pequeños cada 0.6–2.2 s
    const sc = sacada.current;
    if (vivo && !reduce.current && tt > sc.proxima) {
      sc.off.set((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.08);
      sc.proxima = tt + 0.6 + Math.random() * 1.6;
    }
    const sigue = (seguir ? 1 : 0) * (1 - 0.85 * sep);
    const k = reduce.current ? 2 : 9;
    mirada.current.x += (pointer.x * 0.55 * sigue + sc.off.x - mirada.current.x) * Math.min(1, dt * k);
    mirada.current.y += (pointer.y * 0.4 * sigue + sc.off.y - mirada.current.y) * Math.min(1, dt * k);
    g.rotation.y = mirada.current.x;
    g.rotation.x = -mirada.current.y;

    // capas
    const zc = 1 + (ZOOM_CAPAS - 1) * sep;
    esclera.current.scale.setScalar(1 - 0.08 * sep);
    corneaG.current.position.z = SEP.cornea * sep - CORNEA_C * (zc - 1) * 0.5;
    corneaG.current.scale.setScalar(1 + (zc - 1) * 0.5); // la córnea ya es grande: crece menos
    irisM.current.scale.setScalar(zc);
    cristalino.current.scale.set(0.36 * zc, 0.36 * zc, 0.16 * zc);
    irisM.current.position.z = Z_IRIS + SEP.iris * sep;
    irisM.current.visible = sep > 0.001;
    cristalino.current.position.z = Z_IRIS - 0.22 + SEP.cristalino * sep;
    (cristalino.current.material as THREE.MeshPhysicalMaterial).opacity = 0.32 * ss(0.0, 0.3, sep);
    cristalino.current.visible = sep > 0.001;
    u.uSep.value = sep;
    if (borde.current) (borde.current.material as THREE.ShaderMaterial).uniforms.uBorde.value = ss(0.1, 0.6, sep);

    // pupila con "respiración" (hippus) muy leve
    const resp = vivo && !reduce.current ? Math.sin(tt * 1.3) * 0.012 + Math.sin(tt * 0.37) * 0.01 : 0;
    u.uPupila.value += (pupila + resp - u.uPupila.value) * Math.min(1, dt * 4);

    // cámara en espacio objeto de la esclera (para el parallax)
    esclera.current.updateWorldMatrix(true, false);
    tmp.current.copy(esclera.current.matrixWorld).invert();
    u.uCamObj.value.copy(camera.position).applyMatrix4(tmp.current);
  });

  return (
    <group ref={raiz}>
      <group ref={mira}>
        <mesh ref={esclera} material={matEsclera}>
          <sphereGeometry args={[1, 128, 96]} />
        </mesh>
        <mesh ref={cristalino} material={matCristalino} scale={[0.36, 0.36, 0.16]} visible={false}>
          <sphereGeometry args={[1, 64, 32]} />
        </mesh>
        <mesh ref={irisM} material={matIris} visible={false}>
          <circleGeometry args={[R_IRIS, 128]} />
        </mesh>
        <group ref={corneaG}>
          <group position={[0, 0, CORNEA_C]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={matCornea}>
              <sphereGeometry args={[CORNEA_R, 96, 32, 0, Math.PI * 2, 0, CORNEA_ANG]} />
            </mesh>
            <mesh ref={borde} material={matBorde}>
              <sphereGeometry args={[CORNEA_R, 96, 32, 0, Math.PI * 2, 0, CORNEA_ANG]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/** Aleja la cámara para que el ojo quepa con margen en cualquier proporción. */
function Encuadre({ margen = 2.1 }: { margen?: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const tanV = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const aspect = size.width / size.height;
    cam.position.set(0, 0, margen / (tanV * Math.min(aspect, 1)));
    cam.updateProjectionMatrix();
  }, [camera, size, margen]);
  return null;
}

export default function OjoEscena(props: OjoProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 30 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
    >
      <Environment resolution={256} frames={1}>
        {/* softbox redondo arriba a la izquierda: el brillo principal en la córnea */}
        <Lightformer form="circle" intensity={4} position={[-3, 3, 4]} scale={2.2} />
        {/* tira lateral derecha, ancha y suave */}
        <Lightformer form="rect" intensity={0.9} position={[4, 0.5, 2]} scale={[2, 4, 1]} rotation-y={-Math.PI / 2.5} />
        {/* relleno frío desde abajo y luz de fondo tenue */}
        <Lightformer form="rect" intensity={0.5} color="#c0dbec" position={[0, -4, 2]} scale={[6, 1, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="ring" intensity={0.5} position={[0, 0, -6]} scale={6} />
      </Environment>
      <Encuadre />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-3, 4, 5]} intensity={2.6} />
      <directionalLight position={[4, -1, 3]} intensity={0.4} color="#c0dbec" />
      <Ojo {...props} />
    </Canvas>
  );
}
