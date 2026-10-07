"use client"

import { useCallback, useRef } from "react"
import { PortableText } from "@portabletext/react"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { urlForFile, urlForImage } from "@/sanity/image"
import type { OurWorkPageQueryResult, Background } from "@/sanity/types"

type VideoGalleryItem = Extract<
  NonNullable<NonNullable<OurWorkPageQueryResult>["galleries"]>[number],
  { _type: "videoGallery" }
>

interface VideoGalleryProps {
  heading?: string
  description?: Background["imageDesc"]
  showHeading?: boolean
  videos?: VideoGalleryItem["videos"]
}

export const VideoGallery = ({
  heading,
  description,
  showHeading,
  videos,
}: VideoGalleryProps) => {
  const carouselRef = useRef<HTMLDivElement>(null)

  // A video left playing on a slide that has scrolled out of view would keep
  // making noise with nothing on screen to stop it.
  const handleSetApi = useCallback((api: CarouselApi) => {
    api?.on("select", () => {
      carouselRef.current
        ?.querySelectorAll("video")
        .forEach((video) => video.pause())
    })
  }, [])

  const playableVideos = videos
    ?.map((video) => ({
      ...video,
      videoUrl: urlForFile(video.videoFile?.asset?._ref),
    }))
    .filter((video) => video.videoUrl)

  if (!playableVideos?.length) return null

  return (
    <div className="flex flex-col gap-4">
      {showHeading && heading && (
        <p className="text-lg font-bold text-brand-accent">{heading}</p>
      )}
      {description && (
        <PortableText
          value={description}
          components={PORTABLE_TEXT_COMPONENTS}
        />
      )}
      <div ref={carouselRef} className="flex flex-col w-full px-8">
        <Carousel
          className="mx-auto w-full"
          setApi={handleSetApi}
          // Dragging on a video is its scrub/volume bar, not a swipe; the
          // arrows and the caption area still move the carousel.
          opts={{
            watchDrag: (_api, event) =>
              !(event.target instanceof HTMLVideoElement),
          }}
        >
          <div className="border border-white/10 rounded p-1">
            <CarouselContent>
              {playableVideos.map((video) => (
                <CarouselItem key={video._key} className="md:basis-1/2">
                  <figure className="flex flex-col gap-2">
                    <video
                      controls
                      preload="metadata"
                      poster={
                        video.posterImage?.asset
                          ? urlForImage(video.posterImage).url()
                          : undefined
                      }
                      className="w-full rounded"
                    >
                      <source src={video.videoUrl} />
                    </video>
                    <figcaption className="text-sm">
                      {video.videoName}
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>

          {/* Shown on mobile too (unlike the image gallery): swiping on a
              video is disabled, so the arrows are the way to navigate. */}
          <CarouselPrevious
            variant="ghost"
            size="icon-sm"
            className="-left-8 bg-brand-accent/50 hover:bg-brand-accent/80 rounded-[4px]"
          />
          <CarouselNext
            variant="ghost"
            size="icon-sm"
            className="-right-8 bg-brand-accent/50 hover:bg-brand-accent/80 rounded-[4px]"
          />
        </Carousel>
      </div>
    </div>
  )
}
