"use client"

import { LogoText } from "@/components/LogoText"

const TEXTURE_URL =
  "https://images.unsplash.com/photo-1779620507336-9ddb0d1cf935?w=1600&h=900&fit=crop&auto=format"
const ROOM_URL =
  "https://images.unsplash.com/photo-1768836180171-24c727a594b8?w=900&h=700&fit=crop&auto=format"
const PLASTER_CLOSE_URL =
  "https://images.unsplash.com/photo-1787541519077-df9f00ba309b?w=800&h=600&fit=crop&auto=format"
const CONCRETE_URL =
  "https://images.unsplash.com/photo-1770816307490-e3d61793d26e?w=800&h=600&fit=crop&auto=format"
const TEXTURE2_URL =
  "https://images.unsplash.com/photo-1783855844295-6a0bcd6de993?w=800&h=600&fit=crop&auto=format"

export const Hero = ({
  imageUrl,
  text,
}: {
  imageUrl?: string
  text?: string
}) => {
  return (
    <section
      id="home"
      className="relative flex min-h-80 w-full flex-col overflow-hidden"
    >
      {/* Split background */}
      <div className="absolute inset-0 grid grid-cols-[48%_52%]">
        {/* Left — dark texture */}
        <div className="relative hidden overflow-hidden sm:block">
          <div
            className="absolute inset-0 bg-cover bg-center brightness-[0.4] saturate-0"
            style={{ backgroundImage: `url(${TEXTURE_URL})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(13,13,13,0.6)_0%,rgba(30,20,5,0.45)_100%)]" />
        </div>
        {/* Right — room photo */}
        <div className="relative overflow-hidden hidden md:block">
          <div
            className="absolute inset-0 bg-cover bg-left brightness-90"
            style={{ backgroundImage: `url(${ROOM_URL})` }}
          />
        </div>
      </div>

      {/* Diagonal slice overlay */}
      <div
        className="absolute inset-0 z-[1] bg-cover bg-center brightness-[0.35] saturate-0 md:[clip-path:polygon(0_0,52%_0,62%_100%,0_100%)]"
        style={{ backgroundImage: `url(${TEXTURE_URL})` }}
      />
      <div className="absolute inset-0 z-[2] bg-brand-background/65 md:[clip-path:polygon(0_0,52%_0,62%_100%,0_100%)]" />

      <div className="hidden md:block">
        {/* Amber diagonal accent edge */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <polygon
              points="52,0 55,0 65,100 62,100"
              fill="var(--primary)"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-[4] mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-20">
        <LogoText className="mb-10 w-96" color="white" />

        <div className="flex flex-1 items-center mx-auto md:mx-0">
          <div className="max-w-[560px]">
            <h1 className="font-heading mb-6 text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-[0.93] text-white text-center md:text-left">
              We don&apos;t
              <br />
              just skim
              <br />
              <span className="text-brand-primary">the surface.</span>
            </h1>

            <div className="mb-9 flex flex-col gap-[0.6rem]">
              {["Skimming & Rendering", "Artex Removal", "Full Refurbs"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-[0.6rem] text-[0.9rem] text-[#d0c8be] justify-center md:justify-start"
                  >
                    <span className="font-bold text-brand-primary">✓</span>
                    {item}
                  </div>
                ),
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mx-auto">
              {/* <a
                href="#contact"
                className="font-heading inline-block rounded-[2px] bg-brand-primary px-8 py-[0.9rem] text-[0.9rem] font-semibold tracking-[0.1em] uppercase text-brand-primary-foreground no-underline transition-opacity duration-200 hover:opacity-85"
              >
                Get a Free Quote
              </a> */}
              <div className="flex flex-col text-center md:text-left mx-auto md:mx-0">
                <span className="mb-[0.1rem] text-mb uppercase tracking-[0.1em] text-[#888]">
                  Call or Text
                </span>
                <a
                  href="tel:01610000000"
                  className="font-heading text-lg font-semibold text-white no-underline"
                >
                  01274 032053
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
