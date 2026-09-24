import { BeliefCard } from "./BeliefCard"
import type { Belief as BeliefBannerQueryResult } from "@/sanity/types"
import { getIconComponent } from "@/lib/reactIcons"
import { ReactNode } from "react"
import Image from "next/image"
import { urlForImage } from "@/sanity/image"

type BeliefBarProps = {
  className?: string
  queryResult: BeliefBannerQueryResult
}

export const BeliefBar = ({ queryResult }: BeliefBarProps) => {
  return (
    <div className={`flex flex-flow justify-between px-8 py-4 h-20`}>
      {queryResult.map((b, idx) => {
        let icon: ReactNode = null

        if (b.icon) {
          const Icon = getIconComponent(b.icon)
          if (Icon) {
            icon = <Icon size={48} strokeWidth={1} color="var(--accent)" />
          }
        } else if (b.image) {
          icon = (
            <div className="relative flex-1 min-w-12 max-md:w-full aspect-48/48">
              <Image
                src={urlForImage(b.image).url()}
                fill
                alt={b.heading}
                className="object-cover"
              />
            </div>
          )
        }

        return (
          <BeliefCard
            key={b._key}
            icon={icon}
            text={b.heading}
            className={`${idx < queryResult.length ? "h-full shrink-0 border-r border-brand-content/25" : ""}`}
          />
        )
      })}
    </div>
  )
}
