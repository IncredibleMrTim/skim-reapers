"use client"
import { Fragment } from "react"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { useLiveSanityData } from "@/sanity/live"
import { ourWorkPageQuery } from "@/sanity/queries"
import type { OurWorkPageQueryResult } from "@/sanity/types"
import { urlForFile } from "@/sanity/image"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { Gallery } from "@/components/gallery/Gallery"
import { Separator } from "@/components/ui/separator"
import { VideoGallery } from "@/components/gallery/VideoGallery"
import { Button } from "@/components/ui/button"

interface OurWorkClientProps {
  initialData: OurWorkPageQueryResult
}

export const OurWorkClient = ({ initialData }: OurWorkClientProps) => {
  const query = useLiveSanityData(ourWorkPageQuery, initialData)
  // Galleries render nothing until they have media, so drop them up front or
  // a separator would be left beside an empty gap.
  const visibleGalleries = (query?.galleries ?? []).filter((item) =>
    item._type === "videoGallery"
      ? item.videos?.some((video) => urlForFile(video.videoFile?.asset?._ref))
      : item.gallery?.images?.some((image) => image.imageFile?.asset),
  )

  const scrollToAnchor = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })
  }

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
        heading={query?.heading ?? "Our Work"}
        showHeading={query?.showHeading}
        pageDescription={query?.pageDescription}
        footer={query?.buttons && <CtaButtons buttons={query.buttons} />}
      >
        <div className="flex flex-col gap-6">
          {query?.content && (
            <PortableText
              value={query.content}
              components={PORTABLE_TEXT_COMPONENTS}
            />
          )}
          <div className="flex flex-col gap-2 bg-brand-accent-foreground/50 rounded p-2 border">
            <div>
              <p className="text-brand-accent font font-bold">
                Jump to Gallery
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {visibleGalleries.map(({ _key, anchor, title }) =>
                anchor ? (
                  <Button
                    key={_key}
                    onClick={() => scrollToAnchor(anchor)}
                    variant="outline"
                  >
                    {title}
                  </Button>
                ) : null,
              )}
            </div>
          </div>

          {visibleGalleries.map((item, index) => (
            <Fragment key={item._key}>
              {index > 0 && (
                <Separator
                  variant="linear"
                  className="via-white/50 from-transparent to-transparent opacity-50"
                />
              )}
              {item._type === "videoGallery" ? (
                <VideoGallery
                  videos={item.videos}
                  heading={item.title}
                  description={item.description}
                  showHeading={item.showTitle}
                  anchor={item.anchor}
                />
              ) : (
                <Gallery
                  images={item.gallery?.images}
                  heading={item.title}
                  description={item.description}
                  showHeading={item.showTitle}
                  anchor={item.anchor}
                />
              )}
            </Fragment>
          ))}
        </div>
      </PageContainer>
    </>
  )
}
