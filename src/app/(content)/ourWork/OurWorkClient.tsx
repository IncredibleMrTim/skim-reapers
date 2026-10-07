"use client"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { useLiveSanityData } from "@/sanity/live"
import { ourWorkPageQuery } from "@/sanity/queries"
import type { OurWorkPage as OurWorkPageQueryResults } from "@/sanity/types"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"

interface OurWorkClientProps {
  initialData: OurWorkPageQueryResults
}

export const OurWorkClient = ({ initialData }: OurWorkClientProps) => {
  const query = useLiveSanityData(ourWorkPageQuery, initialData)

  return (
    <>
      <Header
        hero={query?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
      />
      <PageContainer hero={query?.hero ?? undefined} fillHeight>
        <div className="md:overflow-y-auto md:flex-1 md:min-h-0 no-scrollbar">
          {query?.content && (
            <PortableText
              value={query.content}
              components={PORTABLE_TEXT_COMPONENTS}
            />
          )}
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
