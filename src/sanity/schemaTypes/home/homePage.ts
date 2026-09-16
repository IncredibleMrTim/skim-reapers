import { defineField, defineType } from "sanity"

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "hero", title: "Hero" },
    { name: "belief", title: "Belief Banner" },
    { name: "whatWeDo", title: "What We Do" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "hero",
      group: "hero",
    }),
    defineField({
      name: "belief",
      type: "belief",
      group: "belief",
    }),
    defineField({
      name: "whatWeDo",
      type: "whatWeDo",
      group: "whatWeDo",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      group: "content",
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/*" },
      group: "content",
    }),
  ],
})
