import { DistressedHeading } from "../DistressedHeading"
import { Button } from "../ui/button"
import { HiArrowNarrowRight } from "react-icons/hi"
import { Card } from "./Card"

export const WhatWeDo = () => {
  return (
    <div className="relative flex flex-col md:flex-row gap-8 justify-between w-full bg-brand-content px-9 py-4">
      <div
        className="absolute top-0 left-0 w-full h-full z-1 opacity-30"
        style={{
          backgroundImage: "URL('/drywall_texture.jpg')",
          backgroundSize: "20%",
        }}
      />
      <div className="flex flex-col gap-1 md:w-150 z-10 w-full">
        <h2 className="text-brand-accent">What We Do</h2>
        <div className="flex flex-col gap-1">
          <DistressedHeading color="#000" className="text-3xl" distress={0}>
            COMPLETE PLASTERING AND DRY LINING SOLUTIONS
          </DistressedHeading>
          <p className="text-brand-accent-foreground text-sm">
            From specification to final finish. We supply, coordinate and
            deliver complete internal packages - on time, on budget, to the
            highest standard.
          </p>
          <div>
            <Button variant="secondary" size="lg" className="text-white">
              VIEW ALL SERVICES
              <HiArrowNarrowRight className="mt-0.5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <Card
          image="/icons/plastering.png"
          title="PLASTERING"
          text="Skimming, bonding, float & set, over-skimming & more."
        />
        <Card
          image="/icons/dry-lining-partitioning.png"
          title="DRY-LINING & PARTITIONING"
          text="Plasterboarding, stud walls, MF ceilings & systems."
        />
        <Card
          image="/icons/insulation-performance.png"
          title="INSULATION & PERFORMANCE"
          text="IWI, loft insulation, acoustic & damp resistant systems."
        />
        <Card
          image="/icons/traditional-lime.png"
          title="TRADITIONAL & LIME"
          text="Lime plastering, restoration & heritage work."
        />
        <Card
          image="/icons/feature-bespoke.png"
          title="FEATURE & BESPOKE"
          text="Media walls, feature ceilings & bespoke finishes."
        />
        <Card
          image="/icons/removal-preparation.png"
          title="REMOVAL & PREPARATION"
          text="Plaster rip-outs, lath & plaster removal & preparation."
        />
      </div>
    </div>
  )
}
