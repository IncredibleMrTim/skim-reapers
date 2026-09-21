import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { aboutPageQuery } from "@/sanity/queries"
import type { AboutPageQueryResult } from "@/sanity/types"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"

export default async function AboutPage() {
  const aboutPage = (await client.fetch(aboutPageQuery)) as AboutPageQueryResult

  return (
    <>
      <Header hero={aboutPage?.hero ?? undefined} />

      <section className="relative pt-20 w-full flex justify-end">
        <Image
          className="absolute left-0 top-0 bottom-0 h-full [--mask-pos:center_top] md:[--mask-pos:right_bottom] opacity-15 z-2  self-stretch object-fill"
          style={{
            maskImage:
              "radial-gradient(circle at var(--mask-pos),  black 15%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
          }}
          priority
          width={2000}
          height={2000}
          alt="background"
          src="/uneven-wall-plaster.jpg"
        />

        <div className="flex relative z-10 px-8 w-350">
          <div className="grid grid-cols-[auto_1fr]">
            <div className="p-8">
              <Image
                src="/profile-sm.jpg"
                width={400}
                height={200}
                alt="Test"
                className="border border-white p-1"
              />
            </div>
            <div className="p-8 [&_strong]:font-heading font-inter">
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
