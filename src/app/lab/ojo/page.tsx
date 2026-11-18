import type { Metadata } from "next";
import LabOjo from "./LabOjo";

// Laboratorio del ojo 3D (rama feat/ojo-3d). Fuera del sitemap y en noindex.
export const metadata: Metadata = {
  title: "Lab · Ojo 3D",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-primary-950">
      <LabOjo />
    </section>
  );
}
