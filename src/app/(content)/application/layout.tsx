import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("application")

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
