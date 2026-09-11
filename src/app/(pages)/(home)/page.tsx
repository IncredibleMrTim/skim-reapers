import { PortableText } from "@portabletext/react"

import Link from "next/link"

import { client } from "@/sanity/client"
import { urlForImage } from "@/sanity/image"
import { homePageQuery } from "@/sanity/queries"
import { WhatWeDo } from "@/components/whatWeDo/WhatWeDo"

export default async function Home() {
  const homePage = await client.fetch(homePageQuery)

  if (!homePage) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
          No home page content yet — add it in{" "}
          <Link
            href="/admin"
            className="font-medium text-zinc-950 dark:text-zinc-50"
          >
            /admin
          </Link>
          .
        </p>
      </div>
    )
  }

  const imageUrl = homePage.image
    ? urlForImage(homePage.image).width(1600).url()
    : null
  const videoUrl = homePage.video?.asset?.url as string | undefined

  return (
    <div className="w-full mx-auto">
      <main className="mx-auto">
        <WhatWeDo />
        {/* <div className="flex mx-auto w-full pl-200">
          {homePage.heading && (
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {homePage.heading}
            </h1>
          )}
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- static export has no Image Optimization API
            <img
              src={imageUrl}
              alt=""
              className="w-full rounded-lg object-cover"
            />
          )}
          {homePage.body && (
            <div className="flex flex-col gap-4 text-lg leading-8 text-shadow-brand-accent-foreground dark:text-zinc-400">
              <PortableText value={homePage.body} />
            </div>
          )}
          {videoUrl && (
            <video controls className="w-full rounded-lg" src={videoUrl} />
          )}
        </div> */}
      </main>
    </div>
  )
}
