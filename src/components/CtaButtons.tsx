"use client"

import Image from "next/image"
import { HiArrowNarrowRight } from "react-icons/hi"
import type { Image as SanityImage } from "sanity"
import type { ComponentProps } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { urlForImage } from "@/sanity/image"
import { DynamicReactIcon } from "@/lib/reactIcons"
import { cn } from "@/lib/utils"

export type CtaButton = {
  _key: string
  label: string
  path: string
  icon?: SanityImage
  imageIcon?: SanityImage
  reactIcon?: { name?: string; package?: string } | null
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

        return (
          <Button
            key={b._key}
            variant={b?.variant || variant || "default"}
            size={b.size || size || "default"}
            className={cn("w-full md:w-auto", className)}
            onClick={(e) => {
              e.stopPropagation()
              router.push(b.path)
            }}
          >
            {b.label}
            {b.reactIcon?.name ? (
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
            )}
          </Button>
        )
      })}
    </>
  )
}
