import { Hero } from "@/components/Hero"
import { Navbar } from "@/components/Navbar"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="bg-brand-background text-brand-background min-h-full overflow-x-hidden"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        minHeight: "100%",
        overflowX: "hidden",
      }}
    >
      <div className="w-full relative">
        <Navbar />
        <div className="absolute top-0 left-0 z-10 w-full">
          <Hero />
        </div>
      </div>
      {children}
    </div>
  )
}
