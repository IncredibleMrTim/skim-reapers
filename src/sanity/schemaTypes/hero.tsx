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
      name: "buttons",
      type: "array",
      description:
        "Action buttons for the Hero Banner.  These can link off to other pages.",
      of: [
        defineArrayMember({
          name: "buttons",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "path",
              type: "string",
              description: "Where to navigate when this button is clicked.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "variant",
              title: "Variant",
              description: "The button style to use.",
              type: "string",
              options: {
                list: [
                  { title: "Default", value: "default" },
                  { title: "Outline", value: "outline" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Ghost", value: "ghost" },
                  { title: "Destructive", value: "destructive" },
                  { title: "Link", value: "link" },
                ],
                layout: "dropdown",
              },
              initialValue: "default",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "imageIcon",
              title: "Image Icon",
              description:
                "A custom image icon will be displayed on the button in place of the default -> icon.",
              type: "image",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as
                    | { reactIcon?: { name?: string } }
                    | undefined
                  if (value && parent?.reactIcon?.name) {
                    return "Only one of Image Icon or React Icon can be set."
                  }
                  return true
                }),
            }),
            defineField({
              name: "reactIcon",
              title: "React Icon",
              description:
                "A custom React-Icon will be displayed on the button in place of the default -> icon.",
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  type: "string",
                  description: "The icon component name from React Icons.",
                }),
                defineField({
                  name: "package",
                  type: "string",
                  description: "The react-icons package (e.g. react-icons/fa).",
                }),
              ],
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as
                    | { imageIcon?: { asset?: unknown } }
                    | undefined
                  if (value?.name && parent?.imageIcon?.asset) {
                    return "Only one of Image Icon or React Icon can be set."
                  }
                  return true
                }),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "customCss",
      title: "Custom CSS applied to the Hero Banner (Advanced).",
      description: (
        <>
          Vanilla CSS. Click a selector to copy it, then scope your rules under
          it to target specific elements of the Hero:
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
