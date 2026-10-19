import { Suspense } from "react"
import { client } from "@/sanity/client"
import { applicationPageQuery } from "@/sanity/queries"
import type { ApplicationPageQueryResult } from "@/sanity/types"
import { ApplicationClient } from "./ApplicationClient"

export default async function ApplicationPage() {
  const query = (await client.fetch(
    applicationPageQuery,
  )) as ApplicationPageQueryResult

  return (
    // useSearchParams reads the vacancy from the URL in the browser; a static
    // export has no request to read it from, so Next requires a Suspense
    // boundary around it.
    <Suspense>
      <ApplicationClient initialData={query} />
    </Suspense>
  )
}
