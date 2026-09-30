import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { servicesPageQuery } from "@/sanity/queries"
import type { ServicesPageQueryResult } from "@/sanity/types"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { TabAccordionClient } from "@/components/tabAccordionClient/TabAccordionClient"

export default async function ServicesPage() {
  const query = (await client.fetch(
    servicesPageQuery,
  )) as ServicesPageQueryResult

  return (
    <>
      <Header
        hero={query?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
        floating
      />
      <PageContainer floatingHero fillHeight>
        <div className="flex flex-col gap-4 md:gap-8 w-full md:flex-1 md:min-h-0 font-inter">
          <div className="flex flex-col gap-4 md:gap-8 md:overflow-y-auto md:flex-1 md:min-h-0">
            <div>
              {query?.content && (
                <PortableText
                  value={query.content}
                  components={PORTABLE_TEXT_COMPONENTS}
                />
              )}
            </div>
            <div className="md:mr-8">
              <TabAccordionClient items={query?.services ?? []} />
            </div>
          </div>

          {query?.buttons && (
            <div>
              <CtaButtons buttons={query.buttons} />
            </div>
          )}
        </div>
      </PageContainer>
    </>
  )
}
