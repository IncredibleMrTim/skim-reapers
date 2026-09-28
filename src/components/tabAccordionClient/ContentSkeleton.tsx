import { Skeleton } from "@/components/ui/skeleton"

/**
 * Placeholder for a single tab/accordion panel's content while its primary
 * image loads. Mirrors `PortableTextImage`'s aspect-video shape (marks.tsx)
 * plus a few text-line bars, so swapping in the real content causes no
 * layout shift.
 */
export function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-video w-full rounded-[8px] bg-white/10" />
      <Skeleton className="h-4 w-full bg-white/10" />
      <Skeleton className="h-4 w-5/6 bg-white/10" />
      <Skeleton className="h-4 w-2/3 bg-white/10" />
    </div>
  )
}
