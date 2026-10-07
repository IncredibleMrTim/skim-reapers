import { defineField } from "sanity"
import { imagesSchema } from "./imagesSchema"
import { portableTextSchema } from "./helpers/portableText"
import { videoGalleryMember } from "./videoGallerySchema"
import { TSanitySchema } from "./types"

export const gallerySchema = ({
  name,
  title,
  description,
  group,
}: TSanitySchema = {}) =>
  defineField({
    name: name ?? "galleries",
    title,
    description,
    group,
    type: "array",
    of: [
      defineField({
        name: "gallery",
        type: "object",
        fields: [
          defineField({
            name: "title",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            type: "boolean",
            name: "showTitle",
            title: "Show Title",
            description: "Show or hide the title for this Gallery.",
            initialValue: true,
          }),
          portableTextSchema({
            name: "description",
            title: "Gallery Description",
          }),
          defineField({
            name: "gallery",
            type: "object",
            fields: [
              imagesSchema({
                description: "The images to display in this gallery.",
              }),
            ],
          }),
        ],
      }),
      videoGalleryMember,
    ],
  })
