import { hero } from "@/sanity/schemaTypes/hero"
import { Header } from "./header/Header"
import type { Hero as HeroData } from "@/sanity/types"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type TPageContainerProps = {
  floatingHero?: boolean
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
  children: ReactNode
}

export const PageContainer = ({
  floatingHero = false,
  fillHeight = false,
  children,
}: TPageContainerProps) => {
  return (
    <div
      className={cn(
        floatingHero && "p-10",
        fillHeight && "flex flex-col md:flex-1 md:min-h-0",
      )}
    >
      {floatingHero ? (
        <section
          className={cn(
            "relative flex flex-1 pt-20 md:pt-20 w-full",
            fillHeight && "md:min-h-0",
          )}
        >
          <div
            className={cn(
              "flex relative z-10 px-0 md:pl-8 w-full max-w-[1920px] mx-auto md:ml-(--hero-content-width) md:w-[calc(100%-var(--hero-content-width))] border-none md:border-l border-l-white/10",
              fillHeight && "md:min-h-0",
            )}
          >
            {children}
          </div>
        </section>
      ) : (
        <section className="w-full mx-auto">
          <div className="mx-auto">{children}</div>
        </section>
      )}
    </div>
  )
}
