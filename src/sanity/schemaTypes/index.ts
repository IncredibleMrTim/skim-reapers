import type { SchemaTypeDefinition } from "sanity"

import { homePage } from "./home/homePage"
import { hero } from "./hero"
import { whatWeDo } from "./home/whatWeDo"
import { belief } from "./home/belief"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, hero, whatWeDo, belief],
}
