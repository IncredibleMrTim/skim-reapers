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
      S.listItem()
        .title("Commercial Page")
        .child(
          S.document()
            .schemaType("commercialPage")
            .documentId("commercialPage"),
        ),
      S.listItem()
        .title("Domestic Page")
        .child(
          S.document().schemaType("domesticPage").documentId("domesticPage"),
        ),
      S.listItem()
        .title("Our Work Page")
        .child(
          S.document().schemaType("ourWorkPage").documentId("ourWorkPage"),
        ),
      S.listItem()
        .title("Reviews Page")
        .child(
          S.document().schemaType("reviewsPage").documentId("reviewsPage"),
        ),
      S.listItem()
        .title("Q&A Page")
        .child(S.document().schemaType("qaPage").documentId("qaPage")),
      S.listItem()
        .title("Contact Page")
        .child(
          S.document().schemaType("contactPage").documentId("contactPage"),
        ),
      S.listItem()
        .title("Work With Us Page")
        .child(
          S.document()
            .schemaType("workWithUsPage")
            .documentId("workWithUsPage"),
        ),
      S.listItem()
        .title("Custom Colors")
        .child(
          S.document().schemaType("colorPalette").documentId("colorPalette"),
        ),
    ])
