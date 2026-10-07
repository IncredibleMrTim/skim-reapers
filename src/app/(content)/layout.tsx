import { Footer } from "@/components/footer/Footer"

/**
 * Shared shell for content pages: on `md:` and up, header/nav stay pinned
 * and the footer stays in view while the body content scrolls internally
 * (see `PageContainer`'s `fillHeight` prop for the matching flex-1/min-h-0
 * chain on the content side). Lives in its own route group, outside
 * `(pages)`, because capping height like this requires an ancestor that
 * also renders `Footer` — doing it in `(pages)/layout.tsx` would clip
 * pages that rely on normal document scrolling, like the homepage.
 *
 * Mobile falls back to normal full-page scrolling — `Footer`'s natural
 * stacked-section height leaves almost no room for pinned content on a
 * short mobile viewport.
 *
 * `md:overflow-hidden` on the content wrapper also matters because it's
 * `Header`'s positioning anchor (`relative`): `Header`'s floating hero
 * sizes itself to its own text rather than to this box, so long hero copy
 * would otherwise bleed through and paint over `Footer` (higher z-index).
 */
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:h-dvh md:overflow-hidden">
      <div className="relative flex flex-col md:flex-1 md:min-h-0 md:overflow-hidden">
        {children}
      </div>
      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
    </div>
  )
}
