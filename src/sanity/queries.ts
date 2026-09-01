import { defineQuery } from "next-sanity";

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  heading,
  body,
  image,
  video{ asset->{url} }
}`);
