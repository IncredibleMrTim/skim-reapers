"use client"
import type { ServicesPageQueryResult } from "@/sanity/types"
import { servicesPageQuery } from "@/sanity/queries"
import { useLiveSanityData } from "@/sanity/live"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { TabAccordionClient } from "@/components/tabAccordionClient/TabAccordionClient"
interface ServicesClientProps {
  initialData: ServicesPageQueryResult
}

export const ServicesClient = ({ initialData }: ServicesClientProps) => {
  const query = useLiveSanityData(servicesPageQuery, initialData)

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
        <div>
          {query?.content && (
            <PortableText
              value={query.content}
              components={PORTABLE_TEXT_COMPONENTS}
            />
          )}
        </div>
        <div className="py-4 md:py-8">
          <TabAccordionClient items={query?.services ?? []} />
        </div>
        {query?.buttons && (
          <div>
            <CtaButtons buttons={query.buttons} />
          </div>
        )}
      </PageContainer>
    </>
  )
}
