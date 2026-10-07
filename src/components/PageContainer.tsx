import type { Hero as HeroData } from "@/sanity/types"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { PageHeading, type PageHeadingProps } from "./PageHeading"

type TPageContainerProps = PageHeadingProps & {
  /**
   * The page's hero data. Drives the same `floating` field `Header` reads
   * (see `Header`'s `hero` prop): when disabled, the hero is pinned to the
   * left as a fixed column and this container reserves space via
   * `--hero-content-width` for content to sit beside it; when enabled, the
   * hero sizes to its own content and this container renders full-width
   * with content flowing below. Keep this in sync with the `hero` passed
   * to the page's `Header` — a mismatch between the two produces a hero
   * and content area that assume different layouts.
   */
  hero?: HeroData | null
  /**
   * Stretch the container to fill the height left over between the header
   * and the footer, instead of shrink-wrapping to content. Requires the
   * route to sit under a layout that caps height at an ancestor which also
   * renders `Footer` (see `src/app/(content)/layout.tsx`) — lets the page
   * put its own `flex-1 min-h-0` scroll area inside without guessing the
   * footer's height. Applied `md:` and up only — that shared layout only
   * caps the viewport at that breakpoint too (see the comment there for
   * why).
   */
  fillHeight?: boolean
  /**
   * Rendered below the scroll area so it stays pinned (e.g. page buttons)
   * rather than scrolling away with the content.
   */
  footer?: ReactNode
  children: ReactNode
}

export const PageContainer = ({
  hero,
  fillHeight = false,
  children,
  footer,
  heading,
  showHeading,
  pageDescription,
}: TPageContainerProps) => {
  const floatingHero = !hero?.floating
  // Heading scrolls with the page content, so it goes inside the scroll area.
  // Deliberately a plain block container, not `flex flex-col`: portable text
  // blocks (`min-h-[1lh]`) are direct children here, and as flex items they
  // shrink below their content height and overlap each other.
  const scrollContent = (
    <div
      className={cn(
        fillHeight && "md:overflow-y-auto md:flex-1 md:min-h-0 no-scrollbar",
      )}
    >
      <PageHeading
        heading={heading}
        showHeading={showHeading}
        pageDescription={pageDescription}
      />
      {children}
    </div>
  )
  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full md:flex-1 md:min-h-0 font-inter px-4 md:px-4 md:pr-8 py-8">
      <div className={cn(fillHeight && "flex flex-col md:flex-1 md:min-h-0")}>
        {floatingHero ? (
          <section
            className={cn(
              "relative flex flex-col flex-1 pt-20 md:pt-20 w-full md:pl-8 gap-4",
              fillHeight && "md:min-h-0",
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-2 relative z-10 px-0 md:pl-8 w-full max-w-[1920px] mx-auto md:ml-(--hero-content-width) md:w-[calc(100%-var(--hero-content-width))] border-none md:border-l border-l-white/10",
                fillHeight && "md:min-h-0",
              )}
            >
              {scrollContent}
              {footer}
            </div>
          </section>
        ) : (
          <section className="w-full mx-auto">
            <div className="mx-auto">
              {scrollContent}
              {footer}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
