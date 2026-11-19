"use client";

import dynamic from "next/dynamic";
import type { OjoProps } from "./OjoEscena";

// WebGL solo en el cliente (export estático): sin SSR del Canvas.
const OjoEscena = dynamic(() => import("./OjoEscena"), { ssr: false });

export default function Ojo(props: OjoProps & { className?: string; activo?: boolean }) {
  const { className, ...rest } = props;
  return (
    <div className={className}>
      <OjoEscena {...rest} />
    </div>
  );
}
