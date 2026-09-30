import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("workWithUs")

export default function WorkWithUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
