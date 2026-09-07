import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

/** SR monogram favicon: S and R from the logo, black on gold, transparent background. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 27,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        paddingBottom: "3px",
      }}
    >
      <span style={{ color: "#000000" }}>S</span>
      <span style={{ color: "#af7c3c" }}>R</span>
    </div>,
    size,
  )
}
