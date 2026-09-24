import type { ComponentType } from "react"
import { Navbar } from "../Navbar"
import { Hero } from "../hero/Hero"
import type { Hero as HeroData } from "@/sanity/types"
import { cn } from "@/lib/utils"
import Image from "next/image"
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
    <div>
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
      {floating && (
        <Image
          className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 max-w-none opacity-40 md:opacity-15 z-9 object-cover [--mask-pos:center_top] md:[--mask-pos:top_left] h-screen"
          style={{
            maskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
          }}
          priority
          width={2000}
          height={2000}
          alt="background"
          src="/smoke_bg.webp"
        />
      )}
    </div>
  )
}
