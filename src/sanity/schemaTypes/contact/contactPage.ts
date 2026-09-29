import { defineField, defineType } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Contact Page" }
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
      title: "Contact Page Buttons",
      group: "content",
      description: "Buttons for the main Contact page.",
    }),
  ],
})
