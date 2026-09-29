import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("domestic")

export default function DomesticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
