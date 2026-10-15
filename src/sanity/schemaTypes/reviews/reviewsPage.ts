import { defineField, defineType, defineArrayMember } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"
import { headingFields } from "../helpers/heading"
import { ReviewPreview } from "./ReviewPreview"

export const reviewsPage = defineType({
  name: "reviewsPage",
  title: "Reviews Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Reviews Page" }
    },
  },
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "reviewsList", title: "Reviews" },
    { name: "hero", title: "Hero" },
  ],
  fields: [
    ...headingFields({ group: "content" }),
    defineField({
      name: "hero",
      type: "hero",
      group: "hero",
    }),
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      group: "reviewsList",

      of: [
        defineArrayMember({
          name: "review",
          title: "review",
          description: "Add your review details.",
          type: "object",
          components: { preview: ReviewPreview },
          preview: {
            select: {
              heading: "heading",
              date: "date",
              source: "source",
            },
            prepare({ heading, date, source }) {
              return { title: heading, subtitle: source, date }
            },
          },
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
            }),
            defineField({
              name: "reviewer",
              title: "Reviewer Name",
              type: "string",
            }),
            defineField({
              name: "source",
              title: "Review Source",
              type: "string",
            }),
            defineField({
              name: "date",
              title: "Review Date",
              type: "date",
            }),
            defineField({
              name: "rating",
              title: "Rating",
              description: "This will appear as stars on the review.",
              type: "string",
              options: {
                list: [
                  { title: "1 Star", value: "1" },
                  { title: "2 Star", value: "2" },
                  { title: "3 Star", value: "3" },
                  { title: "4 Star", value: "4" },
                  { title: "5 Star", value: "5" },
                ],
              },
            }),
            portableTextSchema({
              name: "description",
              title: "Review Content",
            }),
          ],
        }),
      ],
    }),
    portableTextSchema({ name: "content", title: "Content", group: "content" }),

    buttonsSchema({
      name: "buttons",
      title: "Buttons",
      group: "content",
      description: "Buttons shown at the bottom of the page.",
    }),
  ],
})
