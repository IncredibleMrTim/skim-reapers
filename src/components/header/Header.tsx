import type { ComponentType } from "react"
import { Navbar } from "../Navbar"
import { Hero } from "../hero/Hero"
import type { Hero as HeroData } from "@/sanity/types"
import { cn } from "@/lib/utils"

type HeaderProps = {
  hero?: HeroData | null
  showHero?: boolean
  showHeroOnMobile?: boolean
  showHeroImageOnMobile?: boolean
  showHeroTextOnMobile?: boolean
  customComp?: ComponentType
  /**
   * Float the header absolutely over whatever the page renders below it,
   * clipped to a fixed height, instead of the default behavior of sizing
   * to the hero content and pushing the rest of the page down. Used by
   * pages (e.g. About) that deliberately layer their own content under
   * the hero rather than stacking below it.
   */
  floating?: boolean
}

export const Header = ({
  hero,
  showHero = true,
  showHeroOnMobile = true,
  showHeroImageOnMobile = true,
  showHeroTextOnMobile = true,
  customComp,
  floating = false,
}: HeaderProps) => {
  return (
    <section
      id="home"
      className={cn(
        "flex w-full flex-col bg-brand-background text-brand-background mx-auto",
        floating
          ? "absolute h-190 md:h-164 overflow-hidden"
          : "relative overflow-x-clip",
      )}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="w-full">
        <Navbar />
      </div>

      {showHero && (
        <div
          className={cn(
            floating && "flex-1 min-h-0",
            showHeroOnMobile ? "" : "hidden md:block",
          )}
        >
          <Hero
            hero={hero}
            customComp={customComp}
            showHeroImageOnMobile={showHeroImageOnMobile}
            showHeroTextOnMobile={showHeroTextOnMobile}
            floating={floating}
          />
        </div>
      )}
    </section>
  )
}
