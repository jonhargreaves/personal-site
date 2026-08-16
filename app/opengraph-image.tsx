import { ImageResponse } from "next/og";

export const alt = "Jon Hargreaves — Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#000000",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            width: 880,
          }}
        >
          <div
            style={{
              alignItems: "center",
              border: "2px solid rgba(255,255,255,0.6)",
              borderRadius: 999,
              display: "flex",
              fontSize: 28,
              height: 72,
              justifyContent: "center",
              letterSpacing: -1,
              width: 72,
            }}
          >
            JH
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 74, letterSpacing: -3 }}>Jon Hargreaves</div>
            <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 34 }}>
              Product Designer
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
