import { PortableText, type PortableTextProps } from "@portabletext/react"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { DistressedHeading } from "./DistressedHeading"

export interface PageHeadingProps {
  heading?: string | null
  /**
   * Treated as shown when unset: existing documents were saved before the
   * toggle existed, and the schema's default only applies to new documents.
   */
  showHeading?: boolean | null
  pageDescription?: PortableTextProps["value"] | null
}

/**
 * Rendered by `PageContainer` inside its scroll area so the heading and
 * description scroll away with the content instead of staying pinned.
 */
export const PageHeading = ({
  heading,
  showHeading,
  pageDescription,
}: PageHeadingProps) => {
  const isHeadingVisible = !!heading && showHeading !== false
  if (!isHeadingVisible && !pageDescription) return null

  return (
    <div className="flex flex-col gap-4 mb-4">
      {isHeadingVisible && (
        <DistressedHeading className="text-4xl tracking-wider">
          {heading}
        </DistressedHeading>
      )}
      {pageDescription && (
        <PortableText
          value={pageDescription}
          components={PORTABLE_TEXT_COMPONENTS}
        />
      )}
    </div>
  )
}
