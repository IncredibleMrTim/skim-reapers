"use client"
import { DistressedHeading } from "@/components/DistressedHeading"
import { Button } from "@/components/ui/button"
import { HiArrowNarrowRight } from "react-icons/hi"
import { Card } from "./Card"
import { PortableText } from "@portabletext/react"
import type { WhatWeDo as WhatWeDoQueryResult } from "@/sanity/types"
import { urlForImage } from "@/sanity/image"
import Image from "next/image"
import { useRouter } from "next/navigation"

type WhatWeDoProps = {
  queryResult: WhatWeDoQueryResult
}

export const WhatWeDo = ({ queryResult }: WhatWeDoProps) => {
  const router = useRouter()

  return (
    <div className="relative flex flex-col md:flex-row gap-8 justify-between w-full bg-brand-content px-8 py-4">
      <div
        className="absolute top-0 left-0 w-full h-full z-1 opacity-30"
        style={{
          backgroundImage: "URL('/drywall_texture.jpg')",
          backgroundSize: "20%",
        }}
      />
      {queryResult?.cards
        ?.filter((c) => !c.listCard)
        .map((c) => (
          <div
            key={c._key}
            className="flex flex-col gap-1 md:w-150 z-10 w-full"
          >
            <h2 className="text-brand-accent">{c.heading}</h2>
            <div className="flex flex-col gap-1">
              <DistressedHeading color="#000" className="text-3xl" distress={0}>
                {c.subHeading}
              </DistressedHeading>
              <div className="text-brand-accent-foreground text-sm">
                {c?.text && <PortableText value={c.text} />}
              </div>
              <div>
                {c?.buttons?.map((b) => (
                  <Button
                    key={b._key}
                    variant="secondary"
                    size="lg"
                    className="text-white"
                    onClick={b?.path ? () => router.push(b.path) : undefined}
                  >
                    {b.label}
                    {b?.icon ? (
                      <Image
                        src={urlForImage(b?.icon).url()}
                        alt={`${b.label} navigation button`}
                        width={24}
                        height={24}
                      />
                    ) : (
                      <HiArrowNarrowRight className="mt-0.5" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {queryResult?.cards
          ?.filter((c) => c.listCard)
          .map((c) => (
            <Card
              key={c._key}
              image={c.image ? urlForImage(c.image).url() : undefined}
              title={c?.heading ?? undefined}
              text={c?.text ?? undefined}
              buttons={c?.buttons}
              path={c?.cardPath}
            />
          ))}
      </div>
    </div>
  )
}
