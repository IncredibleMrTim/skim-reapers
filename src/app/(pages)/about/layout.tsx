import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("about")

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
