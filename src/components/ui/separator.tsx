"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "cn"

function Separator({
  className,
  orientation = "horizontal",
  variant = "solid",
  ...props
}: SeparatorPrimitive.Props & {
  variant?: "linear" | "solid"
}) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        // vertical separators collapse to a horizontal line below md, since the
        // layouts they divide also switch from stacked to side-by-side at md
        "shrink-0 bg-border h-px w-full md:data-vertical:h-auto md:data-vertical:w-px md:data-vertical:self-stretch",
        // color is set entirely via className (e.g. "via-brand-accent") since Tailwind
        // can't generate classes built from a dynamic `color` prop at build time

        variant === "linear" &&
          "bg-linear-to-r md:data-vertical:bg-linear-to-b from-transparent from-5% via-40% via-white to-transparent to-95%",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
