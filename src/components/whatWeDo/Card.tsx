import Image from "next/image"

interface ICard {
  image?: string
  title: string
  text: string
  url?: string
}

export const Card = ({ image, title, text, url }: ICard) => {
  return (
    <div className="text-center mx-auto w-[calc(50%-0.5rem)] md:w-1/6 z-10 text-brand-accent-foreground px-6 py-4 border border-background/10">
      <div className="flex flex-col items-center justify-between gap-2 w-full h-full">
        <div className="flex flex-col gap-1 items-center justify-between">
          {image && (
            <Image
              width="70"
              height="70"
              alt={`${title} service button`}
              src={image}
              className="w-15 h-15 brightness-90"
            />
          )}
          <div className="text-md">{title}</div>
        </div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  )
}
