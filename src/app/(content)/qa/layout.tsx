import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata("qa")

export default function QaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
