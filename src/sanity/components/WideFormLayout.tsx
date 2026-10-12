import type { LayoutProps } from "sanity"

const FORM_MAX_WIDTH_PX = 1100

// Sanity caps the document form at a narrow column (about 640px) and offers
// no config option to change it. The cap sits on the form's root container,
// which is the first child of the document scroller. It's matched both by
// that structural selector and by the root's styled-components id
// (`sc-bzgyme-0`), so the rule survives either one changing in a Sanity
// upgrade. Re-check this if the form stops widening after an upgrade.
const WIDE_FORM_CSS = `
  [data-testid="document-panel-scroller"] > :first-child,
  .sc-bzgyme-0 {
    max-width: ${FORM_MAX_WIDTH_PX}px !important;
  }
`

/** Studio layout that widens the document editor form for long CMS pages. */
export function WideFormLayout(props: LayoutProps) {
  return (
    <>
      <style>{WIDE_FORM_CSS}</style>
      {props.renderDefault(props)}
    </>
  )
}
