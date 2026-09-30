import { client } from "@/sanity/client"
import { servicesPageQuery } from "@/sanity/queries"
import type { ServicesPageQueryResult } from "@/sanity/types"
import { ServicesClient } from "./ServicesClient"

export default async function ServicesPage() {
  const query = (await client.fetch(
    servicesPageQuery,
  )) as ServicesPageQueryResult

  return <ServicesClient initialData={query} />
}
