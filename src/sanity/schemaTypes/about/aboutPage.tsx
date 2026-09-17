import { defineArrayMember, defineField, defineType } from "sanity"
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
              { title: "Strong", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
              { title: "Small", value: "small", icon: () => "S" },
              { title: "Medium", value: "medium", icon: () => "M" },
              { title: "Large", value: "large", icon: () => "L" },
              { title: "Accent", value: "accent", icon: () => "A" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "Link",
                    description:
                      "A valid web, email, phone, or relative link.",
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
