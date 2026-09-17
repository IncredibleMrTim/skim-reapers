import { useState } from "react"
import { defineType, defineField, defineArrayMember } from "sanity"
import { BLOCK_STYLES } from "@/sanity/schemaTypes/blockStyles"

const HERO_DATA_SLOTS: { slot: string; description?: string }[] = [
  { slot: "hero-container", description: "outer wrapper" },
  {
    slot: "hero-content-container",
    description: "text column (eyebrow, heading, sub-heading, content)",
  },
  { slot: "hero-eyebrow" },
  { slot: "hero-heading" },
  { slot: "hero-subheading" },
  { slot: "hero-content", description: "portable text body" },
]

/** Click-to-copy CSS attribute selector, shown in the customCss field description. */
function SlotSelectorButton({ slot }: { slot: string }) {
  const [isCopied, setIsCopied] = useState(false)
  const selector = `[data-slot="${slot}"]`

  return (
    <button
      type="button"
      title={`Copy ${selector} to clipboard`}
      onClick={() => {
        navigator.clipboard.writeText(selector)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 1500)
      }}
      style={{
        fontFamily: "monospace",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: "inherit",
        textDecoration: "underline",
      }}
    >
      {isCopied ? "Copied!" : selector}
    </button>
  )
}

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "showSmoke",
      title: "Show Smoke Background",
      description: "Display the smoke effect behind the logo.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "background",
      title: "Background Image",
      description: "The large background image displayed on the Hero banner.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: "Top most title displayed on the banner.",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "subheading",
      title: "Sub Heading",
      type: "string",
    }),
    defineField({
      name: "content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: BLOCK_STYLES,
        }),
      ],
    }),
    defineField({
      name: "customCss",
      title: "Custom CSS applied to the Hero Banner (Advanced).",
      description: (
        <>
          Vanilla CSS. Click a selector to copy it, then scope your rules
          under it to target specific elements of the Hero:
          <ul
            style={{
              margin: "0.5em 0 0",
              paddingLeft: "1.25em",
              listStyleType: "disc",
            }}
          >
            {HERO_DATA_SLOTS.map(({ slot, description }) => (
              <li key={slot}>
                <SlotSelectorButton slot={slot} />
                {description && ` — ${description}`}
              </li>
            ))}
          </ul>
        </>
      ),
      type: "code",
      options: {
        language: "css",
        languageAlternatives: [{ title: "CSS", value: "css" }],
      },
      initialValue: {
        language: "css",
      },
    }),
  ],
})
