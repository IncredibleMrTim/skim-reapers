This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Copy `.env.local` (see below) with your Sanity project details, then run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Content

Content is managed in [Sanity](https://sanity.io), not in this repo. Edit it at `/admin` (locally: `http://localhost:3000/admin`). Requires these in `.env.local` for local dev:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=k9mbvitn
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01
```

Dev and production are separate Sanity datasets (`development` and `production`) with independent content — see [`docs/deploy-krystal.md`](docs/deploy-krystal.md).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Sanity types

Query result types aren't hand-written — they're generated from the schema and the `defineQuery` calls in `src/sanity/queries.ts`. Run this after changing a schema type or a query:

```bash
pnpm typegen
```

This extracts the schema to `schema.json` (gitignored) and regenerates `src/sanity/types.ts` (checked in). Import result types from there, e.g. `HomePageQueryResult`, rather than writing a duplicate interface by hand.

**Portable Text fields**: don't type a component's rich-text prop against `@portabletext/react`'s exported `PortableTextBlock` — it won't structurally match the generated type. TypeGen makes every field on a block optional (`children?`, `style?`, etc.), matching what GROQ can actually return, while `PortableTextBlock` is the stricter, hand-authored canonical shape (`children` required, etc.) — same data, incompatible types. Derive the prop type from the generated schema type instead:

```tsx
import type { WhatWeDo } from "@/sanity/types"

type CardData = NonNullable<WhatWeDo["cards"]>[number]

interface ICard {
  text?: CardData["text"] // not PortableTextBlock[]
}
```

`<PortableText value={text} />` itself accepts this fine — only the prop's own declared type needs to come from the generated Sanity type, not the package.

### Adding a new page with a hero section

`Header` (`Navbar` + `Hero`) is rendered per-page, not in the shared `(pages)` layout, since each page's hero content comes from a different Sanity document. To add it to a new page:

1. **Schema** — add a `hero` field of type `hero` to the page's document schema, reusing the shared object type:

   ```ts
   // src/sanity/schemaTypes/aboutPage.ts
   import { defineField, defineType } from "sanity"

   export const aboutPage = defineType({
     name: "aboutPage",
     title: "About Page",
     type: "document",
     fields: [
       defineField({ name: "hero", type: "hero" }),
       // ...about-specific content fields
     ],
   })
   ```

   Register it in `schemaTypes/index.ts`.

2. **Query** — add the matching query in `src/sanity/queries.ts`:

   ```ts
   export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0]{
     hero,
     // ...
   }`)
   ```

   Then run `pnpm typegen` to generate `AboutPageQueryResult`.

3. **Page** — fetch and pass `hero` into `Header`:

   ```tsx
   // src/app/(pages)/about/page.tsx
   import { client } from "@/sanity/client"
   import { aboutPageQuery } from "@/sanity/queries"
   import { Header } from "@/components/header/Header"

   export default async function AboutPage() {
     const aboutPage = await client.fetch(aboutPageQuery)

     return (
       <>
         <Header hero={aboutPage?.hero} />
         <main>{/* about content */}</main>
       </>
     )
   }
   ```

`Header`/`Hero` don't need to change — they already accept a `hero` prop typed against the shared `hero` schema object.

### Adding Sanity content to a section

Sections like `WhatWeDo` and `BeliefBar` currently render hardcoded copy. To make a section's content editable in Sanity instead:

1. **Schema** — add a field for it on that page's document (or a shared object type if other pages will reuse the same shape):

   ```ts
   // src/sanity/schemaTypes/homePage.ts
   defineField({
     name: "whatWeDo",
     title: "What We Do",
     type: "object",
     fields: [
       defineField({ name: "heading", type: "string" }),
       defineField({ name: "text", type: "text" }),
       defineField({
         name: "cards",
         type: "array",
         of: [{ type: "object", fields: [/* ... */] }],
       }),
     ],
   })
   ```

2. **Query** — add it to that page's query projection in `src/sanity/queries.ts`:

   ```ts
   export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
     hero,
     whatWeDo,
     // ...
   }`)
   ```

   Run `pnpm typegen` to pick up the new field on `HomePageQueryResult`.

3. **Consume it** — the page already fetches `homePage`; pass the new field down as props instead of the section fetching anything itself (sections stay presentational, `page.tsx` stays the only place doing `client.fetch`):

   ```tsx
   // src/app/(pages)/(home)/page.tsx
   <WhatWeDo {...homePage.whatWeDo} />
   ```

   ```tsx
   // src/components/home/whatWeDo/WhatWeDo.tsx
   import type { HomePageQueryResult } from "@/sanity/types"

   type WhatWeDoProps = NonNullable<HomePageQueryResult["whatWeDo"]>

   export const WhatWeDo = ({ heading, text, cards }: WhatWeDoProps) => {
     // ...
   }
   ```

Same flow as the hero section: schema field → query → `pnpm typegen` → typed props, no hand-written interfaces duplicating the schema.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

This app is a static export (content fetched from Sanity at build time) deployed to [Krystal Hosting](https://krystal.io) via cPanel Git Version Control, triggered automatically by GitHub Actions on push to `main` (production) or `dev` (dev.skimreapers.co.uk). See [`docs/deploy-krystal.md`](docs/deploy-krystal.md) for the one-time cPanel setup checklist.
