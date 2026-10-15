import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { Separator } from "@/components/ui/separator"
import { ReviewsPageQueryResult } from "@/sanity/types"
import { PortableText } from "@portabletext/react"

export const ReviewList = ({
  reviews,
}: {
  reviews?: NonNullable<ReviewsPageQueryResult>["reviews"]
}) => {
  const dateFormat = new Intl.DateTimeFormat("en-GB")
  const renderStars = (count: string) => {
    let stars: string = ""

    for (let i = 0; i < parseInt(count); i++) {
      stars += "⭐️"
    }
    return stars
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <div className=" bg-white/2 absolute w-full h-full rounded-[8px] border border-white/15 backdrop-blur-lg -z-10" />
      <div className="flex flex-col gap-4 px-4 py-6">
        {reviews?.map((r, idx) => (
          <div key={r._key} className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between pb-2">
              <div>
                <h4 className="text-brand-accent-light font-bold">
                  {r.heading}
                </h4>
              </div>
              <div className="flex gap-8">
                <div className="flex gap-1 italic">
                  <p>{r.source}</p>
                  {r?.date && r?.source && "-"}
                  {r?.date && <p>{dateFormat.format(new Date(r.date))}</p>}
                </div>
                {r?.rating && renderStars(r.rating)}
              </div>
            </div>
            <PortableText
              value={r.description}
              components={PORTABLE_TEXT_COMPONENTS}
            />
            {idx < reviews.length - 1 && <Separator className="mt-2 mb-4" />}
          </div>
        ))}
      </div>
    </div>
  )
}
