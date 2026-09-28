import { Suspense } from "react"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { servicesPageQuery } from "@/sanity/queries"
import type { ServicesPageQueryResult } from "@/sanity/types"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { TabsClient } from "@/components/tabsClient/TabsClient"
import { CtaButtons } from "@/components/CtaButtons"

export default async function ServicesPage() {
  const servicePage = (await client.fetch(
    servicesPageQuery,
  )) as ServicesPageQueryResult

  return (
    <>
      <Header
        hero={servicePage?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
        floating
      />
      <PageContainer floatingHero>
        <div className="flex flex-col gap-4 md:gap-8 w-full font-inter">
          <div>
            {servicePage?.content && (
              <PortableText
                value={servicePage.content}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )}
          </div>
          <Suspense fallback={null}>
            <TabsClient items={servicePage?.services ?? []} />
          </Suspense>

          {servicePage?.buttons && (
            <div className="md:pl-2">
              <CtaButtons buttons={servicePage.buttons} />
            </div>
          )}
        </div>
      </PageContainer>
    </>
  )
}
