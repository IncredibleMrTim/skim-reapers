import { defineField, defineType } from "sanity"
import { portableTextSchema } from "../helpers/portableText"
import { buttonsSchema } from "../helpers/buttons"
import { headingFields } from "../helpers/heading"

export const applicationPage = defineType({
  name: "applicationPage",
  title: "Application Page",
  type: "document",
  preview: {
    prepare() {
      return { title: "Application Page" }
    },
  },
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "hero", title: "Hero" },
  ],
  fieldsets: [
    {
      name: "success",
      title: "Success Message",
      description:
        "Shown in place of the form once an application has been sent.",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    ...headingFields({ group: "content" }),
    defineField({
      name: "hero",
      type: "hero",
      group: "hero",
    }),
    defineField({
      name: "photosHeading",
      title: "Photos Heading",
      description: 'Heading above the photo upload, e.g. "Show us your work".',
      type: "string",
      group: "content",
    }),
    portableTextSchema({
      name: "photosDescription",
      title: "Photos Description",
      description: "Text under the photos heading.",
      group: "content",
    }),
    defineField({
      name: "whatHappensNextHeading",
      title: "What Happens Next Heading",
      type: "string",
      group: "content",
    }),
    portableTextSchema({
      name: "whatHappensNext",
      title: "What Happens Next",
      description: "Panel shown beside the submit button.",
      group: "content",
    }),
    portableTextSchema({
      name: "successMessage",
      title: "Success Message",
      description: "Shown after an application has been sent.",
      group: "content",
      fieldset: "success",
    }),
    buttonsSchema({
      name: "successButtons",
      title: "Success Buttons",
      description:
        "Buttons shown under the success message, e.g. a Back to roles button linking to /workWithUs.",
      group: "content",
      fieldset: "success",
    }),
    buttonsSchema({
      name: "buttons",
      title: "Buttons",
      group: "content",
      description: "Buttons shown at the bottom of the page.",
    }),
  ],
})
