import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("reviews")

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
