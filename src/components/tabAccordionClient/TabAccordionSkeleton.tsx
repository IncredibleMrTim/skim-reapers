import { Skeleton } from "@/components/ui/skeleton"

/**
 * Suspense fallback for TabAccordionClient. `useSearchParams` (used to open
 * the service a nav link points to) forces this subtree to client-render,
 * so something has to paint before that resolves — this mirrors the real
 * layout (vertical tab rail on desktop, stacked rows on mobile) so there's
 * no layout shift once the real tabs/accordion swap in.
 */
export function TabAccordionSkeleton({
  isMobile,
  itemCount,
}: {
  isMobile: boolean
  itemCount: number
}) {
  const rows = Math.max(itemCount, 4)

  if (isMobile) {
    return (
      <div className="bg-transparent w-full h-auto border border-white/20 p-2 rounded flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded bg-white/10" />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-transparent w-full h-full gap-2 border-none p-2 rounded flex">
      <div className="bg-black/30 rounded w-auto min-h-140 flex flex-col gap-1 p-1">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-40 rounded bg-white/10" />
        ))}
      </div>
      <div className="flex-1 p-4 bg-black/30 border-t border-t-brand-accent/30 flex flex-col gap-3">
        <Skeleton className="h-8 w-1/3 bg-white/10" />
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-5/6 bg-white/10" />
        <Skeleton className="h-4 w-2/3 bg-white/10" />
      </div>
    </div>
  )
}
