import { defineField, defineType } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"

export const qaPage = defineType({
  name: "qaPage",
  title: "Q&A Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Q&A Page" }
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
      title: "Q&A Page Buttons",
      group: "content",
      description: "Buttons for the main Q&A page.",
    }),
  ],
})
