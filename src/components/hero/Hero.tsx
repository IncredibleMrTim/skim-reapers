"use client"

import Image from "next/image"
import type { Hero as HeroData } from "@/sanity/types"
import { urlForImage } from "@/sanity/image"
import { sanitizeCustomCss } from "@/lib/sanity"
import type { ComponentType } from "react"
import { cn } from "@/lib/utils"
import { HeroContent, resolveMobileVisibility } from "./HeroContent"

const SMOKE_BG_URL = "/smoke_bg.webp"
const LOGO_URL = "/logo_extracted1.png"

type HeroProps = {
  hero?: HeroData | null
  showHeroImageOnMobile?: boolean
  showHeroTextOnMobile?: boolean
  customComp?: ComponentType
}

export const Hero = ({
  hero,
  showHeroImageOnMobile = true,
  showHeroTextOnMobile = true,
  customComp: CustomComp,
}: HeroProps) => {
  const customCss = sanitizeCustomCss(hero?.customCss?.code)

  const mobileVisibility = resolveMobileVisibility(hero)

  const heroTextContent = (
    <HeroContent hero={hero} mobileVisibility={mobileVisibility} />
  )

  return (
    <div
      className={cn(
        "relative px-4 min-h-120 md:min-h-150",
        !hero?.floating && "h-full",
      )}
      data-slot="hero-container"
    >
      {customCss && <style>{customCss}</style>}
      <Image
        src={LOGO_URL}
        alt="Skim Reapers Ltd"
        width={342}
        height={250}
        className={`absolute top-0 md:-top-20 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 md:mx-4 my-4 md:my-10 w-70 md:w-90 brightness-130 ${showHeroImageOnMobile ? "" : "max-md:hidden"}`}
        priority
      />

      <div
        className={`hidden md:flex justify-end z-1 absolute top-0 right-0 w-2/3 h-full ${showHeroImageOnMobile ? "" : "max-md:hidden"}`}
      >
        <div className="w-full h-full absolute top-0 right-0 bg-linear-to-r from-brand-background from-10% via-transparent via-40% to-transparent z-1" />
        {hero?.background?.imageFile && (
          <Image
            src={urlForImage(hero.background.imageFile).url()}
            alt={hero.background.imageAlt ?? "Skim Reapers Ltd"}
            width={200}
            height={200}
            className="object-cover h-full w-full repeat-0"
            priority
          />
        )}
      </div>

      {hero?.showSmoke && (
        <Image
          src={SMOKE_BG_URL}
          alt="Skim Reapers Ltd"
          width={280}
          height={150}
          className="absolute -top-20 left-1/2 -translate-x-1/2 md:-left-10 md:translate-x-0 h-170 w-280 max-w-none opacity-25 md:opacity-25 z-9 object-cover [--mask-pos:center_top] md:[--mask-pos:top_left]"
          style={{
            maskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
          }}
          priority
        />
      )}

      {CustomComp ? (
        <div className="relative flex flex-row gap-4 w-full">
          <div
            data-slot="hero-content-container"
            className={cn(
              "relative flex flex-col gap-1 justify-start w-full md:pl-0 mx-auto md:mx-4 z-10 px-2 md:px-0",
              !hero?.floating ? "mt-60 md:mt-0 md:pt-60" : "pt-60 pb-8",
              showHeroTextOnMobile ? "" : "max-md:hidden",
            )}
          >
            {heroTextContent}
          </div>
          <CustomComp />
        </div>
      ) : (
        <div
          data-slot="hero-content-container"
          className={cn(
            "relative justify-start w-full md:pl-0 mx-auto md:mx-4 z-10 px-2 md:px-0 md:w-[var(--hero-content-width)]",
            !hero?.floating ? "mt-60 md:mt-0 md:pt-60" : "pt-60 pb-8",
            showHeroTextOnMobile ? "" : "max-md:hidden",
          )}
        >
          {heroTextContent}
        </div>
      )}
    </div>
  )
}
