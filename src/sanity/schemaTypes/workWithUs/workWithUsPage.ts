import { defineField, defineType, defineArrayMember } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"
import { headingFields } from "../helpers/heading"

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
    { name: "vacancyList", title: "Vacancies" },
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
      name: "vacancies",
      title: "Vacancies",
      type: "array",
      group: "vacancyList",
      of: [
        defineArrayMember({
          name: "vacancy",
          title: "Vacancy",
          description: "Add your vacancy details.",
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Vacancy Title",
              type: "string",
            }),
            defineField({
              name: "date",
              title: "Date",
              description: "When you need the vacancy filled by.",
              type: "date",
            }),
            portableTextSchema({
              name: "description",
              title: "Vacancy description",
            }),
            buttonsSchema({ name: "applyButton", title: "Apply Now" }),
          ],
        }),
      ],
    }),

    portableTextSchema({ name: "content", title: "Content", group: "content" }),
    defineField({
      name: "vacanciesHeading",
      title: "Vacancies Heading",
      type: "string",
      group: "content",
    }),
    portableTextSchema({
      name: "noVacanciesMessage",
      title: "No Vacancies Message",
      description: "Message to display when there are no vacancies.",
      group: "content",
    }),

    buttonsSchema({
      name: "buttons",
      title: "Buttons",
      group: "content",
      description: "Buttons shown at the bottom of the page.",
    }),
  ],
})
