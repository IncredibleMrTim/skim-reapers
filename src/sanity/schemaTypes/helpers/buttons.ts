import { defineField, defineArrayMember } from "sanity"

export const buttonsSchema = ({
  name,
  title,
  description,
  group,
}: {
  name?: string
  title?: string
  description?: string
  group?: string
}) =>
  defineField({
    name: name ?? "buttons",
    title: title ?? "Buttons",
    type: "array",
    group,
    description:
      description ?? "Action buttons.  These can link off to other pages.",
    of: [
      defineArrayMember({
        name: "buttons",
        type: "object",
        fields: [
          defineField({
            name: "label",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "path",
            type: "string",
            description: "Where to navigate when this button is clicked.",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "icon",
            description:
              "The icon will be displayed on the button in place of the default -> icon.",
            type: "image",
          }),
        ],
      }),
    ],
  })
