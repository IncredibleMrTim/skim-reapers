import { client } from "@/sanity/client"
import { workWithUsPageQuery } from "@/sanity/queries"
import type { WorkWithUsPageQueryResult } from "@/sanity/types"
import { WorkWithUsClient } from "./WorkWithUsClient"

export default async function WorkWithUsPage() {
  const query = (await client.fetch(
    workWithUsPageQuery,
  )) as WorkWithUsPageQueryResult

  return <WorkWithUsClient initialData={query} />
}
