"use client"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { useLiveSanityData } from "@/sanity/live"
import { qaPageQuery } from "@/sanity/queries"
import type { QaPageQueryResult } from "@/sanity/types"
import { TabAccordionClient } from "@/components/tabAccordionClient/TabAccordionClient"

interface QaClientProps {
  initialData: QaPageQueryResult
}

export const QaClient = ({ initialData }: QaClientProps) => {
  const query = useLiveSanityData(qaPageQuery, initialData)

  const qaItems = (query?.qaLists ?? []).map((qaList) => ({
    _key: qaList._key,
    heading: qaList.heading,
    qaEntries: qaList.items ?? [],
  }))

  return (
    <>
      <Header
        hero={query?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
      />
      <PageContainer
        hero={query?.hero ?? undefined}
        fillHeight
        heading={query?.heading}
        showHeading={query?.showHeading}
        pageDescription={query?.pageDescription}
      >
        <div className="pb-6 md:py-8">
          <p></p>
          <TabAccordionClient items={qaItems} />
        </div>
        {query?.content && (
          <PortableText
            value={query.content}
            components={PORTABLE_TEXT_COMPONENTS}
          />
        )}
        {query?.buttons && (
          <div className="mt-2">
            <CtaButtons buttons={query.buttons} />
          </div>
        )}
      </PageContainer>
    </>
  )
}
