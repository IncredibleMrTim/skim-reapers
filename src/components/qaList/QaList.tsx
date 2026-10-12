"use client"

import { PortableText } from "@portabletext/react"
import type { ComponentProps } from "react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"

type PortableTextValue = ComponentProps<typeof PortableText>["value"]

/** One question and its answer, as stored in a Sanity `qa` object. */
export type QaEntry = {
  _key: string
  question?: PortableTextValue | null
  answer?: PortableTextValue | null
}

interface QaListProps {
  entries: QaEntry[]
}

/**
 * Renders a single Q&A list as plain text — every question with its answer
 * underneath — so visitors can scan the whole list without expanding
 * anything. Used inside a tab panel or an outer accordion row, so it
 * carries no border or background of its own.
 */
export function QaList({ entries }: QaListProps) {
  return (
    <dl className="w-full">
      {entries.map((entry) => (
        <div
          key={entry._key}
          className="py-4 not-last:border-b not-last:border-white/10"
        >
          <dt className="text-base md:text-lg">
            {entry.question && (
              <PortableText
                value={entry.question}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )}
          </dt>
          <dd>
            {entry.answer && (
              <PortableText
                value={entry.answer}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
