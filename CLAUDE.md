@AGENTS.md

# Skim Reapers — Project Setup

Marketing site for Skim Reapers Ltd, a plastering company. Next.js App Router, statically exported, content managed in Sanity, deployed to Krystal Hosting via cPanel — **not Vercel**.

## Stack

- Next.js 16 (App Router), `output: "export"` in `next.config.ts` — plain static HTML/CSS/JS, no Node.js process at runtime
- React 19, TypeScript
- Tailwind CSS v4 — CSS-based theme in `src/app/globals.css` (`@theme inline` block defines `brand-*` color tokens and `font-heading`); there is no `tailwind.config.*`
- Sanity CMS (`sanity`, `next-sanity`, `@sanity/vision`) — Studio mounted at `/admin`
- Fonts loaded via `next/font/google` in `src/app/layout.tsx` (Inter for body text, Oswald for headings), exposed as CSS variables (`--font-inter`, `--font-oswald`)
- pnpm (`packageManager: pnpm@10.34.5`)

## TypeScript Standards

### Type Safety

- **NEVER use `any` type** - Always use proper types or `unknown` if truly needed
- Use strict TypeScript settings - `strict` is already on in `tsconfig.json`; keep it passing
- Prefer types inferred from Sanity queries (`defineQuery` results in `src/sanity/queries.ts`) and schema (`src/sanity/schemaTypes/`) over hand-written duplicates of the same shape — there is no `@/types/interfaces` folder in this project
- Use type inference where obvious, explicit types where clarity helps (component props, function signatures)

### Examples

```typescript
// ❌ BAD
function renderChecklist(items: any) {
  return items.map((x: any) => x.toUpperCase());
}

// ✅ GOOD
function renderChecklist(items: string[]): string[] {
  return items.map((item) => item.toUpperCase());
}
```

## Naming Conventions

### Variables & Functions

- Use **descriptive, meaningful names** - no abbreviations unless universally known
- Functions: `verbNoun` format (e.g., `urlForImage`, `renderChecklist`)
- Boolean variables: prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`)
- Constants: `SCREAMING_SNAKE_CASE` for true constants (see the image URL constants in `Hero.tsx`)
- State/local variables: describe what they hold (e.g., `homePage` not `data`, `imageUrl` not `url`)

### Examples

```typescript
// ❌ BAD
const d = await client.fetch(homePageQuery);
const img = d.image;

// ✅ GOOD
const homePage = await client.fetch(homePageQuery);
const imageUrl = homePage.image;
```

## Code Style

### Functions

- Keep functions small and focused (single responsibility)
- Max 50 lines per function - extract helpers if longer
- Prefer pure functions where possible
- Always add JSDoc comments for exported functions

### React Components

- Use functional components with hooks
- Keep component files under 300 lines
- Extract complex logic to custom hooks or utility functions (see `useRedirectOnSignOut` in `AdminClient.tsx` for a precedent)
- Props interface should be named `[ComponentName]Props`
- Extract large sections of markup into their own components where appropriate to minimize component size — `Hero.tsx` being pulled out of `page.tsx` is the model to follow

### Design Systems

- **Use shadcn components where possible instead of writing your own.** Do not use the Radix UI primitives directly — use the shadcn syntax.
- shadcn is not yet installed in this project (`npx shadcn@latest init`) — set it up the first time a component is needed rather than hand-rolling one, then add components with `npx shadcn@latest add <component>`
- For anything shadcn doesn't cover, style with Tailwind utility classes, not inline `style` objects
- Reuse the `brand-*` color tokens and `font-heading` utility defined in `globals.css`'s `@theme inline` block rather than hardcoding hex colors or repeating `var(--...)` — add new tokens there if the design needs a new theme value, and map them into shadcn's theme so its components pick up the same palette
- Reserve inline `style` for values that genuinely can't be static Tailwind classes, like a background image URL built from a Sanity asset

### Content Fetching

- This is a static export with no server runtime — there's no `"use server"`, API routes, or Server Actions to reach for; all data comes from Sanity at build time
- Add new queries to `src/sanity/queries.ts` with `defineQuery`, don't inline GROQ strings in components
- Load data via `client.fetch`, not hardcoded placeholder constants in a component
- Never log sensitive data (API keys, the cPanel API token, Sanity webhook secrets)

### Comments

- Write comments for **WHY**, not **WHAT**
- Document business logic and non-obvious decisions
- No commented-out code in commits - use git history instead
- Add TODO comments with context — this project has no ticket system, so `// TODO: <description>` rather than a ticket reference

## Structure

- `src/app/` — App Router pages. `page.tsx` fetches `homePageQuery` from Sanity and renders `Hero`.
- `src/app/admin/[[...tool]]/` — Sanity Studio, statically embedded (`generateStaticParams` + `AdminClient`). Sign-in restricted to Google + Sanity email/password (`sanity.config.ts`); who can actually sign in is managed in manage.sanity.io.
- `src/components/` — page components (`Hero.tsx`, `Logo.tsx`).
- `src/sanity/` — `client.ts` (Sanity client), `env.ts` (required env vars, asserted at import time), `image.ts` (image URL builder), `queries.ts` (GROQ queries), `schemaTypes/` (content schema), `structure.ts` (Studio desk structure — `homePage` is a singleton document).
- `sanity-admin-template/` — reusable admin/auth/branding template; excluded from type-checking and lint.
- `docs/deploy-krystal.md` — full deploy runbook and one-time cPanel/GitHub setup.

## Environment

Required in `.env.local` for local dev:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=k9mbvitn
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01
```

Dev and production are **separate Sanity datasets** (`development` / `production`) with independent content — they started as copies of each other but now diverge independently; publishing in one Studio never touches the other.

## Commands

- `pnpm dev` — dev server + Studio at `http://localhost:3000/admin` (talks to the `development` dataset)
- `pnpm build` — static export to `out/`, fetching content from Sanity at build time
- `pnpm lint` — ESLint

## Deployment

Static export pushed to Krystal Hosting via cPanel Git Version Control, driven by GitHub Actions (`.github/workflows/deploy.yml`) — no Node.js process on the server, `git pull` (via cPanel's UAPI) is the entire deploy.

| Environment | URL | Source branch | Deploy branch |
|---|---|---|---|
| Production | skimreapers.co.uk | `main` | `deploy/main` |
| Dev | dev.skimreapers.co.uk | `dev` | `deploy/dev` |

Also triggered automatically by Sanity webhooks on publish (dataset-scoped, so a dev publish only redeploys dev). See `docs/deploy-krystal.md` for the full one-time setup and troubleshooting notes.
