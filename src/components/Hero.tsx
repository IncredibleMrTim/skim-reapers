"use client"

import Image from "next/image"
import { DistressedHeading } from "@/components/DistressedHeading"

const SMOKE_BG_URL = "/smoke_bg.webp"
const LOGO_URL = "/logo_extracted.png"
const HERO_IMAGE_URL = "/window.webp"

export const Hero = () => {
  return (
    <section id="home" className="relative flex w-full flex-col grow-0 h-150">
      <Image
        src={LOGO_URL}
        alt="Skim Reapers Ltd"
        width={342}
        height={242}
        className="absolute top-20 md:top-0 left-0 mx-10 my-10 md:w-90 brightness-110"
        priority
      />
      <div className="hidden md:flex w-full h-full overflow-hidden justify-end z-1 mt-20 absolute top-0 right-0">
        <div className="w-2/3 h-full absolute top-0 right-0 bg-linear-to-r from-brand-background from-10% via-transparent via-40% to-transparent z-1" />
        <Image
          src={HERO_IMAGE_URL}
          alt="Skim Reapers Ltd"
          width={2000}
          height={2000}
          className=" w-2/3 h-full object-cover repeat-0"
          priority
        />
      </div>

      <div className="relative h-full sm:block z-9">
        <Image
          src={SMOKE_BG_URL}
          alt="Skim Reapers Ltd"
          width={280}
          height={170}
          className="absolute -top-15 -left-10 h-170 w-260 max-w-none opacity-60 md:opacity-40 z-9 object-cover"
          style={{
            maskImage:
              "radial-gradient(circle at top left, black 30%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(circle at top left, black 30%, transparent 65%)",
          }}
          priority
        />
      </div>

      <div className="flex flex-col gap-2 justify-start mt-105 md:mt-0 w-full md:w-200 md:pl-0 mx-auto md:mx-10 z-8 px-4 md:px-0">
        <DistressedHeading
          font="font-heading"
          className="text-lg font-bold opacity-100"
          color="var(--accent)"
        >
          COMMERCIAL & DOMESTIC
        </DistressedHeading>
        <DistressedHeading className="tracking-[-0.01em] text-5xl md:text-6xl xlg:text-7xl">
          PROFESSIONAL PLASTERING AND
          <br /> DRY LINING CONTRACTORS
        </DistressedHeading>
        <DistressedHeading
          font="font-heading"
          className="text-lg font-bold opacity-100"
          color="var(--accent)"
        >
          20 YEARS OF EXPERIENCE. ONE UNCOMPROMISING STANDARD.
        </DistressedHeading>
        <DistressedHeading
          className="text-lg font-bold px-0"
          font="font-heading"
          color="var(--content)"
        >
          {`Professional plastering and dry-lining delivered by an experienced team,\nfrom individual domestic projects to larger commercial developments.`}
        </DistressedHeading>
      </div>
    </section>
  )
}
