import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { aboutPageQuery } from "@/sanity/queries"
import type { AboutPageQueryResult } from "@/sanity/types"

export default async function AboutPage() {
  const aboutPage = (await client.fetch(aboutPageQuery)) as AboutPageQueryResult

  const headerCustomComp = () => {
    return (
      <div className="flex flex-1 bg-red-300 self-stretch">Hello</div>
    )
  }

  return (
    <>
      <Header
        hero={aboutPage?.hero ?? undefined}
        customComp={headerCustomComp}
      />

      <section className="mx-auto w-full bg-red-500">
        <h1 className="text-3xl font-semibold tracking-tight">
          About Skim Reapers
        </h1>
      </section>
    </>
  )
}
