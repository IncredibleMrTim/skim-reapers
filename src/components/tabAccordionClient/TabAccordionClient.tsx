"use client"

import { AccordionClient } from "@/components/accordionClient/AccordionClient"
import { CtaButton } from "@/components/CtaButtons"
import { TabsClient } from "@/components/tabsClient/TabsClient"
import { TabAccordionSkeleton } from "@/components/tabAccordionClient/TabAccordionSkeleton"
import { PortableText } from "@portabletext/react"
import { ComponentProps, Suspense } from "react"
import { useIsMobile } from "@/hooks/useIsMobile"

type Item = {
  _key: string
  heading?: string | null
  urlQuery?: string | null
  content?: PortableTextValue
  buttons?: CtaButton[]
}

type PortableTextValue = ComponentProps<typeof PortableText>["value"]

export const TabAccordionClient = ({ items }: { items: Item[] }) => {
  const isMobile = useIsMobile()

  return (
    <Suspense
      fallback={
        <TabAccordionSkeleton isMobile={isMobile} itemCount={items.length} />
      }
    >
      {isMobile ? (
        <AccordionClient items={items ?? []} />
      ) : (
        <TabsClient items={items ?? []} />
      )}
    </Suspense>
  )
}
