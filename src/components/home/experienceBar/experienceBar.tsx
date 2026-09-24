import { Button } from "@/components/ui/button"
import { HiArrowNarrowRight } from "react-icons/hi"
import { TfiCup } from "react-icons/tfi"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export const ExperienceBar = () => {
  return (
    <div className="relative flex flex-col md:flex-row justify-between  w-full items-center bg-brand-background mb-4 md:mb-0">
      <Image
        width={500}
        height={500}
        alt="Experience bar image"
        src="/grim_reaper.png"
        className="self-stretch object-cover"
      />

      <Separator
        variant="linear"
        orientation="vertical"
        className="via-brand-content/50"
      />
      <div className="flex flex-wrap md:flex-nowrap flex-col md:flex-row items-center md:items-start w-full gap-8 md:gap-2 mt-8 md:mt-0 py-4">
        <div className="flex flex-col self-stretch w-full md:w-1/4 justify-between px-4 items-center md:items-start gap-4 md:gap-1">
          <div className="flex flex-col gap-4 md:gap-1 items-center md:items-start text-center md:text-left">
            <div>
              <p className="text-brand-accent text-sm">THE NAME IS NEW.</p>
              <p className="text-brand-content">THE EXPERIENCE ISN&apos;T.</p>
            </div>
            <p className="text-brand-content text-sm md:text-xs">
              Skim Reapers is the next chapter of an established plastering
              business, built on 20 years of hands-on experience - same values,
              same standards. Bigger ambition.
            </p>
          </div>
          <div>
            <Button variant="outline" size="lg" className="text-brand-content">
              READ OUR STORY
              <HiArrowNarrowRight className="mt-0.5" />
            </Button>
          </div>
        </div>
        <Separator
          variant="linear"
          orientation="vertical"
          className="via-brand-content/50"
        />
        <div className="w-full md:w-1/8 justify-center md:justify-start flex px-4">
          <div className="flex flex-row md:flex-col xl:flex-row">
            <TfiCup className="text-brand-accent size-20 md:size-14 xl:size-20" />
            <div className="flex flex-wrap flex-col text-center gap-1 ">
              <span className="text-6xl">20</span>
              <p>YEARS EXPERIENCE</p>
            </div>
          </div>
        </div>
        <Separator
          variant="linear"
          orientation="vertical"
          className="via-brand-content/50"
        />
        <div className="flex flex-col md:flex-row justify-between gap-4 w-full md:w-5/8 self-stretch flex-1 items-center px-4">
          <div className="flex flex-col justify-between items-center md:items-start h-full max-md:w-full md:flex-auto gap-4 w-1/4">
            <div>
              <p className="text-lg">THE STANDARD SPEAKS FOR ITSELF.</p>
              <p className="text-sm">Take a look at some of our projects.</p>
            </div>
            <div>
              <Button variant="outline" size="lg">
                VIEW OUR WORK
                <HiArrowNarrowRight className="mt-0.5" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 w-3/4 flex-col md:flex-row">
            <div className="relative flex-1 min-w-0 max-md:w-full aspect-150/107">
              <Image
                alt="Experience bar image"
                src="/grim_reaper.png"
                fill
                className="object-cover border border-brand-content/70"
              />
            </div>
            <div className="relative flex-1 min-w-0 max-md:w-full aspect-150/107">
              <Image
                alt="Experience bar image"
                src="/grim_reaper.png"
                fill
                className="object-cover border border-brand-content/70"
              />
            </div>
            <div className="relative flex-1 min-w-0 max-md:w-full aspect-150/107">
              <Image
                alt="Experience bar image"
                src="/grim_reaper.png"
                fill
                className="object-cover border border-brand-content/70"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
