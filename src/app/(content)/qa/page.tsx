import { client } from "@/sanity/client"
import { qaPageQuery } from "@/sanity/queries"
import type { QaPageQueryResult } from "@/sanity/types"
import { QaClient } from "./QaClient"

export default async function QaPage() {
  const query = (await client.fetch(qaPageQuery)) as QaPageQueryResult

  return <QaClient initialData={query} />
}
