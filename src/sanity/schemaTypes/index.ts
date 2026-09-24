import type { SchemaTypeDefinition } from "sanity"

import { homePage } from "./home/homePage"
import { hero } from "./hero"
import { whatWeDo } from "./home/whatWeDo"
import { belief } from "./home/belief"
import { aboutPage } from "./about/aboutPage"
import { servicesPage } from "./services/servicesPage"

const homeSchemas = [homePage, hero, whatWeDo, belief]
const aboutSchemas = [aboutPage]
const servicesSchemas = [servicesPage]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...homeSchemas, ...aboutSchemas, ...servicesSchemas],
}
