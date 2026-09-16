import lodash from "lodash"

interface ToPlainTextBlock {
  _type: string
  children?: Array<{ text?: string }>
}

export const toPlainText = (
  blocks: ToPlainTextBlock[] = [],
  length = 100,
): string =>
  blocks
    .map((block) =>
      block._type !== "block" || !block.children
        ? ""
        : block.children
            .map(
              (child) =>
                lodash.truncate(child.text ?? "", {
                  length,
                }) ?? "",
            )
            .join(""),
    )
    .join(" ")
