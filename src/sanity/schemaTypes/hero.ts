import { defineType, defineField } from "sanity"

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "string" }),
    defineField({ name: "text", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
})
