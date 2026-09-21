import Link from "next/link"

import { client } from "@/sanity/client"

import { homePageQuery } from "@/sanity/queries"
import { WhatWeDo } from "@/components/home/whatWeDo/WhatWeDo"
import { BeliefBar } from "@/components/home/beliefBar/BeliefBar"
import { ExperienceBar } from "@/components/home/experienceBar/experienceBar"
import { Header } from "@/components/header/Header"
import { HomePageQueryResult } from "@/sanity/types"

export default async function Home() {
  const homePage = (await client.fetch(homePageQuery)) as HomePageQueryResult

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

  return (
    <>
      <Header hero={homePage.hero ?? undefined} />
      <div className="w-full mx-auto pt-164">
        <main className="mx-auto">
          <div className="hidden md:block w-full">
            <BeliefBar queryResult={homePage.belief ?? []} />
          </div>
          {homePage.whatWeDo && <WhatWeDo queryResult={homePage.whatWeDo} />}
          <ExperienceBar />
        </main>
      </div>
    </>
  )
}
