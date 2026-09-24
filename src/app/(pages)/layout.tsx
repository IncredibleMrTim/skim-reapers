import { Footer } from "@/components/footer/Footer"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  )
}
