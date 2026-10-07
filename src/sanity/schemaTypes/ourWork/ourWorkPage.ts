import { defineField, defineType } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"
import { gallerySchema } from "../gallerySchema"

export const ourWorkPage = defineType({
  name: "ourWorkPage",
  title: "Our Work Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Our Work Page" }
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
    gallerySchema({ group: "content" }),
    buttonsSchema({
      name: "buttons",
      title: "Our Work Page Buttons",
      group: "content",
      description: "Buttons for the main Our Work page.",
    }),
  ],
})
