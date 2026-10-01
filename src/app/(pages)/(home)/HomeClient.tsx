"use client"

import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { BeliefBar } from "@/components/home/beliefBar/BeliefBar"
import { WhatWeDo } from "@/components/home/whatWeDo/WhatWeDo"
import { ExperienceBar } from "@/components/home/experienceBar/experienceBar"
import { useLiveSanityData } from "@/sanity/live"
import { homePageQuery } from "@/sanity/queries"
import type { HomePageQueryResult } from "@/sanity/types"

interface HomeClientProps {
  initialHomePage: HomePageQueryResult
}

export function HomeClient({ initialHomePage }: HomeClientProps) {
  const homePage = useLiveSanityData(homePageQuery, initialHomePage)

  return (
    <>
      <Header hero={homePage?.hero ?? undefined} />
      <PageContainer hero={homePage?.hero ?? undefined}>
        <div className="hidden md:block w-full">
          <BeliefBar queryResult={homePage?.belief ?? []} />
        </div>
        {homePage?.whatWeDo && <WhatWeDo queryResult={homePage.whatWeDo} />}
        <ExperienceBar />
      </PageContainer>
    </>
  )
}
