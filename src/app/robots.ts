import type { MetadataRoute } from "next"
import { dataset } from "@/sanity/env"

export const dynamic = "force-static"

const isProduction = dataset === "production"

/** Keeps the dev environment out of search engines; production stays open. */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  }
}
