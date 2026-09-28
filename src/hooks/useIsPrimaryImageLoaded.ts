"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps } from "react"
import type { PortableText } from "@portabletext/react"
import type { Image as SanityImage } from "sanity"
import { urlForImage } from "@/sanity/image"

type PortableTextValue = ComponentProps<typeof PortableText>["value"]

/** Matches the width `PortableTextImage` (marks.tsx) requests, so this preload hits the same cached asset the real `<Image>` renders. */
const PRELOAD_WIDTH = 1600

function findFirstImageUrl(content?: PortableTextValue): string | undefined {
  const blocks = Array.isArray(content) ? content : content ? [content] : []
  const imageBlock = blocks.find(
    (block): block is SanityImage & { _type: "image" } =>
      typeof block === "object" &&
      block !== null &&
      "_type" in block &&
      block._type === "image" &&
      "asset" in block,
  )
  return imageBlock
    ? urlForImage(imageBlock).width(PRELOAD_WIDTH).url()
    : undefined
}

/**
 * Reports whether the first embedded image in a Portable Text value has
 * finished loading, so a skeleton can stay up until it has — otherwise the
 * real tabs/accordion content swaps in while its image is still a blank
 * rectangle. Only gates the *initial* reveal: once it's returned `true`
 * once, it stays `true` even if `content` changes afterwards (e.g. the
 * visitor clicks a different tab), so switching tabs never re-shows the
 * skeleton.
 */
export function useIsPrimaryImageLoaded(content?: PortableTextValue): boolean {
  const imageUrl = findFirstImageUrl(content)
  const [isLoaded, setIsLoaded] = useState(false)
  const hasRevealedRef = useRef(false)

  useEffect(() => {
    if (hasRevealedRef.current) return

    const reveal = () => {
      hasRevealedRef.current = true
      setIsLoaded(true)
    }

    if (!imageUrl) {
      reveal()
      return
    }

    const image = new window.Image()
    image.src = imageUrl
    if (image.complete) {
      reveal()
      return
    }

    image.addEventListener("load", reveal)
    image.addEventListener("error", reveal)
    return () => {
      image.removeEventListener("load", reveal)
      image.removeEventListener("error", reveal)
    }
  }, [imageUrl])

  return isLoaded
}
