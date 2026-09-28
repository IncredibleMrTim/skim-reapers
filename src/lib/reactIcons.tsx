"use client"

import { useEffect, useState } from "react"
import type { IconBaseProps, IconType } from "react-icons"

type IconReference = { name?: string; package?: string }

/**
 * One dynamic `import()` per react-icons set, each a separate chunk. Keeping
 * these as literal `import("react-icons/<set>")` calls (rather than a
 * template) is what lets the bundler code-split them individually — only the
 * set a piece of Sanity content actually references gets downloaded, instead
 * of every icon in every set shipping on every page.
 */
const ICON_PACKAGE_LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  ai: () => import("react-icons/ai"),
  bi: () => import("react-icons/bi"),
  bs: () => import("react-icons/bs"),
  cg: () => import("react-icons/cg"),
  ci: () => import("react-icons/ci"),
  di: () => import("react-icons/di"),
  fa: () => import("react-icons/fa"),
  fa6: () => import("react-icons/fa6"),
  fc: () => import("react-icons/fc"),
  fi: () => import("react-icons/fi"),
  gi: () => import("react-icons/gi"),
  go: () => import("react-icons/go"),
  gr: () => import("react-icons/gr"),
  hi: () => import("react-icons/hi"),
  hi2: () => import("react-icons/hi2"),
  im: () => import("react-icons/im"),
  io: () => import("react-icons/io"),
  io5: () => import("react-icons/io5"),
  lia: () => import("react-icons/lia"),
  lu: () => import("react-icons/lu"),
  md: () => import("react-icons/md"),
  pi: () => import("react-icons/pi"),
  ri: () => import("react-icons/ri"),
  rx: () => import("react-icons/rx"),
  si: () => import("react-icons/si"),
  sl: () => import("react-icons/sl"),
  tb: () => import("react-icons/tb"),
  tfi: () => import("react-icons/tfi"),
  ti: () => import("react-icons/ti"),
  vsc: () => import("react-icons/vsc"),
  wi: () => import("react-icons/wi"),
}

/**
 * Resolves a Sanity-authored { name, package } pair (e.g. "FaHome",
 * "react-icons/fa" or just "fa") to its react-icons component, loading only
 * that one icon set on demand.
 */
async function loadIconComponent(
  icon?: IconReference,
): Promise<IconType | undefined> {
  if (!icon?.name || !icon.package) return undefined

  const packageKey = icon.package.toLowerCase().replace(/^react-icons\//, "")
  const loadPackage = ICON_PACKAGE_LOADERS[packageKey]
  if (!loadPackage) return undefined

  const iconPackage = await loadPackage()
  const component = iconPackage[icon.name]
  return typeof component === "function" ? (component as IconType) : undefined
}

type DynamicReactIconProps = IconBaseProps & { icon?: IconReference }

/**
 * Renders a Sanity-authored react-icon. Code-split per icon set so pages
 * only ever download the sets their own content actually references.
 */
export function DynamicReactIcon({ icon, ...props }: DynamicReactIconProps) {
  const [Icon, setIcon] = useState<IconType | null>(null)

  useEffect(() => {
    let isCancelled = false

    loadIconComponent(icon).then((component) => {
      if (!isCancelled) setIcon(() => component ?? null)
    })

    return () => {
      isCancelled = true
    }
    // Depend on the primitive fields, not `icon` itself — Sanity content
    // often hands this a fresh object literal each render, which would
    // otherwise re-trigger the dynamic import on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icon?.name, icon?.package])

  if (!Icon) return null

  return <Icon {...props} />
}
