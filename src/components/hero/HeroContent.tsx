import type { Hero as HeroData } from "@/sanity/types"
import { DistressedHeading } from "../DistressedHeading"
import { PORTABLE_TEXT_COMPONENTS } from "../portableText/marks"
import { PortableText } from "@portabletext/react"
import { CtaButtons } from "../CtaButtons"

export type HeroPart =
  "eyebrow" | "heading" | "subheading" | "content" | "buttons"

export type HeroMobileVisibility = Record<HeroPart, boolean>

/**
 * Which hero parts show on mobile. A box that was never ticked has no saved
 * value, and Studio draws it as unticked, so unset counts as hidden.
 */
export function resolveMobileVisibility(
  hero: HeroData | null | undefined,
): HeroMobileVisibility {
  return {
    eyebrow: hero?.showEyebrowOnMobile === true,
    heading: hero?.showHeadingOnMobile === true,
    subheading: hero?.showSubheadingOnMobile === true,
    content: hero?.showContentOnMobile === true,
    buttons: hero?.showButtonsOnMobile === true,
  }
}

/** True when at least one hero part is ticked to show on mobile. */
export function hasVisibleMobilePart(
  mobileVisibility: HeroMobileVisibility,
): boolean {
  return Object.values(mobileVisibility).some(Boolean)
}

const hideOnMobile = (isVisible: boolean) => (isVisible ? "" : " max-md:hidden")

interface HeroContentProps {
  hero?: HeroData | null
  mobileVisibility: HeroMobileVisibility
}

export const HeroContent = ({ hero, mobileVisibility }: HeroContentProps) => {
  return (
    <div className="flex flex-col gap-1">
      <DistressedHeading
        dataSlot="hero-eyebrow"
        font="font-heading"
        className={`text-lg font-bold opacity-100${hideOnMobile(mobileVisibility.eyebrow)}`}
        color="var(--accent)"
      >
        {hero?.eyebrow}
      </DistressedHeading>
      <DistressedHeading
        dataSlot="hero-heading"
        className={`tracking-[-0.01em] text-4xl md:text-4xl xl:text-4xl${hideOnMobile(mobileVisibility.heading)}`}
      >
        {hero?.heading}
      </DistressedHeading>
      <DistressedHeading
        dataSlot="hero-subheading"
        font="font-heading"
        className={`text-lg font-bold opacity-100${hideOnMobile(mobileVisibility.subheading)}`}
        color="var(--accent)"
      >
        {hero?.subheading}
      </DistressedHeading>
      <DistressedHeading
        dataSlot="hero-content"
        className={`text-lg font-bold px-0${hideOnMobile(mobileVisibility.content)}`}
        font="font-heading"
        color="var(--content)"
      >
        {hero?.content && (
          <PortableText
            value={hero.content}
            components={PORTABLE_TEXT_COMPONENTS}
          />
        )}
      </DistressedHeading>
      <div
        className={`flex flex-col md:flex-row gap-2 mt-4${hideOnMobile(mobileVisibility.buttons)}`}
      >
        <CtaButtons buttons={hero?.buttons} size="2xl" />
      </div>
    </div>
  )
}
