import type { SchemaTypeDefinition } from "sanity"

import { homePage } from "./home/homePage"
import { hero } from "./hero"
import { whatWeDo } from "./home/whatWeDo"
import { belief } from "./home/belief"
import { aboutPage } from "./about/aboutPage"

const homeSchemas = [homePage, hero, whatWeDo, belief]
const aboutSchemas = [aboutPage]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...homeSchemas, ...aboutSchemas],
}
