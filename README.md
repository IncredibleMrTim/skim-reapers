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
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

This app is a static export (content fetched from Sanity at build time) deployed to [Krystal Hosting](https://krystal.io) via cPanel Git Version Control, triggered automatically by GitHub Actions on push to `main` (production) or `dev` (dev.skimreapers.co.uk). See [`docs/deploy-krystal.md`](docs/deploy-krystal.md) for the one-time cPanel setup checklist.
