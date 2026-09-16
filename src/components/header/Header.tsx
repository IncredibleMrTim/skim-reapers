import { Navbar } from "../Navbar"
import { Hero } from "../hero/Hero"
import type { HomePageQueryResult } from "@/sanity/types"

type HeaderProps = {
  hero?: NonNullable<HomePageQueryResult>["hero"]
}

export const Header = ({ hero }: HeaderProps) => {
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

      <Hero hero={hero} />
    </section>
  )
}
