"use client"

import Image from "next/image"
import { DistressedHeading } from "@/components/DistressedHeading"

const SMOKE_BG_URL = "/white_smoke_transparent_clouds_5433156.png"
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
          width={2000}
          height={2000}
          className="absolute top-0 left-0 opacity-20 w-200 h-300"
          style={{
            maskImage:
              "radial-gradient(circle at top left, black 30%, transparent 60%)",
            WebkitMaskImage:
              "radial-gradient(circle at top left, black 30%, transparent 60%)",
          }}
          priority
        />
      </div>

      <div className="flex flex-col gap-2 mt-80 w-200 pl-26">
        <div className="text-brand-accent text-lg font-bold">
          COMMERCIAL & DOMESTIC
        </div>
        <DistressedHeading className="tracking-[-0.01em]" size="text-7xl">
          {`PROFESSIONAL PLASTERING & \nDRY LINING CONTRACTORS`}
        </DistressedHeading>
        <div className="text-brand-accent text-lg font-bold">
          20 YEARS OF EXPERIENCE. ONE UNCOMPROMISING STANDARD.
        </div>
        <DistressedHeading
          className="text-lg text-brand-content font-bold opacity-80"
          font="font-heading"
        >
          {`Professional plastering and dry-lining delivered by an experienced team,\nfrom individual domestic projects to larger commercial developments.`}
        </DistressedHeading>
      </div>
    </section>
  )
}
