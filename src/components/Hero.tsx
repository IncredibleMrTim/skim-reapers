"use client"

import Image from "next/image"
import { DistressedHeading } from "@/components/DistressedHeading"

const SMOKE_BG_URL = "/smoke_bg.webp"
const LOGO_URL = "/logo_extracted.png"

export const Hero = () => {
  return (
    <section id="home" className="relative flex w-full flex-col grow">
      <Image
        src={LOGO_URL}
        alt="Skim Reapers Ltd"
        width={342}
        height={242}
        className="absolute top-10 left-20 z-10 w-90 brightness-110"
        priority
      />
      <div className="relative h-full sm:block grow">
        <Image
          src={SMOKE_BG_URL}
          alt="Skim Reapers Ltd"
          width={250}
          height={250}
          className="absolute top-0 left-0 opacity-20 h-280 w-280"
          style={{
            maskImage:
              "radial-gradient(circle at top left, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at top left, black 30%, transparent 60%)",
          }}
          priority
        />
      </div>

      <div className="flex flex-col gap-2 mt-80 w-200 pl-26">
        <DistressedHeading
          font="font-heading"
          className="text-lg font-bold opacity-100"
          color="var(--accent)"
        >
          COMMERCIAL & DOMESTIC
        </DistressedHeading>
        <DistressedHeading className="tracking-[-0.01em]" size="text-7xl">
          {`PROFESSIONAL PLASTERING & \nDRY LINING CONTRACTORS`}
        </DistressedHeading>
        <DistressedHeading
          font="font-heading"
          className="text-lg font-bold opacity-100"
          color="var(--accent)"
        >
          20 YEARS OF EXPERIENCE. ONE UNCOMPROMISING STANDARD.
        </DistressedHeading>
        <DistressedHeading
          className="text-lg font-bold"
          font="font-heading"
          color="var(--content)"
        >
          {`Professional plastering and dry-lining delivered by an experienced team,\nfrom individual domestic projects to larger commercial developments.`}
        </DistressedHeading>
      </div>
    </section>
  )
}
