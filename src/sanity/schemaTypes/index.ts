import type { SchemaTypeDefinition } from "sanity"

import { homePage } from "./homePage"
import { hero } from "./hero"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, hero],
}
