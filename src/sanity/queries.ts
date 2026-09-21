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
  images,
  about
}`)
