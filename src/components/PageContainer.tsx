import { hero } from "@/sanity/schemaTypes/hero"
import { Header } from "./header/Header"
import type { Hero as HeroData } from "@/sanity/types"
import { ReactNode } from "react"

type TPageContainerProps = {
  floatingHero?: boolean
  children: ReactNode
}

export const PageContainer = ({
  floatingHero = false,
  children,
}: TPageContainerProps) => {
  return (
    <div className={`${floatingHero ? "p-10" : ""}`}>
      {floatingHero ? (
        <section className="relative flex flex-1 pt-20 md:pt-20 w-full">
          <div className="flex relative z-10 px-0 md:px-8 w-full max-w-[1920px] mx-auto md:ml-(--hero-content-width) md:w-[calc(100%-var(--hero-content-width))] border-none md:border-l border-l-white/10">
            {children}
          </div>
        </section>
      ) : (
        <section className="w-full mx-auto">
          <div className="mx-auto">{children}</div>
        </section>
      )}
    </div>
  )
}
