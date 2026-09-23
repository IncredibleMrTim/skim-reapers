"use client"

import Image from "next/image"
import { HiArrowNarrowRight } from "react-icons/hi"
import type { Image as SanityImage } from "sanity"
import type { ComponentProps } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { urlForImage } from "@/sanity/image"
import { getIconComponent } from "@/lib/reactIcons"

type CtaButton = {
  _key: string
  label: string
  path: string
  icon?: SanityImage
  imageIcon?: SanityImage
  reactIcon?: { name?: string; package?: string } | null
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link"
    | null
    | undefined
}

type CtaButtonsProps = {
  buttons?: CtaButton[]
  variant?: ComponentProps<typeof Button>["variant"]
  size?: ComponentProps<typeof Button>["size"]
  className?: string
}

export const CtaButtons = ({
  buttons,
  variant,
  size,
  className,
}: CtaButtonsProps) => {
  const router = useRouter()

  return (
    <>
      {buttons?.map((b) => {
        const imageIcon = b.imageIcon ?? b.icon
        const ReactIcon = getIconComponent(b.reactIcon ?? undefined)

        return (
          <Button
            key={b._key}
            variant={b?.variant || variant || "default"}
            size={size}
            className={className}
            onClick={(e) => {
              e.stopPropagation()
              router.push(b.path)
            }}
          >
            {b.label}
            {ReactIcon ? (
              <ReactIcon className="mt-0.5" />
            ) : imageIcon ? (
              <Image
                src={urlForImage(imageIcon).url()}
                alt={`${b.label} navigation button`}
                width={24}
                height={24}
              />
            ) : (
              <HiArrowNarrowRight className="mt-0.5" />
            )}
          </Button>
        )
      })}
    </>
  )
}
