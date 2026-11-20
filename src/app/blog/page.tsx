import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import BlogV2 from "@/components/v2/paginas/BlogV2";

export const metadata: Metadata = buildMetadata({
  title: "Blog de salud visual",
  description:
    "Artículos sobre salud visual infantil, terapia visual, estrabismo y ambliopía, escritos para familias. Muy pronto.",
  path: "/blog/",
  index: false,
});

export default function Page() {
  return (
    <BlogV2 />
  );
}
