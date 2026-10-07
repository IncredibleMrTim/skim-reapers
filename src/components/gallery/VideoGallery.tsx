import { PortableText } from "@portabletext/react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { urlForImage } from "@/sanity/image"
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
  if (!videos?.length) return null

  return (
    <div className="flex flex-col gap-4">
      {showHeading && heading && <p className="text-lg font-bold">{heading}</p>}
      {description && (
        <PortableText
          value={description}
          components={PORTABLE_TEXT_COMPONENTS}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => {
          const videoUrl = video.videoFile?.asset?.url
          if (!videoUrl) return null

          return (
            <figure key={video._key} className="flex flex-col gap-2">
              <video
                controls
                preload="metadata"
                poster={
                  video.posterImage?.asset
                    ? urlForImage(video.posterImage).url()
                    : undefined
                }
                className="w-full rounded border border-white/10"
              >
                <source src={videoUrl} />
              </video>
              <figcaption className="text-sm">{video.videoName}</figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}
