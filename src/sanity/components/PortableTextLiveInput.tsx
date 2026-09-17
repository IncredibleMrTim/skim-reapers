import { useMemo, useState, type ComponentType, type ElementType } from "react"
import {
  EditorProvider,
  PortableTextEditable,
  defineAnnotation,
  defineDecorator,
  defineSchema,
  defineTextBlock,
  useEditor,
  type EditorEmittedEvent,
} from "@portabletext/editor"
import { EventListenerPlugin, NodePlugin } from "@portabletext/editor/plugins"
import {
  isBlockChildrenObjectField,
  isBlockSchemaType,
  isBlockStyleObjectField,
  isSpanSchemaType,
  type ArraySchemaType,
  type BlockDecoratorDefinition,
  type ObjectSchemaType,
} from "@sanity/types"
import {
  set,
  unset,
  type ArrayOfObjectsInputProps,
  type ArrayOfPrimitivesInputProps,
} from "sanity"
import type { PortableTextBlock } from "@portabletext/editor"
import { renderAnnotationMark, renderDecoratorMark } from "@/components/portableText/marks"

type StyleOption = { title: string; value: string }

/**
 * Reads decorators/annotations/styles straight off the array field's compiled
 * schema type, so this input works on any `type: "block"` array field without
 * hardcoding a mark list — it stays in sync automatically as the schema changes.
 */
function useBlockMarksSchema(schemaType: ArraySchemaType) {
  return useMemo(() => {
    const blockMember = schemaType.of.find(isBlockSchemaType)
    const childrenField = blockMember?.fields.find(isBlockChildrenObjectField)
    const styleField = blockMember?.fields.find(isBlockStyleObjectField)
    const spanType = (childrenField?.type as ArraySchemaType | undefined)?.of.find(
      isSpanSchemaType,
    )
    const styleOptions =
      (styleField?.type.options as { list?: StyleOption[] } | undefined)
        ?.list ?? []

    return {
      decorators: spanType?.decorators ?? [],
      annotations: (spanType?.annotations ?? []) as ObjectSchemaType[],
      styles: styleOptions.length > 0 ? styleOptions : [{ title: "Normal", value: "normal" }],
    }
  }, [schemaType])
}

/**
 * `@portabletext/schema`'s FieldDefinition only supports a small, fixed set
 * of field types — narrower than Sanity's full type system (no "url",
 * "color", etc.). Declaring annotation fields with an unsupported type
 * causes the editor's strict parser to silently drop the property, which is
 * why `href`/`hex` were never actually reaching the stored markDef.
 */
function mapToSchemaFieldType(
  jsonType: string,
): "array" | "string" | "number" | "boolean" | "object" {
  switch (jsonType) {
    case "array":
    case "number":
    case "boolean":
    case "object":
      return jsonType
    default:
      return "string"
  }
}

/**
 * Studio's own CSS reset strips the browser's default heading styles, so
 * bare `<h1>`/`<h2>` tags render as plain text with no visual feedback —
 * these classNames give editors the same live-preview signal decorators get.
 */
const STYLE_TAGS: Record<string, { tag: string; className: string }> = {
  h1: { tag: "h1", className: "text-4xl font-bold" },
  h2: { tag: "h2", className: "text-3xl font-bold" },
  h3: { tag: "h3", className: "text-2xl font-bold" },
  h4: { tag: "h4", className: "text-xl font-bold" },
  h5: { tag: "h5", className: "text-lg font-bold" },
  h6: { tag: "h6", className: "text-base font-bold" },
  blockquote: {
    tag: "blockquote",
    className: "border-l-2 pl-4 italic opacity-80",
  },
}

function renderIcon(icon: BlockDecoratorDefinition["icon"]) {
  if (!icon) return null
  if (typeof icon === "function") {
    const Icon = icon
    return <Icon />
  }
  return icon
}

