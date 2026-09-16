import { defineQuery } from "next-sanity";

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  hero,
  heading,
  body,
  image,
  video{ asset->{url} }
}`);
