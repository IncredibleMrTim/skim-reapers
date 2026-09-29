import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { workWithUsPageQuery } from "@/sanity/queries"
import type { WorkWithUsPage as WorkWithUsPageQueryResults } from "@/sanity/types"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"

export default async function OurWorkPage() {
  const query = (await client.fetch(
    workWithUsPageQuery,
  )) as WorkWithUsPageQueryResults

  return (
    <>
      <Header
        hero={query?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
        floating
      />
      <PageContainer floatingHero>
        <div className="flex flex-col gap-4 md:gap-8 w-full font-inter">
          <div>
            {query?.content && (
              <PortableText
                value={query.content}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )}
          </div>

          {query?.buttons && (
            <div className="md:pl-2">
              <CtaButtons buttons={query.buttons} />
            </div>
          )}
        </div>
      </PageContainer>
    </>
  )
}
