"use client"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { useLiveSanityData } from "@/sanity/live"
import { commercialPageQuery } from "@/sanity/queries"
import type { CommercialPageQueryResult } from "@/sanity/types"

interface CommercialClientProps {
  initialData: CommercialPageQueryResult
}

export const CommercialClient = ({ initialData }: CommercialClientProps) => {
  const query = useLiveSanityData(commercialPageQuery, initialData)

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
