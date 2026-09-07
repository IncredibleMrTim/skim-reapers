import type { Metadata } from "next"
import { dataset } from "@/sanity/env"

const isProduction = dataset === "production"

/** Dev and production are separate hostnames — see the deploy table in CLAUDE.md. */
const siteUrl = isProduction
  ? "https://skimreapers.co.uk"
  : "https://dev.skimreapers.co.uk"

const siteName = "Skim Reapers Ltd"

/** Square logo mark used as the link-preview image until a proper 1200x630 OG image exists. */
const ogImage = { url: "/logo_dark.webp", width: 345, height: 331 }

type PageMetadata = {
  title: string
  description: string
  robots?: Metadata["robots"]
}

const pageMetadata: Record<string, PageMetadata> = {
  home: {
    title: "Skim Reapers Ltd.",
    description:
      "Skim Reapers Ltd has 20+ years experience in all aspects of plastering and dry lining. We can offer services for both domestic and large commercial projects within the whole of West Yorkshire.  We pride ourselves on excellent quality and service to our customers including a speedy service.",
    robots: isProduction ? undefined : { index: false, follow: false },
  },
  about: {
    title: "About",
    description: "About Skim Reapers",
  },
}

export function createPageMetadata(page: keyof typeof pageMetadata): Metadata {
  const { title, description, robots } = pageMetadata[page]
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImage.url],
    },
  }
}
