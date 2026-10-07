import { defineField, defineType } from "sanity"
import { imagesSchema } from "../imagesSchema"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"

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
    imagesSchema({
      name: "images",
      title: "About page images",
      group: "content",
    }),
    portableTextSchema({ name: "about", title: "About", group: "content" }),
    buttonsSchema({
      name: "buttons",
      title: "Commercial Page Buttons",
      group: "content",
      description: "Buttons for the main Commercial page.",
    }),
  ],
})
