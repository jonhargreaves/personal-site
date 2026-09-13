import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Jon Hargreaves — Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse supports WOFF, but not the WOFF2 font used by the site.
const [font, logo] = await Promise.all([
  readFile(
    join(process.cwd(), "app/fonts/ABCDiatypeMono/ABCDiatypeMono-Regular.woff"),
  ),
  readFile(join(process.cwd(), "public/logo.svg")),
]);

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#000000",
          color: "#ffffff",
          display: "flex",
          fontFamily: "ABCDiatypeMono",
          fontSize: 48,
          fontWeight: 400,
          height: "100%",
          justifyContent: "center",
          padding: 80,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
          }}
        >
          {/* ImageResponse embeds the same SVG logo used at the top of the site. */}
          <img
            src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
            alt=""
            width={72}
            height={72}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>Jon Hargreaves</div>
            <div style={{ color: "rgba(255,255,255,0.62)" }}>
              Product Designer
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "ABCDiatypeMono", data: font, weight: 400, style: "normal" },
      ],
    },
  );
}
