import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { aboutPageQuery } from "@/sanity/queries"
import type { AboutPageQueryResult } from "@/sanity/types"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { urlForImage } from "@/sanity/image"

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

      <section className="relative pt-20 md:pt-20 w-full overflow-hidden">
        <Image
          className="absolute -top-20 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 max-w-none opacity-40 md:opacity-40 z-9 object-cover [--mask-pos:center_top] md:[--mask-pos:top_left]"
          style={{
            maskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
          }}
          priority
          width={2000}
          height={2000}
          alt="background"
          src="/smoke_bg.webp"
        />

        <div className="flex relative z-10 px-0 md:px-8 md:pl-100 w-full max-w-[1920px] mx-auto">
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
        </div>
      </section>
    </>
  )
}
