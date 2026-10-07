"use client"
import { Header } from "@/components/header/Header"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { urlForImage } from "@/sanity/image"
import { PageContainer } from "@/components/PageContainer"
import { useLiveSanityData } from "@/sanity/live"
import { aboutPageQuery } from "@/sanity/queries"
import type { AboutPageQueryResult } from "@/sanity/types"

interface AboutClientProps {
  initialData: AboutPageQueryResult
}

export const AboutClient = ({ initialData }: AboutClientProps) => {
  const query = useLiveSanityData(aboutPageQuery, initialData)

  return (
    <>
      <Header
        hero={query?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
      />

      <PageContainer hero={query?.hero ?? undefined} fillHeight>
        <div className="grid grid-rows-[auto_1fr] md:grid-cols-[auto_1fr] w-full md:flex-1 md:min-h-0 md:overflow-y-auto no-scrollbar">
          <div className="order-2 md:order-1 p-10 flex flex-col gap-4">
            {query?.images?.map(({ _key, imageFile, imageAlt }) => (
              <Image
                key={_key}
                src={urlForImage(imageFile).url()}
                width={400}
                height={200}
                alt={imageAlt ?? ""}
                loading="eager"
                className="border border-white p-1 object-fit"
              />
            ))}
          </div>
          <div className="order-1 md:order-2 md:pt-8 font-inter">
            {query?.about && (
              <PortableText
                value={query.about}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )}
          </div>
        </div>
      </PageContainer>
    </>
  )
}
