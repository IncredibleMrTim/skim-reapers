import { Navbar } from "@/components/Navbar"

export default function AboutPage() {
  return (
    <div className="bg-brand-background text-brand-foreground min-h-full">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">
          About Skim Reapers
        </h1>
      </main>
    </div>
  )
}
