import type { StructureResolver } from "sanity/structure"

import { ContentListPane, type ContentListItem } from "./ContentListPane"

// Each entry is a singleton (a single editable document, not a list of
// documents) since there's exactly one of each. Add a `description` to show
// a short line under the title in the Content list.
const CONTENT_ITEMS: ContentListItem[] = [
  { id: "homePage", title: "Home Page", schemaType: "homePage" },
  { id: "aboutPage", title: "About Page", schemaType: "aboutPage" },
  { id: "servicesPage", title: "Services Page", schemaType: "servicesPage" },
  {
    id: "commercialPage",
    title: "Commercial Page",
    schemaType: "commercialPage",
  },
  { id: "domesticPage", title: "Domestic Page", schemaType: "domesticPage" },
  { id: "ourWorkPage", title: "Our Work Page", schemaType: "ourWorkPage" },
  { id: "reviewsPage", title: "Reviews Page", schemaType: "reviewsPage" },
  { id: "qaPage", title: "Q&A Page", schemaType: "qaPage" },
  { id: "contactPage", title: "Contact Page", schemaType: "contactPage" },
  {
    id: "workWithUsPage",
    title: "Work With Us Page",
    schemaType: "workWithUsPage",
  },
  { id: "colorPalette", title: "Custom Colors", schemaType: "colorPalette" },
]

export const structure: StructureResolver = (S) =>
  S.component(ContentListPane)
    .id("content")
    .title("Content")
    .options({ items: CONTENT_ITEMS })
    .child((childId) => {
      const item = CONTENT_ITEMS.find(({ id }) => id === childId)
      return S.document()
        .schemaType(item?.schemaType ?? childId)
        .documentId(childId)
    })
