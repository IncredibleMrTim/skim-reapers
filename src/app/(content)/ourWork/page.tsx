import { client } from "@/sanity/client"
import { ourWorkPageQuery } from "@/sanity/queries"
import type { OurWorkPage as OurWorkPageQueryResults } from "@/sanity/types"
import { OurWorkClient } from "./OurWorkClient"

export default async function OurWorkPage() {
  const query = (await client.fetch(
    ourWorkPageQuery,
  )) as OurWorkPageQueryResults

  return <OurWorkClient initialData={query} />
}
