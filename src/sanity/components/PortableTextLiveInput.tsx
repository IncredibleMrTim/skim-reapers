import {
  Fragment,
  isValidElement,
  useMemo,
  useState,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react"
import {
  EditorProvider,
  PortableTextEditable,
  defineAnnotation,
  defineDecorator,
  defineSchema,
  defineTextBlock,
  useEditor,
  useEditorSelector,
  type Editor,
  type EditorEmittedEvent,
} from "@portabletext/editor"
import {
  BehaviorPlugin,
  EventListenerPlugin,
  NodePlugin,
} from "@portabletext/editor/plugins"
import { defineBehavior, raise } from "@portabletext/editor/behaviors"
import {
  getActiveAnnotations,
  isActiveAnnotation,
  isActiveDecorator,
} from "@portabletext/editor/selectors"
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
import {
  renderAnnotationMark,
  renderDecoratorMark,
  STYLE_TAGS,
} from "@/components/portableText/marks"
import { Button } from "@/components/ui/button"

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
    const spanType = (
      childrenField?.type as ArraySchemaType | undefined
    )?.of.find(isSpanSchemaType)
    const styleOptions =
      (styleField?.type.options as { list?: StyleOption[] } | undefined)
        ?.list ?? []

    return {
      decorators: spanType?.decorators ?? [],
      annotations: (spanType?.annotations ?? []) as ObjectSchemaType[],
      styles:
        styleOptions.length > 0
          ? styleOptions
          : [{ title: "Normal", value: "normal" }],
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
 * Pressing Enter already splits into a new block (that's the default
 * editor behavior). Pasting multi-paragraph plain text doesn't get the
 * same treatment — the built-in deserializer keeps it as one block with
 * the blank lines embedded as literal "\n\n" in a single span, which is
 * why pasted and typed content end up structured differently even though
 * both render the same way (see `whitespace-pre-line` on `renderBlock` in
 * marks.tsx). This splits pasted text on blank lines into real blocks,
 * matching what pressing Enter between each paragraph would have produced.
 */
const deserializePlainTextParagraphs = defineBehavior({
  on: "deserialize.data",
  guard: ({ snapshot, event }) => {
    if (event.mimeType !== "text/plain") return false
    const paragraphs = event.data
      .split(/\n[ \t]*\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
    if (paragraphs.length < 2) return false
    const blocks: PortableTextBlock[] = paragraphs.map((text) => ({
      _key: snapshot.context.keyGenerator(),
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: snapshot.context.keyGenerator(),
          _type: "span",
          text,
          marks: [],
        },
      ],
    }))
    return { blocks }
  },
  actions: [
    ({ event }, { blocks }) => [
      raise({ ...event, type: "deserialization.success", data: blocks }),
    ],
  ],
})

const CUSTOM_BEHAVIORS = [deserializePlainTextParagraphs]

function renderIcon(
  icon: BlockDecoratorDefinition["icon"] | ObjectSchemaType["icon"],
) {
  if (!icon) return null
  // Already-built elements (e.g. `icon: <Bold />`) render as-is; everything
  // else — plain function components and `forwardRef`/`memo` components like
  // lucide-react's icons, which are objects rather than functions — is a
  // component reference that still needs to be invoked via JSX.
  if (isValidElement(icon)) return icon
  if (typeof icon === "function" || typeof icon === "object") {
    const Icon = icon as ComponentType<{ size?: number }>
    return <Icon size={14} />
  }
  return icon
}

/**
 * Splits the toolbar into three visual clusters — text formatting, size/
 * emphasis, and everything else (code plus the annotations rendered right
 * after it) — so related buttons read as a group instead of one flat row.
 * Named rather than positional so the grouping survives the schema's
 * decorators being reordered or extended.
 */
const FORMAT_DECORATOR_VALUES = new Set([
  "strong",
  "em",
  "underline",
  "strike-through",
])
const SIZE_DECORATOR_VALUES = new Set(["small", "medium", "large", "accent"])
const HEADING_DECORATOR_VALUES = new Set([
  "heading1",
  "heading2",
  "heading3",
  "heading4",
])

function ToolbarDivider() {
  return (
    <span
      style={{
        alignSelf: "stretch",
        width: 1,
        background: "currentColor",
        opacity: 0.2,
      }}
    />
  )
}

function ToolbarGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <span
        style={{
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          opacity: 0.6,
        }}
      >
        {title}
      </span>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {children}
      </div>
    </div>
  )
}

