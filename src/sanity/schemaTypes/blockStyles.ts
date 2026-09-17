/**
 * Shared block styles for `type: "block"` fields. "Normal" must stay first —
 * the Portable Text engine treats the first style as the default a new
 * block resets to after Enter (see `PortableTextLiveInput`).
 */
export const BLOCK_STYLES = [
  { title: "Normal", value: "normal" },
  { title: "Heading 1", value: "h1" },
  { title: "Heading 2", value: "h2" },
  { title: "Heading 3", value: "h3" },
  { title: "Heading 4", value: "h4" },
  { title: "Quote", value: "blockquote" },
]
