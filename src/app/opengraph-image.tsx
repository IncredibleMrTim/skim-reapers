import { ImageResponse } from "next/og"
import { OgImage, ogImageFonts, ogImageSize } from "@/lib/og-image"

export const dynamic = "force-static"
export const alt = "Skim Reapers Ltd — Professional Plastering & Dry-Lining Contractors"
export const size = ogImageSize
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(<OgImage />, { ...size, fonts: ogImageFonts })
}
