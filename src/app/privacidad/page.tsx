import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import PrivacidadV2 from "@/components/v2/paginas/PrivacidadV2";

export const metadata: Metadata = buildMetadata({
  title: "Política de tratamiento de datos y cookies",
  description:
    "Cómo se tratan los datos personales en ortoptikaterapia.com: qué cookies se usan, con qué finalidad y cómo ejercer tus derechos como titular (Ley 1581 de 2012).",
  path: "/privacidad/",
});

export default function Page() {
  return (
    <PrivacidadV2 />
  );
}
