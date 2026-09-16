import { Footer } from "@/components/footer/Footer"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>{children}</div>
      <Footer />
    </>
  )
}
