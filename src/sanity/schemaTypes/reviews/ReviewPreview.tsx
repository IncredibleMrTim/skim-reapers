import { Box, Flex, Stack, Text } from "@sanity/ui"
import type { PreviewProps } from "sanity"

/** `date` is passed through from `prepare` in `reviewsPage.ts`. */
type ReviewPreviewProps = PreviewProps & { date?: string }

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB")

/** `prepare` only ever returns strings, but `PreviewProps` also allows components. */
const asText = (value: PreviewProps["title"]) =>
  typeof value === "string" ? value : null

/**
 * Studio list row for a review: heading on top, then the source on the left
 * and the date on the right. Sanity's default preview has no right-hand slot,
 * hence the custom component.
 */
export function ReviewPreview({ title, subtitle, date }: ReviewPreviewProps) {
  return (
    <Box padding={2}>
      <Stack gap={2}>
        <Text size={1} weight="semibold" textOverflow="ellipsis">
          {asText(title)}
        </Text>
        <Flex justify="flex-start" align="center" gap={1} paddingTop={1}>
          <Text size={1} muted textOverflow="ellipsis">
            {asText(subtitle)}
          </Text>
          {date && subtitle && (
            <Text muted size={1}>
              -
            </Text>
          )}
          {date && (
            <Text size={1} muted style={{ flexShrink: 0 }}>
              {DATE_FORMAT.format(new Date(date))}
            </Text>
          )}
        </Flex>
      </Stack>
    </Box>
  )
}
