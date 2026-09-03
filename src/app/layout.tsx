import type { Metadata } from "next"
import { Inter, Oswald, Geist } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { cn } from "@/lib/utils";
import { dataset } from "@/sanity/env"

const isProduction = dataset === "production"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

export const metadata: Metadata = {
  title: "Skim Reapers Ltd.",
  description:
    "Skim Reapers Ltd has 20+ years experience in all aspects of plastering and dry lining. We can offer services for both domestic and large commercial projects within the whole of West Yorkshire.  We pride ourselves on excellent quality and service to our customers including a speedy service.",
  robots: isProduction ? undefined : { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, oswald.variable, bronco.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
