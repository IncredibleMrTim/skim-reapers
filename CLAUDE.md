@AGENTS.md

# Skim Reapers — Project Setup

Marketing site for Skim Reapers Ltd, a plastering company. Next.js App Router, statically exported, content in Sanity, deployed to Krystal Hosting via cPanel — **not Vercel**.

## Working Style

Tim and Claude are a friendly team (BFFs, as of 2026-10-08): warm, personable, a bit of humour, empathy when something's frustrating. Substance stays sharp — be honest about problems, say what was and wasn't checked, keep replies short.

Critique Tim's ideas — a good friend says when something's a bad idea. Be kind: lead with what works, explain the concern and why, suggest an alternative, leave the call to Tim. Tim has feelings too.

## Stack

- Next.js 16 (App Router), `output: "export"` in `next.config.ts` — plain static HTML/CSS/JS, no Node.js at runtime
- React 19, TypeScript, pnpm (`packageManager: pnpm@10.34.5`)
- Tailwind CSS v4 — CSS-based theme in `src/app/globals.css` (`@theme inline` defines `brand-*` colour tokens and `font-heading`); no `tailwind.config.*`
- Sanity CMS (`sanity`, `next-sanity`, `@sanity/vision`) — Studio at `/admin`
- Fonts via `next/font/google` in `src/app/layout.tsx` (Inter body, Oswald headings) as `--font-inter` / `--font-oswald`

## Code Standards

### TypeScript & naming

- **NEVER use `any`** — use proper types or `unknown`. Keep `strict` passing.
- Prefer types inferred from Sanity (`defineQuery` results in `src/sanity/queries.ts`, schema in `src/sanity/schemaTypes/`) over hand-written duplicates. There is no `@/types/interfaces` folder.
- Infer where obvious; explicit for component props and function signatures.
- Descriptive names, no abbreviations unless universal. Functions `verbNoun` (`urlForImage`); booleans `is`/`has`/`should`; true constants `SCREAMING_SNAKE_CASE` (see `Hero.tsx` image URLs); variables name their contents (`homePage`, `imageUrl` — not `data`, `d`, `img`).

### Functions & components

- Small, single-purpose functions, max 50 lines; prefer pure; JSDoc on exported functions.
- Functional components with hooks; files under 300 lines; props interface named `[ComponentName]Props`.
- Extract complex logic to hooks/utilities (precedent: `useRedirectOnSignOut` in `AdminClient.tsx`) and large markup into their own components (model: `Hero.tsx` pulled out of `page.tsx`).

### Design system

- **Use shadcn components instead of writing your own**, with shadcn syntax — never Radix primitives directly. shadcn isn't installed yet: run `npx shadcn@latest init` the first time a component is needed, then `npx shadcn@latest add <component>`.
- Beyond shadcn, style with Tailwind utilities, not inline `style` objects. Reserve inline `style` for values that can't be static classes (e.g. a background image URL from a Sanity asset).
- Reuse `brand-*` tokens and `font-heading` from `globals.css` — no hardcoded hex or repeated `var(--...)`. Add new tokens to `@theme inline` and map them into shadcn's theme so its components share the palette.

### Content fetching

- Static export, no server runtime — no `"use server"`, API routes or Server Actions; all data comes from Sanity at build time.
- Add queries to `src/sanity/queries.ts` with `defineQuery`; no inline GROQ in components. Load data with `client.fetch`, never hardcoded placeholder constants.
- Never log sensitive data (API keys, the cPanel API token, Sanity webhook secrets).

### Comments

- Comment WHY, not WHAT; document business logic and non-obvious decisions. No commented-out code (use git history).
- TODOs need context: `// TODO: <description>`. Tasks live on Trello, but card links go in commit bodies, not code (cards get renamed and archived).

## Structure

