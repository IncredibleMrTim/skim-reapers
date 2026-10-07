import { defineField } from "sanity"
import { imagesSchema } from "./imagesSchema"
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
            name: "gallery",
            type: "object",
            fields: [imagesSchema()],
          }),
        ],
      }),
    ],
  })
