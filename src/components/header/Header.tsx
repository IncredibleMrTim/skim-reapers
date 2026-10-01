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
}

export const Header = ({
  hero,
  showHero = true,
  showHeroOnMobile = true,
  showHeroImageOnMobile = true,
  showHeroTextOnMobile = true,
  customComp,
}: HeaderProps) => {
  return (
    <div>
      <section
        id="home"
        className={cn(
          "flex w-full flex-col bg-brand-background text-brand-background mx-auto",
          !hero?.floating
            ? "absolute min-h-190 md:min-h-100 overflow-x-clip"
            : "relative overflow-x-clip",
        )}
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div className="w-full max-md:h-20">
          <Navbar />
        </div>

        {showHero && (
          <div
            className={cn(
              !hero?.floating && "flex-1 min-h-0",
              showHeroOnMobile ? "" : "hidden md:block",
            )}
          >
            <Hero
              hero={hero}
              customComp={customComp}
              showHeroImageOnMobile={showHeroImageOnMobile}
              showHeroTextOnMobile={showHeroTextOnMobile}
            />
          </div>
        )}
      </section>
      {!hero?.floating && (
        <Image
          fill
          className="pointer-events-none object-cover md:object-top-left opacity-30 z-9 [--mask-pos:center_top] md:[--mask-pos:top_left]"
          style={{
            maskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
          }}
          priority
          alt="background"
          src="/smoke_bg.webp"
        />
      )}
    </div>
  )
}
