import {
  defineArrayMember,
  defineField,
  type BlockAnnotationProps,
  type BlockDecoratorProps,
  type BlockProps,
} from "sanity"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  Link as LinkIcon,
  Palette,
  Strikethrough,
  Underline,
} from "lucide-react"
import {
  renderAnnotationMark,
  renderDecoratorMark,
} from "@/components/portableText/marks"
import { BLOCK_STYLES } from "@/sanity/schemaTypes/blockStyles"

function decoratorComponent(props: BlockDecoratorProps) {
  return <>{renderDecoratorMark(props.value, props.children)}</>
}

/**
 * Sanity renders its own floating editor (`PopoverEditDialog`) for any
 * annotation object automatically — confirmed live: it appears both on
 * fresh insertion and on reopening an existing annotation, with zero
 * involvement from this component. An earlier version of this component
 * also rendered `props.children` (the edit form) in a custom `Dialog`,
 * which just duplicated Sanity's own popover — two floating editors open
 * at once. So this only renders the always-visible styled text
 * (`textElement`); editing is left entirely to Sanity's built-in popover.
 */
function annotationComponent(props: BlockAnnotationProps) {
  return (
    <>{renderAnnotationMark(props.schemaType.name, props.value, props.textElement)}</>
  )
}

/** Matches `IMAGE_SIZE_CLASSES` in `components/portableText/marks.tsx` so the
 * Studio canvas previews an image block at roughly the width it renders on
 * the live site. */
const IMAGE_EDITOR_WIDTH: Record<string, string> = {
  small: "33%",
  medium: "66%",
  large: "100%",
}

/** Matches `IMAGE_ALIGNMENT_CLASSES` in `components/portableText/marks.tsx`. */
const IMAGE_EDITOR_MARGIN: Record<string, string> = {
  left: "0 auto 0 0",
  center: "0 auto",
  right: "0 0 0 auto",
}

function imageBlockPreviewComponent(props: BlockProps) {
  const value = props.value as
    | { size?: string; alignment?: string }
    | undefined
  const width = IMAGE_EDITOR_WIDTH[value?.size ?? "large"]
  const margin = IMAGE_EDITOR_MARGIN[value?.alignment ?? "center"]
  return <div style={{ width, margin }}>{props.renderDefault(props)}</div>
}

type TPortableTextSchema = {
  name?: string
  title?: string
  group?: string
}

export const portableTextSchema = ({
  name,
  title,
  group,
}: TPortableTextSchema = {}) =>
  defineField({
    name: name ?? "portableText",
    title: title ?? "Portable Text Editor",
    group,
    type: "array",
    of: [
      defineArrayMember({
        name: "block",
        type: "block",
        styles: BLOCK_STYLES,
        marks: {
          decorators: [
            {
              title: "Strong",
              value: "strong",
              icon: Bold,
              component: decoratorComponent,
            },
            {
              title: "Italic",
              value: "em",
              icon: Italic,
              component: decoratorComponent,
            },
            {
              title: "Code",
              value: "code",
              icon: Code,
              component: decoratorComponent,
            },
            {
              title: "Underline",
              value: "underline",
              icon: Underline,
              component: decoratorComponent,
            },
            {
              title: "Strike",
              value: "strike-through",
              icon: Strikethrough,
              component: decoratorComponent,
            },
            {
              title: "Small",
              value: "small",
              icon: () => "S",
              component: decoratorComponent,
            },
            {
              title: "Medium",
              value: "medium",
              icon: () => "M",
              component: decoratorComponent,
            },
            {
              title: "Large",
              value: "large",
              icon: () => "L",
              component: decoratorComponent,
            },
            {
              title: "Accent",
              value: "accent",
              icon: () => "A",
              component: decoratorComponent,
            },
            {
              title: "Heading 1",
              value: "heading1",
              icon: Heading1,
              component: decoratorComponent,
            },
            {
              title: "Heading 2",
              value: "heading2",
              icon: Heading2,
              component: decoratorComponent,
            },
            {
              title: "Heading 3",
              value: "heading3",
              icon: Heading3,
              component: decoratorComponent,
            },
            {
              title: "Heading 4",
              value: "heading4",
              icon: Heading4,
              component: decoratorComponent,
            },
            {
              title: "Align Left",
              value: "align-left",
              icon: AlignLeft,
              component: decoratorComponent,
            },
            {
              title: "Align Center",
              value: "align-center",
              icon: AlignCenter,
              component: decoratorComponent,
            },
            {
              title: "Align Right",
              value: "align-right",
              icon: AlignRight,
              component: decoratorComponent,
            },
          ],
          annotations: [
            defineArrayMember({
              name: "link",
              type: "object",
              title: "Link",
              icon: LinkIcon,
              components: { annotation: annotationComponent },
              fields: [
                defineField({
                  name: "href",
                  type: "url",
                  title: "Link",
                  description: "A valid web, email, phone, or relative link.",
                  validation: (Rule) =>
                    Rule.uri({
                      scheme: ["http", "https", "tel", "mailto"],
                      allowRelative: true,
                    }),
                }),
              ],
            }),
            defineArrayMember({
              name: "color",
              type: "object",
              title: "Text Color",
              icon: Palette,
              components: { annotation: annotationComponent },
              fields: [
                defineField({
                  name: "swatch",
                  type: "color",
                  title: "Color",
                  // Brand tokens from `src/app/globals.css`'s `:root`, so
                  // editors pick from the same palette the rest of the site
                  // uses instead of an arbitrary freehand color.
                  options: {
                    colorList: [
                      "#af7c3c", // --accent
                      "#ece9e4", // --foreground
                      "#6b6460", // --muted-foreground
                      "#e5484d", // --destructive
                    ],
                  },
                }),
              ],
            }),
          ],
        },
      }),
      defineArrayMember({
        name: "image",
        type: "image",
        options: { hotspot: true },
        components: { block: imageBlockPreviewComponent },
        fields: [
          defineField({
            name: "alt",
            title: "Alt Text",
            description: "Describes the image for screen readers and SEO.",
            type: "string",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "size",
            title: "Size",
            description: "How wide the image displays on the page.",
            type: "string",
            options: {
              list: [
                { title: "Small", value: "small" },
                { title: "Medium", value: "medium" },
                { title: "Large (full width)", value: "large" },
              ],
              layout: "radio",
            },
            initialValue: "large",
          }),
          defineField({
            name: "alignment",
            title: "Alignment",
            description:
              "Where the image sits horizontally when it's narrower than full width.",
            type: "string",
            options: {
              list: [
                { title: "Left", value: "left" },
                { title: "Center", value: "center" },
                { title: "Right", value: "right" },
              ],
              layout: "radio",
            },
            initialValue: "center",
          }),
        ],
      }),
    ],
  })
