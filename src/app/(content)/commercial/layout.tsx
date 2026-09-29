import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("commercial")

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
