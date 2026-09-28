import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "../ui/spinner"
/**
 * Placeholder for a single tab/accordion panel's content while its primary
 * image loads. Mirrors `PortableTextImage`'s aspect-video shape (marks.tsx)
 * plus a few text-line bars, so swapping in the real content causes no
 * layout shift.
 */
export function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full h-100 rounded bg-white/10 p-4">
        <Spinner className="mx-auto my-auto size-8 h-full" role="article" />
      </Skeleton>
      <Skeleton className="h-4 w-full bg-white/10 rounded" />
      <Skeleton className="h-4 w-2/3 bg-white/10 rounded" />
      <Skeleton className="h-4 w-1/3 bg-white/10 rounded" />
    </div>
  )
}
