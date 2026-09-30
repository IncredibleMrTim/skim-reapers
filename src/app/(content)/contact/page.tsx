import { client } from "@/sanity/client"
import { contactPageQuery } from "@/sanity/queries"
import type { ContactPage as ContactPageQueryResults } from "@/sanity/types"
import { ContactClient } from "./ContactClient"

export default async function OurWorkPage() {
  const query = (await client.fetch(
    contactPageQuery,
  )) as ContactPageQueryResults

  return <ContactClient initialData={query} />
}
