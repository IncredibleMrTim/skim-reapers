import type { SchemaTypeDefinition } from "sanity"

import { homePage } from "./home/homePage"
import { hero } from "./hero"
import { whatWeDo } from "./home/whatWeDo"
import { belief } from "./home/belief"
import { aboutPage } from "./about/aboutPage"
import { servicesPage } from "./services/servicesPage"
import { commercialPage } from "./commercial/commercialPage"
import { domesticPage } from "./domestic/domesticPage"
import { ourWorkPage } from "./ourWork/ourWorkPage"
import { reviewsPage } from "./reviews/reviewsPage"
import { qaPage } from "./qa/qaPage"
import { contactPage } from "./contact/contactPage"
import { workWithUsPage } from "./workWithUs/workWithUsPage"

const homeSchemas = [homePage, hero, whatWeDo, belief]
const aboutSchemas = [aboutPage]
const servicesSchemas = [servicesPage]
const commercialSchemas = [commercialPage]
const domesticSchemas = [domesticPage]
const ourWorkSchemas = [ourWorkPage]
const reviewsSchemas = [reviewsPage]
const qaSchemas = [qaPage]
const contactSchemas = [contactPage]
const workWithUsSchemas = [workWithUsPage]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    ...homeSchemas,
    ...aboutSchemas,
    ...servicesSchemas,
    ...commercialSchemas,
    ...domesticSchemas,
    ...ourWorkSchemas,
    ...reviewsSchemas,
    ...qaSchemas,
    ...contactSchemas,
    ...workWithUsSchemas,
  ],
}
