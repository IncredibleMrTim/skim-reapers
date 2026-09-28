"use client"

import { PortableText } from "@portabletext/react"
import type { ComponentProps } from "react"
import { useSearchParams } from "next/navigation"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { useIsPrimaryImageLoaded } from "@/hooks/useIsPrimaryImageLoaded"
import { ContentSkeleton } from "@/components/tabAccordionClient/ContentSkeleton"
import { CtaButton, CtaButtons } from "../CtaButtons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"

/**
 * Matches whatever `<PortableText value={...} />` itself accepts, rather
 * than the stricter `PortableTextBlock` type — Sanity typegen infers block
 * fields (e.g. `children`) as optional in ways `PortableTextBlock` doesn't
 * allow, so query-result content wouldn't satisfy it even though it's
 * exactly what `<PortableText>` is built to render.
 */
type PortableTextValue = ComponentProps<typeof PortableText>["value"]

/**
 * Structural shape only — deliberately not derived from any one page's
 * generated query type (e.g. `ServicesPageQueryResult`), so this component
 * can drive a tab list for any Portable-Text-backed content, not just
 * services.
 */
type AccordionItem = {
  _key: string
  heading?: string | null
  urlQuery?: string | null
  content?: PortableTextValue
  buttons?: CtaButton[]
}

export function AccordionClient({ items }: { items: AccordionItem[] }) {
  const params = useSearchParams()
  const service = params.get("service")
  const activeKey = items.find((s) => s.urlQuery === service)?._key
  const activeItem = items.find((s) => s._key === activeKey) ?? items[0]
  const isImageLoaded = useIsPrimaryImageLoaded(activeItem?.content)

  return (
    <Accordion
      className="bg-transparent w-full h-auto md:h-full  border md:border-none border-white/20 p-2 rounded"
      defaultValue={[activeKey]}
    >
      {items.map((s) => (
        <AccordionItem key={s._key} value={s._key} className="">
          <AccordionTrigger>{s.heading}</AccordionTrigger>
          <AccordionContent className=" p-4 md:bg-black/30 border-t border-t-brand-accent/70">
            <div className="font-inter">
              <h1 className="text-2xl font-inter font-bold text-brand-content">
                {s.heading}
              </h1>
              {!isImageLoaded ? (
                <ContentSkeleton />
              ) : (
                s.content && (
                  <PortableText
                    value={s.content}
                    components={PORTABLE_TEXT_COMPONENTS}
                  />
                )
              )}
              {s.buttons && <CtaButtons buttons={s.buttons} />}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
