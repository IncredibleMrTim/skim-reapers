"use client"

import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { ComponentProps } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useIsPrimaryImageLoaded } from "@/hooks/useIsPrimaryImageLoaded"
import { ContentSkeleton } from "@/components/tabAccordionClient/ContentSkeleton"
import { CtaButton, CtaButtons } from "../CtaButtons"
import { QaList, type QaEntry } from "@/components/qaList/QaList"

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
  heading?: PortableTextValue | string | null
  title?: PortableTextValue | string | null
  urlQuery?: string | null
  content?: PortableTextValue | string
  buttons?: CtaButton[]
  qaEntries?: QaEntry[] | null
}

/**
 * Block wrapper that renders children unwrapped, so Portable Text can sit
 * inside a `<button>` or `<h1>` without nesting an invalid `<p>` in them.
 */
const INLINE_PORTABLE_TEXT_COMPONENTS: PortableTextComponents = {
  ...PORTABLE_TEXT_COMPONENTS,
  block: { normal: ({ children }) => <>{children}</> },
}

/** Renders a plain string as-is and a Portable Text value as inline rich text. */
function TextOrPortableText({
  value,
}: {
  value?: PortableTextValue | string | null
}) {
  if (!value) return null
  if (typeof value === "string") return <>{value}</>
  return (
    <PortableText value={value} components={INLINE_PORTABLE_TEXT_COMPONENTS} />
  )
}

export function TabsClient({ items }: { items: TabItem[] }) {
  const params = useSearchParams()
  const service = params.get("service")
  const activeKey = items.find((s) => s.urlQuery === service)?._key
  const isMobile = useIsMobile()
  const activeItem = items.find((s) => s._key === activeKey) ?? items[0]
  const activeContent = activeItem?.content
  const isImageLoaded = useIsPrimaryImageLoaded(
    typeof activeContent === "string" ? undefined : activeContent,
  )

  return (
    <Tabs
      orientation={isMobile ? "horizontal" : "vertical"}
      className="bg-transparent w-full h-auto md:h-full gap-6 md:gap-2 border md:border-none border-white/20 rounded"
      defaultValue={activeKey}
    >
      <TabsList
        className={`bg-transparent md:bg-black/30 rounded w-full group-data-vertical/tabs:h-auto! group-data-vertical/tabs:w-auto group-data-vertical/tabs:min-w-50 group-data-vertical/tabs:justify-start group-data-vertical/tabs:min-h-140 group-data-vertical/tabs:self-stretch ${isMobile ? "flex-col flex-1" : ""}`}
      >
        {items.map((s) => (
          <TabsTrigger
            key={s._key}
            value={s._key}
            className="w-full border-b-0 rounded md:rounded-none md:border-b border-b-white/10 aria-selected:border-b-brand-accent m-1 md:m-0  p-4 mb:p-2 text-sm md:text-lg font-sans aria-selected:bg-white/20 group-data-vertical/tabs:flex-none group-data-vertical/tabs:h-auto"
          >
            <TextOrPortableText value={s.heading ?? s.title} />
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((s) => (
        <TabsContent
          key={s._key}
          value={s._key}
          className="p-4 md:bg-black/30 border-t border-t-brand-accent/30"
        >
          <div className="font-inter">
            <h1 className="text-2xl font-inter font-bold text-brand-content pb-2">
              <TextOrPortableText value={s.heading} />
            </h1>
            {s.qaEntries && <QaList entries={s.qaEntries} />}
            {!isImageLoaded ? (
              <ContentSkeleton />
            ) : (
              s.content &&
              (typeof s.content === "string" ? (
                <p>{s.content}</p>
              ) : (
                <PortableText
                  value={s.content}
                  components={PORTABLE_TEXT_COMPONENTS}
                />
              ))
            )}

            {s.buttons && <CtaButtons buttons={s.buttons} />}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
