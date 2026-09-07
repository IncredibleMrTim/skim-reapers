import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const ogImageSize = { width: 1200, height: 630 }

/**
 * next/og's renderer (satori + resvg) can't decode WebP, so these read the
 * PNG copies of the Hero assets rather than the .webp originals. Neither
 * depends on request data — read once at module scope.
 */
const [logoData, smokeData, broncoData] = await Promise.all([
  readFile(join(process.cwd(), "public/logo_extracted.png")),
  readFile(join(process.cwd(), "public/smoke_bg.png")),
  readFile(join(process.cwd(), "src/fonts/Bronco.ttf")),
])
const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`
const smokeSrc = `data:image/png;base64,${smokeData.toString("base64")}`

/** Pass to the `fonts` option of ImageResponse so `fontFamily: "Bronco"` resolves. */
export const ogImageFonts = [
  { name: "Bronco", data: broncoData, weight: 400 as const, style: "normal" as const },
]

/** Shared 1200x630 link-preview card used by both opengraph-image and twitter-image routes. */
export function OgImage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og requires a plain <img>, not next/image */}
      <img
        src={smokeSrc}
        width={1500}
        height={1500}
        style={{ position: "absolute", top: -150, left: -150, opacity: 0.35 }}
        alt=""
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og requires a plain <img>, not next/image */}
        <img src={logoSrc} width={342} height={242} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 44,
            fontFamily: "Bronco",
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: "#ece9e4",
            textAlign: "center",
          }}
        >
          Professional Plastering & Dry-Lining Contractors
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#af7c3c",
          }}
        >
          20+ Years Experience — Commercial & Domestic
        </div>
      </div>
    </div>
  )
}
