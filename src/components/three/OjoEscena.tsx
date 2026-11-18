"use client";

/**
 * Ojo 3D en tiempo real (R3F). Una esfera con MeshPhysicalMaterial cuyo color
 * se reemplaza por shader: el iris se dibuja con REFRACCIÓN POR PARALLAX (el
 * rayo de vista se refracta en la córnea y se intersecta con el plano del iris),
 * así el iris se ve hundido bajo la córnea sin transmisión real (barata en móvil).
 * El iris es una textura POLAR horneada en Blender (x = ángulo, y = radio entre
 * pupila y limbo), lo que permite dilatar la pupila comprimiendo las fibras.
 *
 * Fuente del iris: KayaoCC/contenido/kayao/2026-11-18_serie-ojo-ortoptika/scripts/iris_textura.py
 */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";

const R_IRIS = 0.5; // radio del limbo sobre la esfera de radio 1
const Z_LIMBO = Math.sqrt(1 - R_IRIS * R_IRIS);
// Córnea: casquete que pasa por el limbo y sobresale 0.08 (ver cálculo en el commit)
const CORNEA_C = 0.3888;
const CORNEA_R = 0.6912;

export type OjoProps = {
  /** Radio de la pupila relativo al iris (0.18 contraída … 0.55 dilatada). */
  pupila?: number;
  /** Si el ojo sigue el puntero. */
  seguir?: boolean;
  /** Microsacadas y respiración de la pupila. */
  vivo?: boolean;
};

