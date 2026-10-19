"use client"

import Image from "next/image"
import { HiArrowNarrowRight } from "react-icons/hi"
import type { Image as SanityImage } from "sanity"
import type { ComponentProps } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { urlForImage } from "@/sanity/image"
import { DynamicReactIcon } from "@/lib/reactIcons"
import { InlineIcon } from "@/components/portableText/InlineIcon"
import { cn } from "@/lib/utils"

export type CtaButton = {
  _key: string
  label: string
  path: string
  icon?: SanityImage
  imageIcon?: SanityImage
  reactIcon?: { name?: string; package?: string } | null
  lucideIcon?: { name?: string; iconNode?: string } | null
  /** Unset means "right", the position buttons had before this option existed. */
  iconPosition?: "left" | "right" | null
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "2xl"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined
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
        const isIconOnLeft = b.iconPosition === "left"
        const icon = b.lucideIcon?.iconNode ? (
          <InlineIcon iconNode={b.lucideIcon.iconNode} />
        ) : b.reactIcon?.name ? (
          <DynamicReactIcon icon={b.reactIcon} className="mt-0.5" />
        ) : imageIcon ? (
          <Image
            src={urlForImage(imageIcon).url()}
            alt={`${b.label} navigation button`}
            width={24}
            height={24}
          />
        ) : (
          <HiArrowNarrowRight className="mt-0.5" />
        )

        return (
          <Button
            key={b._key}
            variant={b?.variant || variant || "default"}
            size={b.size || size || "default"}
            className={cn("w-full md:w-auto rounded", className)}
            onClick={(e) => {
              e.stopPropagation()
              router.push(b.path)
            }}
          >
            {isIconOnLeft && icon}
            {b.label}
            {!isIconOnLeft && icon}
          </Button>
        )
      })}
    </>
  )
}
