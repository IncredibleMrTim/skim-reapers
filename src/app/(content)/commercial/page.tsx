import { client } from "@/sanity/client"
import { commercialPageQuery } from "@/sanity/queries"
import type { CommercialPageQueryResult } from "@/sanity/types"
import { CommercialClient } from "./CommercialClient"

export default async function CommercialPage() {
  const query = (await client.fetch(
    commercialPageQuery,
  )) as CommercialPageQueryResult

  return <CommercialClient initialData={query} />
}
