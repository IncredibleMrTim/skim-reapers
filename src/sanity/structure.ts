import type { StructureResolver } from "sanity/structure"

// Present Home Page and About Page as singletons (a single editable
// document each, not a list of documents) since there's exactly one of each.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("About Page")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Services Page")
        .child(
          S.document().schemaType("servicesPage").documentId("servicesPage"),
        ),
    ])
