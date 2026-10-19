import { defineField, defineArrayMember } from "sanity"
import { LucideIconPopoverInput } from "./LucideIconInput"

/**
 * Pick a Lucide icon from the searchable list. Stores the icon's name and
 * drawing data (set together by the picker, never typed), so the site draws it
 * without bundling the icon library. Shared by every button list, including
 * the hero's. If another icon is also set, this one wins on the site (see
 * `CtaButtons`), so there's no validation against setting both.
 */
export const buttonLucideIconField = defineField({
  name: "lucideIcon",
  title: "Icon Library",
  description:
    "Browse the built-in icon library and pick an icon to show on the button in place of the default -> icon. If an image or React icon is also set, this one is shown instead.",
  type: "object",
  components: { input: LucideIconPopoverInput },
  fields: [
    // Visible but read-only on purpose: Sanity hides an object whose fields
    // are all hidden, which would remove the picker. The popover input does
    // not render these fields itself; it just sets them.
    defineField({
      name: "name",
      title: "Selected Icon",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "iconNode", type: "string", hidden: true }),
  ],
})

/**
 * Which side of the label the icon sits on. Shared by every button list
 * (including the hero's) so the option looks and behaves the same everywhere.
 * An unset value is treated as "right", the original position, so buttons
 * saved before this field existed don't move.
 */
export const buttonIconPositionField = defineField({
  name: "iconPosition",
  title: "Icon Position",
  description: "Show the icon before (left) or after (right) the label.",
  type: "string",
  options: {
    list: [
      { title: "Left", value: "left" },
      { title: "Right", value: "right" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
  initialValue: "right",
})

export const buttonsSchema = ({
  name,
  title,
  description,
  group,
  fieldset,
}: {
  name?: string
  title?: string
  description?: string
  group?: string
  fieldset?: string
}) =>
  defineField({
    name: name ?? "buttons",
    title: title ?? "Buttons",
    type: "array",
    group,
    fieldset,
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
            name: "variant",
            title: "Variant",
            type: "string",
            options: {
              list: [
                { title: "Default", value: "default" },
                { title: "Outline", value: "outline" },
                { title: "Secondary", value: "secondary" },
                { title: "Ghost", value: "ghost" },
                { title: "Destructive", value: "destructive" },
                { title: "Link", value: "link" },
              ],
              layout: "dropdown",
            },
            initialValue: "default",
          }),
          defineField({
            name: "size",
            title: "Size",
            type: "string",
            options: {
              list: [
                { title: "Default", value: "default" },
                { title: "Extra Small", value: "xs" },
                { title: "Small", value: "sm" },
                { title: "Large", value: "lg" },
                { title: "Extra Large", value: "2xl" },
                { title: "Icon", value: "icon" },
                { title: "Icon Extra Small", value: "icon-xs" },
                { title: "Icon Small", value: "icon-sm" },
                { title: "Icon Large", value: "icon-lg" },
              ],
              layout: "dropdown",
            },
            initialValue: "default",
          }),
          defineField({
            name: "icon",
            title: "Custom Icon",
            description:
              "The icon will be displayed on the button in place of the default -> icon.",
            type: "image",
          }),
          buttonLucideIconField,
          buttonIconPositionField,
        ],
      }),
    ],
  })
