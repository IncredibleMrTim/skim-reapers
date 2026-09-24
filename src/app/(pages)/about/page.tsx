import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { aboutPageQuery } from "@/sanity/queries"
import type { AboutPageQueryResult } from "@/sanity/types"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { urlForImage } from "@/sanity/image"
import { PageContainer } from "@/components/PageContainer"

export default async function AboutPage() {
  const aboutPage = (await client.fetch(aboutPageQuery)) as AboutPageQueryResult

  return (
    <>
      <Header
        hero={aboutPage?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
        floating
      />

      <PageContainer floatingHero>
        <div className="grid grid-rows-[auto_1fr] md:grid-cols-[auto_1fr] w-full">
          <div className="order-2 md:order-1 p-10 flex flex-col gap-4">
            {aboutPage?.images?.map((image) => (
              <Image
                key={image._key}
                src={urlForImage(image).url()}
                width={400}
                height={200}
                alt=""
                className="border border-white p-1 object-fit"
              />
            ))}
          </div>
          <div className="order-1 md:order-2 p-8 [&_strong]:font-heading font-inter">
            {aboutPage?.about && (
              <PortableText
                value={aboutPage.about}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )}
          </div>
        </div>
      </PageContainer>
    </>
  )
}