function DecoratorButton({
  editor,
  decorator,
}: {
  editor: Editor
  decorator: BlockDecoratorDefinition
}) {
  const isActive = useEditorSelector(editor, isActiveDecorator(decorator.value))

  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="icon"
      title={decorator.title}
      aria-label={decorator.title}
      aria-pressed={isActive}
      onClick={() =>
        editor.send({ type: "decorator.toggle", decorator: decorator.value })
      }
    >
      {renderIcon(decorator.icon) ?? decorator.title}
    </Button>
  )
}

/**
 * Text-color presets sourced from the brand tokens in `src/app/globals.css`
 * (`--accent`, `--foreground`, `--muted-foreground`, `--destructive`), so
 * editors pick from the same palette the rest of the site uses instead of
 * a freehand hex value that can drift from the brand.
 */
const TEXT_COLOR_PRESETS: { title: string; hex: string }[] = [
  { title: "Accent", hex: "#af7c3c" },
  { title: "Foreground", hex: "#ece9e4" },
  { title: "Muted", hex: "#6b6460" },
  { title: "Destructive", hex: "#e5484d" },
]

function AnnotationButton({
  editor,
  annotation,
  isOpen,
  annotationInput,
  onToggleOpen,
  onInputChange,
  onApply,
  onApplyPreset,
}: {
  editor: Editor
  annotation: ObjectSchemaType
  isOpen: boolean
  annotationInput: string
  onToggleOpen: (currentValue: string) => void
  onInputChange: (value: string) => void
  onApply: () => void
  onApplyPreset: (hex: string) => void
}) {
  const isActive = useEditorSelector(
    editor,
    isActiveAnnotation(annotation.name),
  )
  const activeAnnotations = useEditorSelector(editor, getActiveAnnotations)
  const activeAnnotation = activeAnnotations.find(
    (a) => a._type === annotation.name,
  ) as { hex?: string; href?: string } | undefined
  const activeValue =
    annotation.name === "color"
      ? (activeAnnotation?.hex ?? "")
      : (activeAnnotation?.href ?? "")

  return (
    <span style={{ position: "relative" }}>
      <Button
        type="button"
        variant={isActive ? "default" : "outline"}
        size="icon"
        title={annotation.title}
        aria-label={annotation.title ?? annotation.name}
        aria-pressed={isActive}
        onClick={() => onToggleOpen(activeValue)}
      >
        {renderIcon(annotation.icon) ?? annotation.title ?? annotation.name}
      </Button>
      {isOpen && (
        <span
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 10,
            display: "flex",
            gap: "0.25rem",
            alignItems: "center",
            marginTop: "0.25rem",
            background: "Canvas",
            border: "1px solid currentColor",
            borderRadius: 4,
            padding: "0.25rem",
          }}
        >
          {annotation.name === "color" &&
            TEXT_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                title={preset.title}
                aria-label={preset.title}
                onClick={() => onApplyPreset(preset.hex)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "1px solid rgba(128, 128, 128, 0.4)",
                  background: preset.hex,
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          <input
            type={annotation.name === "color" ? "color" : "url"}
            value={annotationInput}
            onChange={(event) => onInputChange(event.target.value)}
            // For color, closing the native picker (blur) is the commit
            // gesture — no separate Apply click needed. Link stays on an
            // explicit Apply since a plain text field has no equivalent
            // "done picking" moment.
            onBlur={annotation.name === "color" ? () => onApply() : undefined}
            style={{ color: "inherit" }}
          />
          {annotation.name !== "color" && (
            <button type="button" onClick={onApply}>
              Apply
            </button>
          )}
        </span>
      )}
    </span>
  )
}

