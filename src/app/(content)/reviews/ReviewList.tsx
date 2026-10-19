import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { Separator } from "@/components/ui/separator"
import { ReviewsPageQueryResult } from "@/sanity/types"
import { PortableText } from "@portabletext/react"
import { Fragment } from "react"
import { dateFormat } from "@/lib/utils"

export const ReviewList = ({
  reviews,
}: {
  reviews?: NonNullable<ReviewsPageQueryResult>["reviews"]
}) => {
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
          <Fragment key={r._key}>
            <div className="flex flex-col">
              <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0 justify-between pb-2">
                <div className="flex flex-col gap-2 pr-4">
                  <h4 className="text-brand-accent-light font-bold">
                    {r.heading}
                  </h4>
                  <PortableText
                    value={r.description}
                    components={PORTABLE_TEXT_COMPONENTS}
                  />
                </div>
                <div className="flex flex-col gap-2 items-start md:items-end pr-4">
                  {r?.rating && renderStars(r.rating)}
                  <div className="flex gap-1 text-sm border-b md:border-none border-brand-content/30">
                    <p>{r.source}</p>
                    {r?.date && r?.source && "-"}
                    {r?.date && <p>{dateFormat.format(new Date(r.date))}</p>}
                  </div>
                </div>
              </div>
            </div>
            {idx < reviews.length - 1 && <Separator className="mt-2 mb-4" />}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
