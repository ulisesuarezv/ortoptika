/**
 * Plantilla compartida de las OG images (1200×630) generadas en build por los
 * `opengraph-image.tsx` de cada segmento (compatibles con output:'export':
 * son route handlers estáticos que se materializan como PNG en `out/`).
 *
 * Lenguaje de marca: fondo crema, titular Fraunces navy, eyebrow Plus Jakarta
 * azul, logo ojo+cerebro real y el lima SOLO como formas (regla AA del lima).
 * Fuentes TTF locales en assets/og-fonts/ (solo se usan en build, no se sirven).
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_CONFIG } from "@/lib/constants";

export const OG_SIZE = { width: 1200, height: 630 };

const BLUE = "#0e4d7a";
const LIME = "#a8cf45";
const NAVY = "#02223b";
const CREAM = "#fbf9f5";

export async function ogImage({
  eyebrow,
  title,
}: {
  /** Kicker corto sobre el titular, ej. "Servicios". */
  eyebrow: string;
  /** Titular grande de la tarjeta (Fraunces). */
  title: string;
}) {
  const root = process.cwd();
  const [fraunces, jakarta, logo] = await Promise.all([
    readFile(join(root, "assets/og-fonts/fraunces-600.ttf")),
    readFile(join(root, "assets/og-fonts/plus-jakarta-700.ttf")),
    readFile(join(root, "public/images/brand/logo-mark-eye-brain.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Jakarta",
        }}
      >
        {/* Formas lima de fondo (acento gráfico, nunca texto) */}
        <div
          style={{
            position: "absolute",
            right: -140,
            bottom: -220,
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: LIME,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 210,
            bottom: -80,
            width: 190,
            height: 190,
            borderRadius: 9999,
            border: `10px solid ${BLUE}`,
            opacity: 0.15,
          }}
        />

        {/* Cabecera: logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${logo}`}
            width={122}
            height={66}
            alt=""
          />
          <div
            style={{
              fontSize: 34,
              letterSpacing: 10,
              color: BLUE,
              display: "flex",
            }}
          >
            ORTOPTIKA
          </div>
        </div>

        {/* Titular */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 940,
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: BLUE,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div style={{ width: 46, height: 8, background: LIME }} />
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: "Fraunces",
              fontSize: title.length > 34 ? 74 : 88,
              lineHeight: 1.05,
              color: NAVY,
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        {/* Pie: profesional + ciudad */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 27,
            color: BLUE,
          }}
        >
          <div style={{ display: "flex" }}>Dra. {SITE_CONFIG.profesional}</div>
          <div style={{ display: "flex", color: NAVY, opacity: 0.45 }}>·</div>
          {/* Doble capa SEO: ciudad de la sede + país (atiende pacientes de
              toda Colombia que viajan a la consulta presencial). */}
          <div style={{ display: "flex" }}>
            {SITE_CONFIG.direccion.ciudad} · {SITE_CONFIG.direccion.pais}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Jakarta", data: jakarta, style: "normal", weight: 700 },
      ],
    },
  );
}
