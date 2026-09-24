import { defineType, defineField } from "sanity"
import { buttonsSchema } from "../helpers/buttons"
import { portableTextSchema } from "../helpers/portableText"

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Services Page" }
    },
  },
  groups: [
    {
      name: "hero",
      title: "Hero",
    },
    {
      name: "content",
      title: "Content",
      default: true,
    },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "hero",
      group: "hero",
    }),
    portableTextSchema({ name: "content", title: "Content", group: "content" }),

    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "content",
      of: [
        defineField({
          name: "service",
          title: "Service",
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [{ type: "block" }],
            }),
            buttonsSchema({
              name: "serviceButton",
              title: "Service Buttons",
              description: "Buttons for this specific service.",
            }),
          ],
        }),
      ],
    }),
    buttonsSchema({
      name: "servicePageButtons",
      title: "Service Page Buttons",
      group: "content",
      description: "Buttons for the main Services page.",
    }),
  ],
})
