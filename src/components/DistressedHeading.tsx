import type { ReactNode } from "react"

interface DistressedHeadingProps {
  children: ReactNode
  size?: string
  font?: string
  className?: string
  /** 0 (flat, no texture) to 100 (harsh, high-contrast mottling). Defaults to 25. */
  distress?: number
}

function buildNoiseTextureUrl(distress: number): string {
  const slope = 1 + 0.02 * distress
  const intercept = -0.01 * distress
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035 0.09' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='${slope}' intercept='${intercept}'/%3E%3CfeFuncG type='linear' slope='${slope}' intercept='${intercept}'/%3E%3CfeFuncB type='linear' slope='${slope}' intercept='${intercept}'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`
}

/** Bold Bronco-font heading with a mottled, weathered paint-texture fill. */
export const DistressedHeading = ({
  children,
  size = "text-8xl",
  font = "font-bronco",
  className = "",
  distress = 25,
}: DistressedHeadingProps) => {
  return (
    <div
      className={`${font} whitespace-pre-line bg-clip-text text-transparent opacity-80 ${size} ${className}`}
      style={{
        backgroundImage: `linear-gradient(#fff, #fff), url("${buildNoiseTextureUrl(distress)}")`,
        backgroundSize: "420px 420px",
        backgroundBlendMode: "multiply",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </div>
  )
}
