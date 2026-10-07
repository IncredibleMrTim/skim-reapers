"use client"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { useLiveSanityData } from "@/sanity/live"
import { workWithUsPageQuery } from "@/sanity/queries"
import type { WorkWithUsPageQueryResult } from "@/sanity/types"

interface WorkWithUsClientProps {
  initialData: WorkWithUsPageQueryResult
}

export const WorkWithUsClient = ({ initialData }: WorkWithUsClientProps) => {
  const query = useLiveSanityData(workWithUsPageQuery, initialData)

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
        footer={query?.buttons && <CtaButtons buttons={query.buttons} />}
      >
        {query?.content && (
          <PortableText
            value={query.content}
            components={PORTABLE_TEXT_COMPONENTS}
          />
        )}
      </PageContainer>
    </>
  )
}
