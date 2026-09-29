import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("services")

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
