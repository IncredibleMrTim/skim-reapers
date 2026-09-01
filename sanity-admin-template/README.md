# Sanity admin + branded login — reusable template

A branded `/admin` route for Sanity Studio inside a Next.js App Router
project: black backdrop, your logo, workspace title, and Sanity's own
default branding (monogram, wordmark, footer links, "Last used" badge)
stripped out. Extracted from the Skim Reapers site, built and verified
against `sanity@6.11.0`.

Covers: the admin route, auth-provider restriction, and login-screen
branding. Does **not** cover schema/structure — those are inherently
specific to whatever content you're modeling in the new project.

## What's in here

```
sanity.config.template.ts        rename to sanity.config.ts, fill in TODOs
sanity.cli.ts                    copy as-is
src/
  app/admin/[[...tool]]/
    page.tsx                     copy as-is (read the static-export note inside)
    AdminClient.tsx               copy as-is
    admin-branding.css           copy, then edit the 3 spots marked at the top
  components/
    Logo.tsx                     optional — only needed if you use a custom
                                  workspace icon instead of hiding it (see
                                  admin-branding.css)
  sanity/
    client.ts                    copy as-is
    env.ts                       copy as-is
    image.ts                     copy as-is
```

## Wiring into a new project

1. **Copy the files** above into the new project at the same relative
   paths (`src/app/admin/[[...tool]]/`, `src/sanity/`, etc.), and rename
   `sanity.config.template.ts` → `sanity.config.ts` at the project root.

2. **Install dependencies** (versions this was built against):
   ```
   sanity@^6.11.0
   next-sanity@^13.3.3
   @sanity/vision@^6.11.0
   @sanity/image-url@^2.1.1
   ```
   (`react`/`next` are peers you'll already have.)

3. **Set environment variables** for the new project's Sanity project:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=...
   NEXT_PUBLIC_SANITY_DATASET=...
   NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01   # or your preferred date
   ```

4. **Add your schema/structure.** `sanity.config.template.ts` imports
   `./src/sanity/schemaTypes` and `./src/sanity/structure` — these
   aren't included here; bring your own content model.

5. **Set up Google OAuth for the new Sanity project.** This is
   per-project on Sanity's side (manage.sanity.io → your project →
   Auth providers), not something code controls. Do this before
   testing sign-in, or the Google button will 404/fail.

6. **Customize branding** — 3 spots, called out at the top of
   `admin-branding.css`:
   - the logo image path (add your asset to `/public` first)
   - the logo's `width`/`height` if its proportions differ from a
     square mark
   - the footnote text (`content: "Powered by Sanity.io"`)

   Also set `title` in `sanity.config.ts` (shown in the login card
   header) and swap `Logo.tsx`'s `src`/`alt` if you're using it.

7. **Verify visually.** Open `/admin` in the new project and check:
   Sanity's monogram/wordmark/footer-links/"Last used" badge are all
   gone, your logo shows, the card is centered, sign-in actually works
   for both providers.

## The one real risk

Every rule in `admin-branding.css` targets Sanity Studio's *internal*
DOM — `data-ui` attributes, styled-components render order, an
undocumented quirk where the footer link row renders twice with
different markup. None of this is public API. If the target project
pins a different `sanity` version than `6.11.0`, these selectors
aren't guaranteed to still match.

Worst case if something drifts: a rule just stops matching and
Sanity's default (monogram, wordmark, etc.) quietly reappears — not a
hard break, not a broken login. But it does mean step 7 (a visual
check after wiring up) isn't optional busywork; it's how you'd catch
that this needs a re-verify pass.

If you upgrade `sanity` in a project already using this template, redo
step 7 before assuming it still looks right.
