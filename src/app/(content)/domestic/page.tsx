import { client } from "@/sanity/client"
import { domesticPageQuery } from "@/sanity/queries"
import type { DomesticPageQueryResult } from "@/sanity/types"
import { DomesticClient } from "./DomesticClient"

export default async function DomesticPage() {
  const query = (await client.fetch(
    domesticPageQuery,
  )) as DomesticPageQueryResult

  return <DomesticClient initialData={query} />
}
