import { Header } from "@/components/header/Header"
import { client } from "@/sanity/client"
import { servicesPageQuery } from "@/sanity/queries"
import type { ServicesPageQueryResult } from "@/sanity/types"
import Image from "next/image"

export default async function ServicesPage() {
  const servicePage = (await client.fetch(
    servicesPageQuery,
  )) as ServicesPageQueryResult

  return (
    <>
      <Header hero={servicePage?.hero ?? undefined} />
      <div className="w-full mx-auto pt-164">
        <main className="mx-auto"></main>
      </div>
    </>
  )
}
