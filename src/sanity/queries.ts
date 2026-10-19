import { defineQuery } from "next-sanity"

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  hero,
  whatWeDo,
  belief,
  heading,
  body,
  image,
  video{ asset->{url} }
}`)

export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  images,
  about
}`)

export const servicesPageQuery = defineQuery(`*[_type == "servicesPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  content,
  services,
  buttons
}`)

export const commercialPageQuery = defineQuery(`*[_type == "commercialPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  content,
  buttons
}`)

export const domesticPageQuery = defineQuery(`*[_type == "domesticPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  content,
  buttons
}`)

export const ourWorkPageQuery = defineQuery(`*[_type == "ourWorkPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  content,
  galleries,
  buttons
}`)

export const reviewsPageQuery = defineQuery(`*[_type == "reviewsPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  content,
  reviews,
  buttons
}`)

export const qaPageQuery = defineQuery(`*[_type == "qaPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  content,
  buttons,
  qaLists
}`)

export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  content,
  buttons
}`)

export const workWithUsPageQuery = defineQuery(`*[_type == "workWithUsPage"][0]{
  hero,
  heading,
  showHeading,
  vacanciesHeading,
  vacancies,
  noVacanciesMessage,
  pageDescription,
  content,
  buttons
}`)

/**
 * The vacancy list comes from the Work With Us document so the page can name
 * the role a visitor is applying for (see `withVacancyKey`).
 */
export const applicationPageQuery =
  defineQuery(`*[_type == "applicationPage"][0]{
  hero,
  heading,
  showHeading,
  pageDescription,
  photosHeading,
  photosDescription,
  whatHappensNextHeading,
  whatHappensNext,
  successMessage,
  successButtons,
  buttons,
  "vacancies": *[_type == "workWithUsPage"][0].vacancies[]{ _key, heading, date, description }
}`)
