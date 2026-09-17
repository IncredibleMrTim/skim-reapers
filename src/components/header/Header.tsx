import type { ComponentType } from "react"
import { Navbar } from "../Navbar"
import { Hero } from "../hero/Hero"
import type { Hero as HeroData } from "@/sanity/types"

type HeaderProps = {
  hero?: HeroData | null
  customComp?: ComponentType
}

export const Header = ({ hero, customComp }: HeaderProps) => {
  return (
    <section
      id="home"
      className="relative flex w-full flex-col grow-0 h-190 md:h-164 overflow-hidden bg-brand-background text-brand-background mx-auto"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        overflowX: "hidden",
      }}
    >
      <div className="w-full">
        <Navbar />
      </div>

      <Hero hero={hero} customComp={customComp} />
    </section>
  )
}
