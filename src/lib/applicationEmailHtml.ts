import { escapeHtmlPreservingLineBreaks } from "./mailProxy"

interface PortableTextBlockLike {
  _type: string
  listItem?: string
  children?: Array<{ _type?: string; text?: string }>
}

/**
 * Flattens Portable Text to plain text for an email: full text (unlike
 * `toPlainText`, which shortens each span), a blank line between paragraphs,
 * and list items as bullets. Formatting, links and inline icons are dropped
 * because the site's styling doesn't exist inside an email client.
 */
export function portableTextToPlainText(
  blocks: ReadonlyArray<PortableTextBlockLike> | null | undefined,
): string {
  const lines = (blocks ?? [])
    .filter((block) => block._type === "block" && block.children)
    .map((block) => ({
      isListItem: Boolean(block.listItem),
      text: (block.children ?? []).map((child) => child.text ?? "").join(""),
    }))
    .filter(({ text }) => text.trim().length > 0)

  // Bullets sit together on consecutive lines; other paragraphs get a blank
  // line between them.
  return lines.reduce((output, line, index) => {
    const bullet = line.isListItem ? `• ${line.text}` : line.text
    if (index === 0) return bullet
    const separator =
      line.isListItem && lines[index - 1].isListItem ? "\n" : "\n\n"
    return output + separator + bullet
  }, "")
}

/**
 * The "About the role" box for the applicant's confirmation email. Empty when
 * there is no description, so the email simply leaves the box out. Built from
 * escaped text, so it is safe to insert as trusted HTML.
 */
export function buildRoleSectionHtml(
  roleTitle: string,
  roleDescription: string | undefined,
): string {
  if (!roleDescription?.trim()) return ""
  return `<div style="border: 1px solid #e5e5e5; border-radius: 4px;"><h2 style="font-size: 18px; border-bottom: 1px solid #e5e5e5; background: #AF7C3C; color: #ffffff; margin: 0; padding: 10px;">About the role: ${escapeHtmlPreservingLineBreaks(roleTitle)}</h2><p style="padding: 10px;">${escapeHtmlPreservingLineBreaks(roleDescription)}</p></div><br />`
}
