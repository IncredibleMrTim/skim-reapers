import { defineArrayMember, defineField, defineType } from "sanity"
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  Link as LinkIcon,
  Palette,
  Strikethrough,
  Underline,
} from "lucide-react"
import { PortableTextLiveInput } from "@/sanity/components/PortableTextLiveInput"
import { BLOCK_STYLES } from "@/sanity/schemaTypes/blockStyles"

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "About Page" }
    },
  },
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "hero", title: "Hero" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "hero",
      group: "hero",
    }),
    defineField({
      name: "images",
      title: "About page images",
      group: "content",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({
      name: "about",
      title: "About",
      group: "content",
      type: "array",
      components: { input: PortableTextLiveInput },
      of: [
        defineArrayMember({
          name: "content",
          type: "block",
          styles: BLOCK_STYLES,
          marks: {
            decorators: [
              { title: "Strong", value: "strong", icon: Bold },
              { title: "Italic", value: "em", icon: Italic },
              { title: "Code", value: "code", icon: Code },
              { title: "Underline", value: "underline", icon: Underline },
              {
                title: "Strike",
                value: "strike-through",
                icon: Strikethrough,
              },
              { title: "Small", value: "small", icon: () => "S" },
              { title: "Medium", value: "medium", icon: () => "M" },
              { title: "Large", value: "large", icon: () => "L" },
              { title: "Accent", value: "accent", icon: () => "A" },
              { title: "Heading 1", value: "heading1", icon: Heading1 },
              { title: "Heading 2", value: "heading2", icon: Heading2 },
              { title: "Heading 3", value: "heading3", icon: Heading3 },
              { title: "Heading 4", value: "heading4", icon: Heading4 },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                icon: LinkIcon,
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "Link",
                    description: "A valid web, email, phone, or relative link.",
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "tel", "mailto"],
                        allowRelative: true,
                      }),
                  }),
                ],
              }),
              defineArrayMember({
                name: "color",
                type: "object",
                title: "Color",
                icon: Palette,
                fields: [
                  // Flat string, not a nested `type: "color"` object — the
                  // annotation.toggle event only merges flat/primitive
                  // fields correctly; nested object fields get silently
                  // dropped (verified against @portabletext/editor 8.1.5).
                  defineField({
                    name: "hex",
                    type: "string",
                    title: "Color (hex)",
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
  ],
})
