import type { StructureResolver } from "sanity/structure";

// Present Home Page as a singleton (a single editable document, not a
// list of documents) since there's exactly one homepage.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .child(
          S.document().schemaType("homePage").documentId("homePage")
        ),
    ]);
