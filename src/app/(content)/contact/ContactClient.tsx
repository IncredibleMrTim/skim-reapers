"use client"
import { useLiveSanityData } from "@/sanity/live"
import type { ContactPage as ContactPageQueryResult } from "@/sanity/types"
import { contactPageQuery } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import Contact from "@/components/contact/Contact"

interface ContactClientProps {
  initialData: ContactPageQueryResult
}

export const ContactClient = ({ initialData }: ContactClientProps) => {
  const query = useLiveSanityData(contactPageQuery, initialData)
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
        <Contact />
      </PageContainer>
    </>
  )
}
