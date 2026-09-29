import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("contact")

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
