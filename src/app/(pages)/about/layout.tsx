import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("about")

export default function DispatchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
