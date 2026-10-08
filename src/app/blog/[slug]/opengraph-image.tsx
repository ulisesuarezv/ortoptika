import { CLUSTERS, getPost, getPosts } from "@/lib/blog";
import { ogImage, OG_SIZE } from "@/lib/og";

// Una OG image por artículo, con su bloque temático como eyebrow.
// Requerido por output:"export": genera la imagen en build.
export const dynamic = "force-static";

// El route handler de imagen necesita sus propios params estáticos
// (no hereda los del page.tsx del segmento).
export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export const alt = "Artículo del blog de salud visual de Ortoptika";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return ogImage({
    eyebrow: post ? CLUSTERS[post.cluster] : "Blog",
    title: post?.titulo ?? "Salud visual, contada para familias",
  });
}
