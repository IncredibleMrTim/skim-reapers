import Image from "next/image"
import { PortableText } from "@portabletext/react"
import type { WhatWeDo } from "@/sanity/types"
import { CtaButtons } from "@/components/CtaButtons"
import { useRouter } from "next/navigation"

type CardData = NonNullable<WhatWeDo["cards"]>[number]

interface ICard {
  image?: string
  title?: string
  text?: CardData["text"]
  buttons?: CardData["buttons"]
  path?: string
}

export const Card = ({ image, title, text, buttons, path }: ICard) => {
  const router = useRouter()
  return (
    <div
      onClick={path ? () => router.push(path) : undefined}
      className={`text-center mx-auto w-[calc(50%-0.5rem)] md:w-1/6 min-w-0 z-10 text-brand-accent-foreground px-6 py-4 border border-background/10 ${path ? "cursor-pointer" : ""}`}
    >
      <div className="flex flex-col items-center justify-between gap-2 w-full h-full">
        <div className="flex flex-col gap-1 items-center justify-between">
          {image && (
            <Image
              width="70"
              height="70"
              alt={`${title} service button`}
              src={image}
              className="w-15 h-15 brightness-90"
            />
          )}
          <div className="text-md">{title}</div>
        </div>
        <div className="text-sm">
          <PortableText value={text} />
        </div>
        <CtaButtons buttons={buttons} />
      </div>
    </div>
  )
}
