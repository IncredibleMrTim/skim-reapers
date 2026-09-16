import Image from "next/image"
import { DistressedHeading } from "@/components/DistressedHeading"
import { Button } from "../ui/button"
import { HiArrowNarrowRight } from "react-icons/hi"
import type { HomePageQueryResult } from "@/sanity/types"
import { urlForImage } from "@/sanity/image"

const SMOKE_BG_URL = "/smoke_bg.webp"
const LOGO_URL = "/logo_extracted.png"
const HERO_IMAGE_URL = "/window.webp"

type HeroProps = {
  hero?: NonNullable<HomePageQueryResult>["hero"]
}

export const Hero = ({ hero }: HeroProps) => {
  return (
    <div className="relative h-full px-4">
      <Image
        src={LOGO_URL}
        alt="Skim Reapers Ltd"
        width={342}
        height={242}
        className="absolute top-0 md:-top-20 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 md:mx-4 my-4 md:my-10 w-70 md:w-90 brightness-110"
        priority
      />

      <div className="hidden md:flex justify-end z-1 absolute top-0 right-0 w-2/3 h-full">
        <div className="w-full h-full absolute top-0 right-0 bg-linear-to-r from-brand-background from-10% via-transparent via-40% to-transparent z-1" />
        {hero?.image && (
          <Image
            src={urlForImage(hero.image).url()}
            alt="Skim Reapers Ltd"
            width={200}
            height={200}
            className="object-cover h-full w-full repeat-0"
            priority
          />
        )}
      </div>
      <div className="absolute">
        <div className="relative h-full sm:block z-9">
          <Image
            src={SMOKE_BG_URL}
            alt="Skim Reapers Ltd"
            width={280}
            height={150}
            className="absolute -top-20 left-1/2 -translate-x-1/2 md:-left-10 md:translate-x-0 h-180 w-280 max-w-none opacity-60 md:opacity-40 z-9 object-cover [--mask-pos:center_top] md:[--mask-pos:top_left]"
            style={{
              maskImage:
                "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(circle at var(--mask-pos), black 10%, transparent 85%)",
            }}
            priority
          />
        </div>

        <div className="relative flex flex-col gap-1 justify-start mt-60 md:mt-0 md:pt-60 w-full md:w-3/5 md:pl-0 mx-auto md:mx-4 z-8 px-2 md:px-0 ">
          <DistressedHeading
            font="font-heading"
            className="text-lg font-bold opacity-100"
            color="var(--accent)"
          >
            {hero?.eyebrow}
          </DistressedHeading>
          <DistressedHeading className="tracking-[-0.01em] text-5xl md:text-6xl xlg:text-7xl">
            {hero?.heading}
          </DistressedHeading>
          <DistressedHeading
            font="font-heading"
            className="text-lg font-bold opacity-100"
            color="var(--accent)"
          >
            {hero?.subheading}
          </DistressedHeading>
          <DistressedHeading
            className="text-lg font-bold px-0"
            font="font-heading"
            color="var(--content)"
          >
            {hero?.text}
          </DistressedHeading>
          <div className="flex gap-2 mt-4">
            <Button size="2xl">
              GET A QUOTE
              <HiArrowNarrowRight className="mt-0.5" />
            </Button>
            <Button size="2xl" variant="outline">
              VIEW OUR WORK
              <HiArrowNarrowRight className="mt-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