function Toolbar({
  decorators,
  annotations,
}: {
  decorators: BlockDecoratorDefinition[]
  annotations: ObjectSchemaType[]
}) {
  const editor = useEditor()
  const [openAnnotation, setOpenAnnotation] = useState<string | null>(null)
  const [annotationInput, setAnnotationInput] = useState("")

  const formatDecorators = decorators.filter((d) =>
    FORMAT_DECORATOR_VALUES.has(d.value),
  )
  const sizeDecorators = decorators.filter((d) =>
    SIZE_DECORATOR_VALUES.has(d.value),
  )
  const headingDecorators = decorators.filter((d) =>
    HEADING_DECORATOR_VALUES.has(d.value),
  )
  const otherDecorators = decorators.filter(
    (d) =>
      !FORMAT_DECORATOR_VALUES.has(d.value) &&
      !SIZE_DECORATOR_VALUES.has(d.value) &&
      !HEADING_DECORATOR_VALUES.has(d.value),
  )

  // `annotation.toggle` flips the annotation off if the selection already
  // has one — fine for a plain toggle button, but wrong for "apply this
  // value": switching to a different preset while text already had a color
  // would just remove the color instead of changing it. Removing first (a
  // no-op if nothing's active) then adding always lands on the requested
  // value regardless of prior state.
  const applyAnnotation = (name: string, hexOverride?: string) => {
    if (name === "link") {
      editor.send({ type: "annotation.remove", annotation: { name: "link" } })
      editor.send({
        type: "annotation.add",
        annotation: { name: "link", value: { href: annotationInput } },
      })
    }
    if (name === "color") {
      editor.send({ type: "annotation.remove", annotation: { name: "color" } })
      editor.send({
        type: "annotation.add",
        annotation: {
          name: "color",
          value: { hex: hexOverride ?? annotationInput },
        },
      })
    }
    setOpenAnnotation(null)
    setAnnotationInput("")
  }

  type ToolbarGroupSpec = { title: string; content: ReactNode } | null

  const toolbarGroupSpecs: ToolbarGroupSpec[] = [
    formatDecorators.length > 0
      ? {
          title: "Format",
          content: formatDecorators.map((decorator) => (
            <DecoratorButton
              key={decorator.value}
              editor={editor}
              decorator={decorator}
            />
          )),
        }
      : null,
    sizeDecorators.length > 0
      ? {
          title: "Size",
          content: sizeDecorators.map((decorator) => (
            <DecoratorButton
              key={decorator.value}
              editor={editor}
              decorator={decorator}
            />
          )),
        }
      : null,
    headingDecorators.length > 0
      ? {
          title: "Heading",
          content: headingDecorators.map((decorator) => (
            <DecoratorButton
              key={decorator.value}
              editor={editor}
              decorator={decorator}
            />
          )),
        }
      : null,
    otherDecorators.length > 0 || annotations.length > 0
      ? {
          title: "Other",
          content: (
            <>
              {otherDecorators.map((decorator) => (
                <DecoratorButton
                  key={decorator.value}
                  editor={editor}
                  decorator={decorator}
                />
              ))}
              {annotations.map((annotation) => (
                <AnnotationButton
                  key={annotation.name}
                  editor={editor}
                  annotation={annotation}
                  isOpen={openAnnotation === annotation.name}
                  annotationInput={annotationInput}
                  onToggleOpen={(currentValue) => {
                    const opening = openAnnotation !== annotation.name
                    setOpenAnnotation(opening ? annotation.name : null)
                    if (opening) {
                      setAnnotationInput(
                        currentValue ||
                          (annotation.name === "color" ? "#000000" : ""),
                      )
                    }
                  }}
                  onInputChange={setAnnotationInput}
                  onApply={() => applyAnnotation(annotation.name)}
                  onApplyPreset={(hex) => applyAnnotation(annotation.name, hex)}
                />
              ))}
            </>
          ),
        }
      : null,
  ]
  const toolbarGroups = toolbarGroupSpecs.filter(
    (group): group is Exclude<ToolbarGroupSpec, null> => group !== null,
  )

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
      {toolbarGroups.map((group, index) => (
        <Fragment key={group.title}>
          {index > 0 && <ToolbarDivider />}
          <ToolbarGroup title={group.title}>{group.content}</ToolbarGroup>
        </Fragment>
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

  // `EditorProvider` only reuses its internal editor instance when
  // `initialConfig` is referentially the same object as last render — a
  // fresh literal here tore the whole editor down and rebuilt it on every
  // render (including on every keystroke, since `props.value` changes each
  // time `onChange` echoes back through Sanity's form state), which is what
  // made the editor feel slow to focus and type into. `initialValue` is only
  // ever read on that first build, so it's deliberately left out of the
  // dependency array — depending on `schemaDefinition` alone keeps this
  // stable across the value updates that flow from typing.
  const initialConfig = useMemo(
    () => ({ schemaDefinition, initialValue: props.value }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schemaDefinition],
  )

  return (
    <EditorProvider initialConfig={initialConfig}>
      <EventListenerPlugin
        on={(event: EditorEmittedEvent) => {
          if (event.type !== "mutation") return
          props.onChange(event.value ? set(event.value) : unset())
        }}
      />
      <NodePlugin nodes={nodes} />
      <BehaviorPlugin behaviors={CUSTOM_BEHAVIORS} />
      <Toolbar decorators={decorators} annotations={annotations} />
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
