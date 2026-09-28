"use client"

import { PortableText } from "@portabletext/react"
import type { ComponentProps } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { useIsMobile } from "@/hooks/useIsMobile"

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
type TabItem = {
  _key: string
  heading?: string | null
  urlQuery?: string | null
  content?: PortableTextValue
}

export function TabsClient({ items }: { items: TabItem[] }) {
  const params = useSearchParams()
  const service = params.get("service")
  const activeKey = items.find((s) => s.urlQuery === service)?._key
  const isMobile = useIsMobile()

  return (
    <Tabs
      orientation={isMobile ? "horizontal" : "vertical"}
      className="bg-transparent w-full h-auto md:h-full gap-6 md:gap-2 border md:border-none border-white/20 p-2 rounded"
      defaultValue={activeKey}
    >
      <TabsList
        className={`bg-transparent md:bg-black/30 rounded w-full group-data-vertical/tabs:h-full group-data-vertical/tabs:w-auto group-data-vertical/tabs:justify-start group-data-vertical/tabs:min-h-140 ${isMobile ? "flex-wrap mb-20" : ""}`}
      >
        {items.map((s) => (
          <TabsTrigger
            key={s._key}
            value={s._key}
            className="border-b-0 rounded md:rounded-none md:border-b border-b-brand-accent m-1 md:m-0  p-4 mb:p-2 text-sm md:text-lg font-sans aria-selected:bg-white/20 group-data-vertical/tabs:flex-none group-data-vertical/tabs:h-auto"
          >
            {s.heading}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((s) => (
        <TabsContent
          key={s._key}
          value={s._key}
          className=" p-4 md:bg-black/30 border-t border-t-brand-accent/30"
        >
          <div className="font-inter">
            <h1 className="text-2xl font-inter font-bold text-brand-content pb-2">
              {s.heading}
            </h1>
            {s.content && (
              <PortableText
                value={s.content}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
