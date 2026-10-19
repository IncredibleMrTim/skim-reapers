"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { LuCamera } from "react-icons/lu"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_COUNT } from "@/lib/compressPhotos"

interface PhotoPickerProps {
  photos: File[]
  onChange: (photos: File[]) => void
  isDisabled?: boolean
}

interface PhotoSlideProps {
  previewUrl: string
  position: number
  total: number
  isDisabled: boolean
  onRemove: () => void
}

/** One full-width photo with a "Photo n of N" badge and a remove button. */
const PhotoSlide = ({
  previewUrl,
  position,
  total,
  isDisabled,
  onRemove,
}: PhotoSlideProps) => (
  <div className="relative w-full overflow-hidden rounded-lg p-2">
    {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview of a local file, nothing for next/image to optimise */}
    <img
      src={previewUrl}
      alt={`Selected photo ${position} of ${total}`}
      className="max-h-96 w-full rounded-lg object-contain"
    />
    <div className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">
      Photo {position} of {total}
    </div>
    <button
      type="button"
      onClick={onRemove}
      disabled={isDisabled}
      aria-label={`Remove photo ${position}`}
      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-lg hover:bg-red-600"
    >
      ×
    </button>
  </div>
)

interface ThumbnailStripProps {
  previewUrls: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}

/** Row of small previews along the bottom; the current photo is outlined. */
const ThumbnailStrip = ({
  previewUrls,
  selectedIndex,
  onSelect,
}: ThumbnailStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null)

  // Keep the current thumbnail visible when the strip overflows (mobile).
  useEffect(() => {
    const selectedThumbnail = stripRef.current?.children[selectedIndex]
    selectedThumbnail?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    })
  }, [selectedIndex])

  return (
    <div ref={stripRef} className="flex gap-2 overflow-x-auto pb-1">
      {previewUrls.map((previewUrl, index) => (
        <button
          key={previewUrl}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Show photo ${index + 1}`}
          aria-current={index === selectedIndex}
          className={`h-16 w-16 shrink-0 overflow-hidden rounded border-2 ${
            index === selectedIndex
              ? "border-brand-accent"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview of a local file, nothing for next/image to optimise */}
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  )
}

/**
 * Picks photos of previous work. Shows a tap-to-add area when empty, then a
 * swipeable carousel of the chosen photos with a remove button on each, in
 * the style of the T Z E app's photo section.
 */
export const PhotoPicker = ({
  photos,
  onChange,
  isDisabled = false,
}: PhotoPickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const previewUrls = useMemo(
    () => photos.map((photo) => URL.createObjectURL(photo)),
    [photos],
  )

  // Object URLs hold the file in memory until revoked.
  useEffect(
    () => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)),
    [previewUrls],
  )

  // "reInit" fires when photos are added or removed and the carousel resets,
  // which can leave the old index pointing past the end.
  useEffect(() => {
    if (!carouselApi) return
    const syncSelectedIndex = () =>
      setSelectedIndex(carouselApi.selectedScrollSnap())
    syncSelectedIndex()
    carouselApi.on("select", syncSelectedIndex)
    carouselApi.on("reInit", syncSelectedIndex)
    return () => {
      carouselApi.off("select", syncSelectedIndex)
      carouselApi.off("reInit", syncSelectedIndex)
    }
  }, [carouselApi])

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []).filter((file) =>
      ACCEPTED_PHOTO_TYPES.includes(file.type),
    )
    onChange([...photos, ...selectedFiles].slice(0, MAX_PHOTO_COUNT))
    // Reset so choosing the same file again after removing it still fires.
    event.target.value = ""
  }

  function handleRemove(indexToRemove: number) {
    onChange(photos.filter((_, index) => index !== indexToRemove))
  }

  function renderSlide(index: number) {
    return (
      <PhotoSlide
        previewUrl={previewUrls[index]}
        position={index + 1}
        total={photos.length}
        isDisabled={isDisabled}
        onRemove={() => handleRemove(index)}
      />
    )
  }

  const hasReachedPhotoLimit = photos.length >= MAX_PHOTO_COUNT

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_PHOTO_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleFilesSelected}
        disabled={isDisabled}
      />
      {photos.length === 0 ? (
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-white/30 bg-white/2 py-6 backdrop-blur-lg text-sm text-brand-foreground/70 transition-colors hover:border-white/60"
        >
          <LuCamera
            className="size-8 text-brand-accent-light"
            aria-hidden="true"
          />
          <span className="font-medium text-brand-accent-light">
            Tap to add photos of your work
          </span>
          <span className="text-xs text-brand-foreground/70">
            Up to {MAX_PHOTO_COUNT} photos. JPEG, PNG or WebP.
          </span>
        </button>
      ) : (
        <>
          {photos.length === 1 ? (
            renderSlide(0)
          ) : (
            <Carousel
              className="w-full px-12 backdrop-blur-lg border bg-white/2 rounded p-2"
              setApi={setCarouselApi}
            >
              <CarouselContent>
                {photos.map((photo, index) => (
                  <CarouselItem
                    key={`${photo.name}-${photo.lastModified}-${index}`}
                  >
                    {renderSlide(index)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 h-10 w-10" />
              <CarouselNext className="right-0 h-10 w-10" />
            </Carousel>
          )}
          {photos.length > 1 && (
            <ThumbnailStrip
              previewUrls={previewUrls}
              selectedIndex={Math.min(selectedIndex, photos.length - 1)}
              onSelect={(index) => carouselApi?.scrollTo(index)}
            />
          )}
          <Button
            type="button"
            variant="outline"
            disabled={isDisabled || hasReachedPhotoLimit}
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded"
          >
            {hasReachedPhotoLimit
              ? `Photo limit reached (${MAX_PHOTO_COUNT})`
              : `Add more photos (${photos.length} of ${MAX_PHOTO_COUNT})`}
          </Button>
        </>
      )}
    </div>
  )
}