function Ojo({ pupila = 0.3, seguir = true, vivo = true }: OjoProps) {
  const [iris, altura] = useTexture(["/3d/ojo/iris-color.webp", "/3d/ojo/iris-altura.webp"]);
  const grupo = useRef<THREE.Group>(null);
  const ojo = useRef<THREE.Mesh>(null);
  const { camera, pointer } = useThree();

  useMemo(() => {
    iris.colorSpace = THREE.SRGBColorSpace;
    for (const t of [iris, altura]) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.anisotropy = 8;
      t.needsUpdate = true;
    }
  }, [iris, altura]);

  const uniforms = useMemo(
    () => ({
      uIris: { value: iris },
      uAltura: { value: altura },
      uCamObj: { value: new THREE.Vector3() },
      uPupila: { value: pupila },
      uProf: { value: 0.16 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [iris, altura],
  );

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      roughness: 0.42,
      envMapIntensity: 1.25,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      sheen: 0,
    });
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, uniforms);
      s.vertexShader = s.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vObj;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
      s.fragmentShader = s.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          varying vec3 vObj;
          uniform sampler2D uIris; uniform sampler2D uAltura;
          uniform vec3 uCamObj; uniform float uPupila; uniform float uProf;
          const float R_IRIS = ${R_IRIS.toFixed(4)};
          const float Z_LIMBO = ${Z_LIMBO.toFixed(4)};
          const float CORNEA_C = ${CORNEA_C.toFixed(4)};
          vec4 polar(sampler2D t, vec2 h, float s) {
            float a1 = atan(h.y, h.x) / 6.2831853 + 0.5;
            float a2 = fract(a1 + 0.5);
            vec2 uv = vec2(a1, s);
            // derivadas sin la costura del atan
            float dxa = abs(dFdx(a1)) < abs(dFdx(a2)) ? dFdx(a1) : dFdx(a2);
            float dya = abs(dFdy(a1)) < abs(dFdy(a2)) ? dFdy(a1) : dFdy(a2);
            return textureGrad(t, uv, vec2(dxa, dFdx(s)), vec2(dya, dFdy(s)));
          }`,
        )
        .replace(
          "#include <map_fragment>",
          `
          vec3 p = normalize(vObj);
          // esclera: blanco cálido, rosado muy leve hacia atrás, sombra suave junto al limbo
          vec3 esclera = vec3(0.93, 0.905, 0.87);
          esclera = mix(esclera, vec3(0.92, 0.80, 0.78), smoothstep(0.2, -0.9, p.z) * 0.55);
          esclera *= mix(1.0, 0.82, smoothstep(Z_LIMBO - 0.12, Z_LIMBO, p.z));

          // iris por parallax: refractar en la córnea y cortar el plano del iris
          vec3 v = normalize(vObj - uCamObj);
          vec3 nC = normalize(vObj - vec3(0.0, 0.0, CORNEA_C));
          vec3 r = refract(v, nC, 1.0 / 1.376);
          float zI = Z_LIMBO - uProf;
          float t = (zI - vObj.z) / min(r.z, -1e-3);
          vec2 h = (vObj + r * t).xy / R_IRIS;   // coordenadas en el plano del iris
          float rad = length(h);
          float s = clamp((rad - uPupila) / (1.0 - uPupila), 0.0, 1.0);
          vec3 ic = polar(uIris, h, s).rgb;
          float hh = polar(uAltura, h, s).r;
          ic *= mix(0.72, 1.18, hh);
          // borde de la pupila suave y oscuro
          float pup = 1.0 - smoothstep(uPupila - 0.012, uPupila + 0.02, rad);
          ic = mix(ic, vec3(0.006, 0.008, 0.012), pup);
          // anillo limbal: oscurece y funde con la esclera vista a través de la córnea
          float lim = smoothstep(0.86, 1.02, rad);
          ic = mix(ic, esclera * 0.55, smoothstep(0.98, 1.08, rad));
          ic *= 1.0 - lim * 0.55;

          float enIris = smoothstep(Z_LIMBO - 0.006, Z_LIMBO + 0.006, p.z);
          diffuseColor.rgb = mix(esclera, ic, enIris);
          `,
        );
    };
    return m;
  }, [uniforms]);

  // material de la córnea: solo reflejos (aditivo), el difuso negro no suma nada
  const cornea = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.02,
        metalness: 0,
        specularIntensity: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        envMapIntensity: 1.4,
      }),
    [],
  );

  // mirada: objetivo suavizado + microsacadas
  const mirada = useRef(new THREE.Vector2());
  const sacada = useRef({ off: new THREE.Vector2(), proxima: 0 });
  const tmp = useMemo(() => new THREE.Matrix4(), []);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state, dt) => {
    const g = grupo.current;
    if (!g || !ojo.current) return;
    const tt = state.clock.elapsedTime;
    // microsacadas: saltos pequeños cada 0.6–2.2 s
    const sc = sacada.current;
    if (vivo && !reduce.current && tt > sc.proxima) {
      sc.off.set((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.08);
      sc.proxima = tt + 0.6 + Math.random() * 1.6;
    }
    const objetivo = seguir ? pointer : new THREE.Vector2(0, 0);
    const k = reduce.current ? 2 : 9; // las sacadas reales son rápidas
    mirada.current.x += (objetivo.x * 0.55 + sc.off.x - mirada.current.x) * Math.min(1, dt * k);
    mirada.current.y += (objetivo.y * 0.4 + sc.off.y - mirada.current.y) * Math.min(1, dt * k);
    g.rotation.y = mirada.current.x;
    g.rotation.x = -mirada.current.y;

    // pupila con "respiración" (hippus) muy leve
    const resp = vivo && !reduce.current ? Math.sin(tt * 1.3) * 0.012 + Math.sin(tt * 0.37) * 0.01 : 0;
    uniforms.uPupila.value += (pupila + resp - uniforms.uPupila.value) * Math.min(1, dt * 4);

    // cámara en espacio objeto (para el parallax)
    ojo.current.updateWorldMatrix(true, false);
    tmp.copy(ojo.current.matrixWorld).invert();
    uniforms.uCamObj.value.copy(camera.position).applyMatrix4(tmp);
  });

  return (
    <group ref={grupo}>
      <mesh ref={ojo} material={material}>
        <sphereGeometry args={[1, 128, 96]} />
      </mesh>
      <mesh material={cornea} position={[0, 0, CORNEA_C]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry
          args={[CORNEA_R, 96, 32, 0, Math.PI * 2, 0, Math.asin(R_IRIS / CORNEA_R)]}
        />
      </mesh>
    </group>
  );
}

/** Aleja la cámara para que el ojo quepa con margen en cualquier proporción. */
function Encuadre({ margen = 1.3 }: { margen?: number }) {
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
      camera={{ position: [0, 0, 4.6], fov: 30 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
    >
      <Environment resolution={256} frames={1}>
        {/* softbox redondo arriba a la izquierda: el brillo principal en la córnea */}
        <Lightformer form="circle" intensity={4} position={[-3, 3, 4]} scale={2.2} />
        {/* tira lateral derecha: reflejo alargado en la esclera */}
        <Lightformer form="rect" intensity={1.6} position={[4, 0.5, 2]} scale={[0.6, 4, 1]} rotation-y={-Math.PI / 2.5} />
        {/* relleno frío desde abajo y luz de fondo tenue */}
        <Lightformer form="rect" intensity={0.6} color="#c0dbec" position={[0, -4, 2]} scale={[6, 1, 1]} rotation-x={Math.PI / 2} />
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
