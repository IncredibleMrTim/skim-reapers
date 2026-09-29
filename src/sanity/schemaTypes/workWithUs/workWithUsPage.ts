import { defineField, defineType } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"

export const workWithUsPage = defineType({
  name: "workWithUsPage",
  title: "Work With Us Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Work With Us Page" }
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
      title: "Work With Us Page Buttons",
      group: "content",
      description: "Buttons for the main Work With Us page.",
    }),
  ],
})
