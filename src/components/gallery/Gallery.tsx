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
  const selectedDimensions =
    getImageDimensions(selectedImage?.imageFile.asset?._ref) ??
    FALLBACK_DIMENSIONS

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
              {images.map((img) => {
                const { width, height } =
                  getImageDimensions(img.imageFile.asset?._ref) ??
                  FALLBACK_DIMENSIONS

                return (
                  <CarouselItem
                    key={img._key}
                    className="h-40 md:h-50 max-w-45 md:max-w-3xs"
                  >
                    <Image
                      src={urlForImage(img.imageFile).url()}
                      alt={img.imageAlt ?? img.imageName}
                      width={width}
                      height={height}
                      draggable={false}
                      className="h-full w-full object-cover"
                      onClick={() => setSelectedImageKey(img._key)}
                    />
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </div>

          <CarouselPrevious
            variant="ghost"
            size="icon-lg"
            className="hidden md:flex w-0 md:w-auto md:-left-8 bg-brand-accent/50 hover:bg-brand-accent/80 rounded-[4px]"
          />
          <CarouselNext
            variant="ghost"
            size="icon-lg"
            className="hidden md:flex w-0 md:w-auto md:-right-8 bg-brand-accent/50 hover:bg-brand-accent/80 rounded-[4px] "
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
                src={urlForImage(selectedImage.imageFile).url()}
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
