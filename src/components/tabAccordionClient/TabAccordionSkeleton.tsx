import { Skeleton } from "@/components/ui/skeleton"

/**
 * Suspense fallback for TabAccordionClient. `useSearchParams` (used to open
 * the service a nav link points to) forces this subtree to client-render,
 * so something has to paint before that resolves — and since this is a
 * static export, there's no real viewport at build time to know whether
 * that'll be a phone or a desktop. Rather than branch on the JS `isMobile`
 * value (which is always `false` during the server render, so the fallback
 * would always bake in as the desktop shape and overflow on an actual
 * mobile-width load), this is responsive via plain `md:` classes — it
 * matches whatever viewport is actually loading it with no JS required.
 */
export function TabAccordionSkeleton({ itemCount }: { itemCount: number }) {
  const rows = Math.max(itemCount, 4)

  return (
    <div className="bg-transparent w-full h-auto md:h-full border border-white/20 md:border-none p-2 rounded flex flex-col md:flex-row gap-2">
      <div className="flex flex-col gap-2 md:gap-1 md:bg-black/30 md:rounded md:w-auto md:min-h-140 md:p-1">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-14 md:h-10 w-full md:w-40 rounded bg-white/10"
          />
        ))}
      </div>
      <div className="hidden md:flex flex-1 flex-col gap-3 p-4 bg-black/30 border-t border-t-brand-accent/30">
        <Skeleton className="h-8 w-1/3 bg-white/10" />
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-5/6 bg-white/10" />
        <Skeleton className="h-4 w-2/3 bg-white/10" />
      </div>
    </div>
  )
}
