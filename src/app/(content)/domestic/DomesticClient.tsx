"use client"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { useLiveSanityData } from "@/sanity/live"
import { domesticPageQuery } from "@/sanity/queries"
import type { DomesticPageQueryResult } from "@/sanity/types"

interface DomesticClientProps {
  initialData: DomesticPageQueryResult
}

export const DomesticClient = ({ initialData }: DomesticClientProps) => {
  const query = useLiveSanityData(domesticPageQuery, initialData)

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
        {query?.content && (
          <PortableText
            value={query.content}
            components={PORTABLE_TEXT_COMPONENTS}
          />
        )}
        {query?.buttons && (
          <div>
            <CtaButtons buttons={query.buttons} />
          </div>
        )}
      </PageContainer>
    </>
  )
}
