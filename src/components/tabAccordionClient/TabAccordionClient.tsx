"use client"

import { AccordionClient } from "@/components/accordionClient/AccordionClient"
import { CtaButton } from "@/components/CtaButtons"
import { TabsClient } from "@/components/tabsClient/TabsClient"
import { TabAccordionSkeleton } from "@/components/tabAccordionClient/TabAccordionSkeleton"
import { PortableText } from "@portabletext/react"
import { ComponentProps, Suspense } from "react"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useHasMounted } from "@/hooks/useHasMounted"

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
  // `useIsMobile` reports `false` on the very first client render too (so
  // hydration matches the server HTML), then corrects itself a tick later.
  // Gating on `hasMounted` first means that first, briefly-wrong render
  // never gets painted as the wrong component.
  const hasMounted = useHasMounted()

  return (
    <Suspense fallback={<TabAccordionSkeleton itemCount={items.length} />}>
      {!hasMounted ? (
        <TabAccordionSkeleton itemCount={items.length} />
      ) : isMobile ? (
        <AccordionClient items={items ?? []} />
      ) : (
        <TabsClient items={items ?? []} />
      )}
    </Suspense>
  )
}
