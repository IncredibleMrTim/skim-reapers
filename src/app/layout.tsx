import { createPageMetadata } from "@/lib/metadata"
import { Inter, Oswald, Geist } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header/Header"

export const metadata = createPageMetadata("home")

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
})

const bronco = localFont({
  src: "../fonts/Bronco.ttf",
  variable: "--font-bronco",
})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        oswald.variable,
        bronco.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col 3xl:max-w-[1920px] mx-auto bg-brand-background">
        <div>
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
        </div>
      </body>
    </html>
  )
}
