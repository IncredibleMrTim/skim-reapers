import { defineArrayMember, defineField, defineType } from "sanity"

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
      of: [
        defineArrayMember({
          type: "block",
        }),
      ],
    }),
  ],
})
