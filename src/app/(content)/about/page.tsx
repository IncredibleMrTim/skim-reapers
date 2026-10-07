import { client } from "@/sanity/client"
import { aboutPageQuery } from "@/sanity/queries"
import type { AboutPageQueryResult } from "@/sanity/types"
import { AboutClient } from "./AboutClient"

export default async function AboutPage() {
  const query = (await client.fetch(aboutPageQuery)) as AboutPageQueryResult

  return <AboutClient initialData={query} />
}