- `src/app/` — pages. `page.tsx` fetches `homePageQuery` and renders `Hero`.
- `src/app/admin/[[...tool]]/` — statically embedded Studio (`generateStaticParams` + `AdminClient`). Sign-in limited to Google + Sanity email/password (`sanity.config.ts`); who can sign in is managed at manage.sanity.io.
- `src/components/` — `Hero.tsx`, `Logo.tsx`.
- `src/sanity/` — `client.ts`, `env.ts` (required env vars, asserted at import), `image.ts` (URL builder), `queries.ts` (GROQ), `schemaTypes/`, `structure.ts` (desk structure; `homePage` is a singleton).
- `sanity-admin-template/` — reusable admin/auth/branding template; excluded from type-check and lint.
- `docs/deploy-krystal.md` — deploy runbook and one-time cPanel/GitHub setup.

## Resources

`/Volumes/Tims SSD/Development/TownSquareDigital/Skim Reapers/resources` (outside this repo) holds source assets — logos, the Bronco font, hero/service images, van photo, test videos — and exported marketing images (e.g. the LinkedIn post). Look there first for any image, logo, font or video.

**Save everything generated that isn't code there** (images, screenshots, social graphics, PDFs, proposals, videos, exports) — not the Desktop, repo or a temp dir. Tell Tim the filename.

## Environment

`.env.local` for local dev:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=k9mbvitn
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01
```

`development` and `production` are **separate Sanity datasets**. They began as copies but now diverge; publishing in one Studio never touches the other.

## Browser Automation

**Default to Playwright MCP** (`mcp__plugin_playwright_playwright__*`) for page checks, flows, console/network and screenshots — snapshot-based (cheaper), no per-use confirmation. Always `browser_close` when done.

Claude in Chrome (`mcp__claude-in-chrome__*`) only when the task needs Tim's logged-in Chrome (e.g. open cPanel/Sanity session), and ask first — never open a tab automatically. Always `tabs_close_mcp` tabs you opened.

## Commands

- `pnpm dev` — dev server + Studio at `http://localhost:3000/admin` (`development` dataset)
- `pnpm build` — static export to `out/`, fetching Sanity content at build time
- `pnpm lint` — ESLint

## Deployment

Static export pushed to Krystal Hosting via cPanel Git + GitHub Actions: `main` → skimreapers.co.uk, `dev` → dev.skimreapers.co.uk (deploy branches `deploy/main`, `deploy/dev`); Sanity publish webhooks also deploy, scoped per dataset. Environments table, setup and troubleshooting: `docs/deploy-krystal.md`.

## Git & PR Workflow

Pushing to `dev` or `main` auto-deploys — a push is a live deploy. When asked to commit/push/PR:

1. First run the three CI checks: `pnpm lint` (exit 0; e.g. `react/no-unescaped-entities` fails CI), `npx tsc --noEmit`, `pnpm build` (the export is the deployed artifact).
2. Commit and push to the current branch (`dev` day-to-day) — deploys to dev.skimreapers.co.uk, the review environment.
3. Promote via PR: `gh pr create --base main --head dev`. Never push straight to `main`.
4. Feature branch (off `dev`, PR into `dev`) only for risky/experimental changes that shouldn't hit the dev site before review — ask if unsure.

### Commits

- Conventional commits: `type(scope): description`. Types: `feature`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`.
- Atomic and focused. Message in lower case except the scope.
- Put the Trello card's short link in the body when the work belongs to one (e.g. `https://trello.com/c/2FsMUfiY`).

## Design & Planning

Details live in `docs/design-and-planning.md` — read it before the task it covers:

- **Figma/FigJam** (site map, page copy, price breakdown): before building or changing any page, and before building anything marked as a paid extra. Board file key `KGKqZOZSafHcnOEBdl4Brn`, read via `mcp__figma__get_figjam`.
- **Trello** (SkimReapers board `6aa2cf1d13b7f10e2d061e9c`): before creating or moving cards. Titles are `[Page or Category] Sentence-case task`; new cards go in Backlog.

**Convention:** keep tool/MCP-specific detail in `docs/`, with only a pointer and the "read this when…" trigger here.
