import { client } from "@/sanity/client"
import { ourWorkPageQuery } from "@/sanity/queries"
import type { OurWorkPageQueryResult } from "@/sanity/types"
import { OurWorkClient } from "./OurWorkClient"

export default async function OurWorkPage() {
  const query = (await client.fetch(ourWorkPageQuery)) as OurWorkPageQueryResult

  return <OurWorkClient initialData={query} />
}
