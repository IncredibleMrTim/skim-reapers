import { defineField, defineType } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"

export const domesticPage = defineType({
  name: "domesticPage",
  title: "Domestic Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Domestic Page" }
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
    portableTextSchema({ name: "content", title: "Content", group: "content" }),
    buttonsSchema({
      name: "buttons",
      title: "Domestic Page Buttons",
      group: "content",
      description: "Buttons for the main Domestic page.",
    }),
  ],
})
