import { Footer } from "@/components/footer/Footer"
import { Header } from "@/components/header/Header"
import { Separator } from "@/components/ui/separator"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className="bg-brand-background text-brand-background mx-auto"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          overflowX: "hidden",
        }}
      >
        <Header />
      </div>
      <div>{children}</div>
      <Separator variant="linear" className="via-brand-content/50" />
      <Footer />
    </>
  )
}
