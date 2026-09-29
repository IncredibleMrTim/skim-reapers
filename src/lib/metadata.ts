import type { Metadata } from "next"
import { dataset } from "@/sanity/env"

const isProduction = dataset === "production"

/** Dev and production are separate hostnames — see the deploy table in CLAUDE.md. */
const siteUrl = isProduction
  ? "https://skimreapers.co.uk"
  : "https://dev.skimreapers.co.uk"

const siteName = "Skim Reapers Ltd"

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
  services: {
    title: "Services",
    description: "Services offered by Skim Reapers.",
  },
  commercial: {
    title: "Services",
    description: "Commercial Services offered by Skim Reapers.",
  },
  domestic: {
    title: "Domestic",
    description: "Domestic Services offered by Skim Reapers.",
  },
  ourWork: {
    title: "Our Work",
    description: "View our work.",
  },
  reviews: {
    title: "Our Work",
    description: "Read reviews from our customer.",
  },
  qa: {
    title: "Questions & Answers",
    description: "Questions and Answers from some of our customers.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Contact us for a quote or further information about Skim Reapers.",
  },
  workWithUs: {
    title: "Work With Us",
    description:
      "Interested in joining the team.  Get in touch and lets have a chat",
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
