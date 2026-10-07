import { client } from "@/sanity/client"
import { reviewsPageQuery } from "@/sanity/queries"
import type { ReviewsPageQueryResult } from "@/sanity/types"
import { ReviewsClient } from "./ReviewsClient"

export default async function ReviewsPage() {
  const query = (await client.fetch(reviewsPageQuery)) as ReviewsPageQueryResult

  return <ReviewsClient initialData={query} />
}
