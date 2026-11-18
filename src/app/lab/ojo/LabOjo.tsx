"use client";

import { useState } from "react";
import Ojo from "@/components/three/Ojo";

export default function LabOjo() {
  const [pupila, setPupila] = useState(0.3);
  return (
    <>
      <Ojo className="absolute inset-0" pupila={pupila} />
      <div className="absolute top-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/10 px-5 py-3 text-xs text-white backdrop-blur">
        <span>Pupila</span>
        <input
          type="range"
          min={0.16}
          max={0.6}
          step={0.01}
          value={pupila}
          onChange={(e) => setPupila(Number(e.target.value))}
          aria-label="Tamaño de la pupila"
        />
        <span className="w-8 tabular-nums">{pupila.toFixed(2)}</span>
      </div>
    </>
  );
}