function Toolbar({
  decorators,
  annotations,
  styles,
}: {
  decorators: BlockDecoratorDefinition[]
  annotations: ObjectSchemaType[]
  styles: StyleOption[]
}) {
  const editor = useEditor()
  const [openAnnotation, setOpenAnnotation] = useState<string | null>(null)
  const [annotationInput, setAnnotationInput] = useState("")

  const applyAnnotation = (name: string) => {
    if (name === "link") {
      editor.send({
        type: "annotation.toggle",
        annotation: { name: "link", value: { href: annotationInput } },
      })
    }
    if (name === "color") {
      editor.send({
        type: "annotation.toggle",
        annotation: { name: "color", value: { hex: annotationInput } },
      })
    }
    setOpenAnnotation(null)
    setAnnotationInput("")
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        alignItems: "center",
        marginBottom: "0.5rem",
      }}
    >
      {styles.length > 1 && (
        <select
          onChange={(event) => {
            editor.send({ type: "style.toggle", style: event.target.value })
            event.target.value = ""
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Style
          </option>
          {styles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.title}
            </option>
          ))}
        </select>
      )}
      {decorators.map((decorator) => (
        <button
          key={decorator.value}
          type="button"
          title={decorator.title}
          onClick={() =>
            editor.send({ type: "decorator.toggle", decorator: decorator.value })
          }
          style={{
            border: "1px solid currentColor",
            borderRadius: 4,
            padding: "0.15rem 0.5rem",
            cursor: "pointer",
            background: "none",
            color: "inherit",
          }}
        >
          {renderIcon(decorator.icon) ?? decorator.title}
        </button>
      ))}
      {annotations.map((annotation) => (
        <span key={annotation.name} style={{ position: "relative" }}>
          <button
            type="button"
            title={annotation.title}
            onClick={() => {
              const opening = openAnnotation !== annotation.name
              setOpenAnnotation(opening ? annotation.name : null)
              if (opening) {
                setAnnotationInput(annotation.name === "color" ? "#000000" : "")
              }
            }}
            style={{
              border: "1px solid currentColor",
              borderRadius: 4,
              padding: "0.15rem 0.5rem",
              cursor: "pointer",
              background: "none",
              color: "inherit",
            }}
          >
            {annotation.title ?? annotation.name}
          </button>
          {openAnnotation === annotation.name && (
            <span
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 10,
                display: "flex",
                gap: "0.25rem",
                marginTop: "0.25rem",
                background: "Canvas",
                border: "1px solid currentColor",
                borderRadius: 4,
                padding: "0.25rem",
              }}
            >
              <input
                type={annotation.name === "color" ? "color" : "url"}
                value={annotationInput}
                onChange={(event) => setAnnotationInput(event.target.value)}
                style={{ color: "inherit" }}
              />
              <button type="button" onClick={() => applyAnnotation(annotation.name)}>
                Apply
              </button>
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

/**
 * Reusable custom Studio input for `type: "block"` array fields. Renders
 * decorators/annotations/styles with live formatting in the editing canvas
 * via `@portabletext/editor`, using the exact same mark components the real
 * frontend renders with (see `src/components/portableText/marks.tsx`) — the
 * "sanitized preview" problem this replaces (decorators showing no visual
 * feedback in the bundled editor) can't drift from the published result,
 * since both read from one shared source.
 *
 * Plug in on any block array field: `components: { input: PortableTextLiveInput }`.
 */
function PortableTextLiveInputComponent(
  props: ArrayOfObjectsInputProps<PortableTextBlock>,
) {
  const { decorators, annotations, styles } = useBlockMarksSchema(
    props.schemaType,
  )

  const schemaDefinition = useMemo(
    () =>
      defineSchema({
        decorators: decorators.map((d) => ({ name: d.value, title: d.title })),
        annotations: annotations.map((a) => ({
          name: a.name,
          title: a.title,
          fields: a.fields.map((field) => ({
            name: field.name,
            type: mapToSchemaFieldType(field.type.jsonType),
          })),
        })),
        styles: styles.map((s) => ({ name: s.value, title: s.title })),
        lists: [],
        inlineObjects: [],
        blockObjects: [],
      }),
    [decorators, annotations, styles],
  )

  const nodes = useMemo(
    () => [
      defineTextBlock({
        type: "block",
        render: ({ attributes, children, node }) => {
          const style = (node as { style?: string }).style
          const resolved = style ? STYLE_TAGS[style] : undefined
          const Tag = (resolved?.tag ?? "p") as ElementType
          return (
            <Tag
              {...attributes}
              className={resolved?.className}
              style={{ marginBlockEnd: "0.5em" }}
            >
              {children}
            </Tag>
          )
        },
      }),
      defineDecorator({
        type: "*",
        render: ({ children, decorator }) => (
          <>{renderDecoratorMark(decorator, children)}</>
        ),
      }),
      defineAnnotation({
        type: "*",
        render: ({ children, annotation }) => (
          <>{renderAnnotationMark(annotation._type, annotation, children)}</>
        ),
      }),
    ],
    [],
  )

  return (
    <EditorProvider
      initialConfig={{ schemaDefinition, initialValue: props.value }}
    >
      <EventListenerPlugin
        on={(event: EditorEmittedEvent) => {
          if (event.type !== "mutation") return
          props.onChange(event.value ? set(event.value) : unset())
        }}
      />
      <NodePlugin nodes={nodes} />
      <Toolbar decorators={decorators} annotations={annotations} styles={styles} />
      <PortableTextEditable
        style={{
          minHeight: "8rem",
          border: "1px solid rgba(128, 128, 128, 0.4)",
          borderRadius: 4,
          padding: "0.75rem",
          outline: "none",
        }}
      />
    </EditorProvider>
  )
}

/**
 * `defineField`'s overload resolution for `type: "array"` doesn't reliably
 * infer the "array of objects" shape for a `block` member, so it types
 * `components.input` against the primitives-array input props instead. At
 * runtime Sanity always passes `ArrayOfObjectsInputProps` for an object/block
 * array field regardless — this cast bridges that compile-time-only gap once,
 * here, so every schema that plugs this in doesn't need to repeat it.
 */
export const PortableTextLiveInput =
  PortableTextLiveInputComponent as unknown as ComponentType<
    ArrayOfPrimitivesInputProps<string | number | boolean, ArraySchemaType>
  >

