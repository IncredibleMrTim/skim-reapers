"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { getImageDimensions, urlForImage } from "@/sanity/image"
import type { Background, ImageFile } from "@/sanity/types"
import { PortableText } from "@portabletext/react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"

export type GalleryImage = {
  _key: string
  imageName: string
  imageAlt?: string
  imageFile: ImageFile
  imageDesc?: Background["imageDesc"]
}

interface GalleryProps {
  images?: GalleryImage[]
  heading?: string
  description?: Background["imageDesc"]
  showHeading?: boolean
}

// Fallback for assets whose ref doesn't encode dimensions.
const FALLBACK_DIMENSIONS = { width: 1200, height: 800 }

// Thumbnails are cropped by Sanity's image CDN on request, so nothing extra is
// stored at upload time. Sized at 2x the largest carousel tile (256x200) so
// they stay sharp on high-density screens.
const THUMBNAIL_DIMENSIONS = { width: 512, height: 400 }
const FULL_IMAGE_MAX_WIDTH = 2000

/** Cropped carousel tile; `fit("crop")` follows the image's hotspot. */
function getThumbnailUrl(image: ImageFile): string {
  return urlForImage(image)
    .width(THUMBNAIL_DIMENSIONS.width)
    .height(THUMBNAIL_DIMENSIONS.height)
    .fit("crop")
    .auto("format")
    .quality(80)
    .url()
}

/**
 * Full image for the dialog, capped so a multi-megabyte original isn't
 * downloaded. `fit("max")` shrinks to the width without ever upscaling a
 * smaller image (`maxWidth`'s `max-w` param was ignored by the CDN).
 */
function getFullImageUrl(image: ImageFile): string {
  return urlForImage(image)
    .width(FULL_IMAGE_MAX_WIDTH)
    .fit("max")
    .auto("format")
    .url()
}

export const Gallery = ({
  images: allImages,
  heading,
  showHeading,
  description,
}: GalleryProps) => {
  // Keyed rather than storing the image object: a stored copy would go stale
  // when Sanity pushes a live update while the dialog is open.
  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null)

  // Live preview pushes half-edited items (title set, file not yet uploaded).
  const images = allImages?.filter((img) => img.imageFile?.asset)

  if (!images?.length) return null

  const selectedImage = images.find((img) => img._key === selectedImageKey)
  const originalDimensions =
    getImageDimensions(selectedImage?.imageFile.asset?._ref) ??
    FALLBACK_DIMENSIONS
  const fullImageScale = Math.min(
    1,
    FULL_IMAGE_MAX_WIDTH / originalDimensions.width,
  )
  const selectedDimensions = {
    width: Math.round(originalDimensions.width * fullImageScale),
    height: Math.round(originalDimensions.height * fullImageScale),
  }

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
      <div className="flex flex-col w-full px-8">
        <Carousel className="mx-auto  w-full">
          <div className="border border-white/10 rounded p-1">
            <CarouselContent>
              {images.map((img) => (
                <CarouselItem
                  key={img._key}
                  className="h-40 md:h-50 max-w-45 md:max-w-3xs"
                >
                  <Image
                    src={getThumbnailUrl(img.imageFile)}
                    alt={img.imageAlt ?? img.imageName}
                    width={THUMBNAIL_DIMENSIONS.width}
                    height={THUMBNAIL_DIMENSIONS.height}
                    draggable={false}
                    className="h-full w-full object-cover"
                    onClick={() => setSelectedImageKey(img._key)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>

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

        {selectedImage && (
          <Dialog
            open={!!selectedImage}
            onOpenChange={() => setSelectedImageKey(null)}
          >
            <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-brand-accent text-xl">
                  {selectedImage.imageName}
                </DialogTitle>
              </DialogHeader>
              {selectedImage.imageDesc && (
                <div className="font-inter">
                  <PortableText
                    value={selectedImage.imageDesc}
                    components={PORTABLE_TEXT_COMPONENTS}
                  />
                </div>
              )}
              <Image
                src={getFullImageUrl(selectedImage.imageFile)}
                alt={selectedImage.imageAlt ?? selectedImage.imageName}
                width={selectedDimensions.width}
                height={selectedDimensions.height}
                className="h-auto w-full"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
