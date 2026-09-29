import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("ourWork")

export default function OurWorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
