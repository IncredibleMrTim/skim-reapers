import * as Ai from "react-icons/ai"
import * as Bi from "react-icons/bi"
import * as Bs from "react-icons/bs"
import * as Cg from "react-icons/cg"
import * as Ci from "react-icons/ci"
import * as Di from "react-icons/di"
import * as Fa from "react-icons/fa"
import * as Fa6 from "react-icons/fa6"
import * as Fc from "react-icons/fc"
import * as Fi from "react-icons/fi"
import * as Gi from "react-icons/gi"
import * as Go from "react-icons/go"
import * as Gr from "react-icons/gr"
import * as Hi from "react-icons/hi"
import * as Hi2 from "react-icons/hi2"
import * as Im from "react-icons/im"
import * as Io from "react-icons/io"
import * as Io5 from "react-icons/io5"
import * as Lia from "react-icons/lia"
import * as Lu from "react-icons/lu"
import * as Md from "react-icons/md"
import * as Pi from "react-icons/pi"
import * as Ri from "react-icons/ri"
import * as Rx from "react-icons/rx"
import * as Si from "react-icons/si"
import * as Sl from "react-icons/sl"
import * as Tb from "react-icons/tb"
import * as Tfi from "react-icons/tfi"
import * as Ti from "react-icons/ti"
import * as Vsc from "react-icons/vsc"
import * as Wi from "react-icons/wi"
import type { IconType } from "react-icons"
import type { CardIcon } from "@/sanity/types"

const ICON_PACKAGES: Record<string, Record<string, IconType>> = {
  ai: Ai,
  bi: Bi,
  bs: Bs,
  cg: Cg,
  ci: Ci,
  di: Di,
  fa: Fa,
  fa6: Fa6,
  fc: Fc,
  fi: Fi,
  gi: Gi,
  go: Go,
  gr: Gr,
  hi: Hi,
  hi2: Hi2,
  im: Im,
  io: Io,
  io5: Io5,
  lia: Lia,
  lu: Lu,
  md: Md,
  pi: Pi,
  ri: Ri,
  rx: Rx,
  si: Si,
  sl: Sl,
  tb: Tb,
  tfi: Tfi,
  ti: Ti,
  vsc: Vsc,
  wi: Wi,
}

/** Resolves a Sanity-authored { name, package } pair (e.g. "FaHome", "react-icons/fa") to its react-icons component. */
export function getIconComponent(icon?: CardIcon): IconType | undefined {
  if (!icon) return undefined

  const packageKey = icon.package.toLowerCase()
  return ICON_PACKAGES[packageKey]?.[icon.name]
}
