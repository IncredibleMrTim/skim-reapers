import type { ReactNode } from "react"
import type { PortableTextComponents } from "@portabletext/react"

/**
 * Single source of truth for how each custom Portable Text mark renders.
 * Consumed both by the real frontend (`@portabletext/react`) and by
 * `PortableTextLiveInput`'s Studio editing canvas, so the two can never
 * drift out of sync the way the hand-duplicated versions previously did.
 */

type MarkProps = { children: ReactNode }

export function SmallMark({ children }: MarkProps) {
  return <span className="text-sm">{children}</span>
}

export function MediumMark({ children }: MarkProps) {
  return <span className="text-2xl">{children}</span>
}

export function LargeMark({ children }: MarkProps) {
  return <span className="text-4xl">{children}</span>
}

export function AccentMark({ children }: MarkProps) {
  return <span style={{ color: "var(--accent)" }}>{children}</span>
}

/**
 * Heading-*looking* marks, not semantic headings — Portable Text's `style`
 * field is block-only, so there's no way to make part of a paragraph a real
 * `<h1>`. These give editors the same visual weight on an arbitrary text
 * selection via an inline `<span>`, sized to match the block-level heading
 * styles (see `STYLE_TAGS` in `PortableTextLiveInput.tsx`).
 */
export function Heading1Mark({ children }: MarkProps) {
  return <span className="text-4xl font-bold">{children}</span>
}

export function Heading2Mark({ children }: MarkProps) {
  return <span className="text-3xl font-bold">{children}</span>
}

export function Heading3Mark({ children }: MarkProps) {
  return <span className="text-2xl font-bold">{children}</span>
}

export function Heading4Mark({ children }: MarkProps) {
  return <span className="text-xl font-bold">{children}</span>
}

/**
 * `@portabletext/editor` ships no built-in decorator styling at all ("the
 * engine applies no decorator markup of its own") — unlike `@portabletext/react`,
 * which already renders these natively on the frontend. These exist only to
 * give the Studio editing canvas the same visual feedback for the standard
 * marks that the bundled editor would normally provide for free.
 */
export function StrongMark({ children }: MarkProps) {
  return <strong className="font-bold">{children}</strong>
}

export function EmMark({ children }: MarkProps) {
  return <em>{children}</em>
}

export function UnderlineMark({ children }: MarkProps) {
  return <span className="underline">{children}</span>
}

export function CodeMark({ children }: MarkProps) {
  return (
    <code className="rounded bg-black/10 px-1 font-mono text-sm">
      {children}
    </code>
  )
}

export function StrikeMark({ children }: MarkProps) {
  return <span className="line-through">{children}</span>
}

export function ColorMark({ children, hex }: MarkProps & { hex?: string }) {
  return hex ? <span style={{ color: hex }}>{children}</span> : <>{children}</>
}

export function LinkMark({ children, href }: MarkProps & { href?: string }) {
  return (
    <a
      href={href}
      className="underline hover:text-brand-accent"
      {...(href?.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  )
}

/** Decorators with no data of their own — just wrap `children`. */
export const DECORATOR_MARKS: Record<
  string,
  (props: MarkProps) => ReactNode
> = {
  small: SmallMark,
  medium: MediumMark,
  large: LargeMark,
  accent: AccentMark,
  heading1: Heading1Mark,
  heading2: Heading2Mark,
  heading3: Heading3Mark,
  heading4: Heading4Mark,
  strong: StrongMark,
  em: EmMark,
  underline: UnderlineMark,
  code: CodeMark,
  "strike-through": StrikeMark,
}

export function renderDecoratorMark(name: string, children: ReactNode) {
  const Mark = DECORATOR_MARKS[name]
  return Mark ? <Mark>{children}</Mark> : children
}

/** Annotations carry their own data (href, color), read from the markDef/value object. */
export function renderAnnotationMark(
  typeName: string,
  value: unknown,
  children: ReactNode,
) {
  if (typeName === "link") {
    const href = (value as { href?: string } | undefined)?.href
    return <LinkMark href={href}>{children}</LinkMark>
  }
  if (typeName === "color") {
    const hex = (value as { hex?: string } | undefined)?.hex
    return <ColorMark hex={hex}>{children}</ColorMark>
  }
  return children
}

/**
 * Drop this straight into `<PortableText components={PORTABLE_TEXT_COMPONENTS} />`
 * on any page rendering these custom marks. Strong/em/underline/code/strike
 * aren't listed here — `@portabletext/react` already renders those natively.
 */
export const PORTABLE_TEXT_COMPONENTS: PortableTextComponents = {
  marks: {
    small: ({ children }) => renderDecoratorMark("small", children),
    medium: ({ children }) => renderDecoratorMark("medium", children),
    large: ({ children }) => renderDecoratorMark("large", children),
    accent: ({ children }) => renderDecoratorMark("accent", children),
    heading1: ({ children }) => renderDecoratorMark("heading1", children),
    heading2: ({ children }) => renderDecoratorMark("heading2", children),
    heading3: ({ children }) => renderDecoratorMark("heading3", children),
    heading4: ({ children }) => renderDecoratorMark("heading4", children),
    link: ({ children, value }) =>
      renderAnnotationMark("link", value, children),
    color: ({ children, value }) =>
      renderAnnotationMark("color", value, children),
  },
}
