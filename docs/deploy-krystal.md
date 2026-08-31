# Deploying to Krystal Hosting

The site is a **static export** (`output: 'export'` in `next.config.ts`)
with content fetched from [Sanity](https://sanity.io) at build time.
That means there's no Node.js process on the server at all — just plain
HTML/CSS/JS files served directly by LiteSpeed. This is deliberate: an
earlier version of this pipeline ran the app as a live Node process
under Krystal's cPanel/CloudLinux Node.js Selector + Passenger, and
that integration was unreliable on this account (build OOMs, and a
Passenger↔LiteSpeed proxy wiring bug with no accessible logs to fully
diagnose). Going static sidesteps that entire class of problem.

There are two environments, each a separate Git Version Control repo
in cPanel whose **repository path is the domain's document root
directly** — no separate app/build step, `git pull` *is* the deploy:

| Environment | URL | Source branch | Deploy branch | Repo path (= doc root) |
|---|---|---|---|---|
| Production | skimreapers.co.uk | `main` | `deploy/main` | `/home/skimreap/public_html` |
| Dev | dev.skimreapers.co.uk | `dev` | `deploy/dev` | `/home/skimreap/app-dev` |

(Production's repo path is `public_html`, not a dedicated `app-prod`
folder — Krystal's primary domain document root is `public_html` by
convention, so the Git Version Control repo has to point there
directly, same rule as any other domain: repo path = actual doc root.)

`.github/workflows/deploy.yml`:

1. Builds and lints the source branch (`main`/`dev`) as normal, with
   the `NEXT_PUBLIC_SANITY_*` build-time variables set (see below) so
   `next build` can fetch content from Sanity while exporting.
2. Pushes the exported `out/` directory as a single commit to a
   dedicated `deploy/main` or `deploy/dev` branch (appended on top of
   that branch's existing history, not force-pushed, so cPanel's
   fast-forward `git pull` always succeeds).
3. Calls cPanel's UAPI over HTTPS (port 2083, using an API token) to
   run `VersionControl::update`, which pulls that branch straight into
   the live document root. That's the entire deploy — no restart step,
   no build step, nothing else needed for static files.

> **Why API token instead of SSH**: SSH (port 22) is firewalled off on
> this account/server, confirmed by connection timeouts from multiple
> networks. `VersionControl::update` was verified directly against
> this account before being wired into the workflow.

## One-time setup

### 1. Sanity

Content lives in Sanity, not in this repo. Project ID `k9mbvitn`, with
**two datasets** so dev and production have fully independent content:
`development` (dev.skimreapers.co.uk, and local `pnpm dev`) and
`production` (skimreapers.co.uk). They started as a copy of each other
but now diverge independently — publishing on one Studio has no effect
on the other. Content is edited at `/admin` on the deployed site (or
locally via `pnpm dev` → `http://localhost:3000/admin`, which talks to
the `development` dataset per `.env.local`).

### 2. cPanel Git Version Control

Do this once per environment. cPanel > **Git Version Control** >
Create:

- Clone URL: this repo's GitHub URL.
- **Repository path**: the domain's actual document root (e.g.
  `/home/skimreap/app-prod` for skimreapers.co.uk) — check this in
  cPanel > **Domains** if unsure. This must be exactly right; the repo
  path *is* what gets served.
- Branch: doesn't matter which you pick at creation — the workflow
  always passes an explicit `branch=deploy/main` or `branch=deploy/dev`
  on every `VersionControl::update` call, which switches the checked-
  out branch regardless. (Those branches only exist after the first
  successful workflow run.)

If the target directory already has files in it (cPanel scaffolds a
few by default on some setups), clear it out first via File Manager —
Git Version Control refuses to clone into a non-empty directory.

**No Node.js App needs to be set up at all.** If one exists from an
earlier attempt, destroy it (cPanel > Setup Node.js App) — it's not
used and a stray Passenger config can interfere with plain static
serving.

### 3. cPanel API token

cPanel > **Security > Manage API Tokens** > Create. Restrict scope to
`VersionControl` if offered. One token covers both environments.

### 4. GitHub Actions secrets and variables

Repo Settings > Secrets and variables > Actions.

**Secrets** (New repository secret):

| Secret | Value |
|---|---|
| `KRYSTAL_HOST` | Krystal server hostname, e.g. `s99.lon.krystal.io` |
| `KRYSTAL_USER` | cPanel username |
| `KRYSTAL_API_TOKEN` | API token from step 3 |
| `KRYSTAL_PROD_REPO_ROOT` | Repository path for production |
| `KRYSTAL_DEV_REPO_ROOT` | Repository path for dev |

**Variables**: `NEXT_PUBLIC_SANITY_PROJECT_ID` and
`NEXT_PUBLIC_SANITY_API_VERSION` are repo-level (New repository
variable — public build-time values, not secret). `NEXT_PUBLIC_SANITY_DATASET`
is **environment-scoped** instead, since dev and production now build
against different datasets — set it per GitHub Environment (Repo
Settings > Environments > `dev` / `production` > Environment
variables), not at the repo level:

| Scope | Variable | Value |
|---|---|---|
| Repo | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `k9mbvitn` |
| Repo | `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2026-01-01` |
| Environment `dev` | `NEXT_PUBLIC_SANITY_DATASET` | `development` |
| Environment `production` | `NEXT_PUBLIC_SANITY_DATASET` | `production` |

The workflow tags all four jobs (`build-dev`, `build-prod`,
`deploy-dev`, `deploy-production`) with GitHub Environments
(`dev`/`production`) — created automatically on first run. Optionally
add required-reviewer protection to `production` later (Repo Settings
> Environments).

### 5. Auto-deploy from Sanity

The workflow also listens for `repository_dispatch` events, which
Sanity's webhooks call directly (no extra infrastructure needed).
Since dev and production are separate datasets now, **each dataset
gets its own webhook** sending its own `event_type`, so a publish only
rebuilds and deploys the matching environment — publishing in dev
never touches production and vice versa.

**Important**: `repository_dispatch` (like `workflow_dispatch`/
`schedule`) only reads its trigger config from the workflow file **as
it exists on the repository's default branch**. If you change this
trigger, it won't take effect until merged into `main` — pushing to
`dev` alone isn't enough, which is a real gotcha we hit once already.

Set up **two** webhooks in Sanity (manage.sanity.io → project → API →
Webhooks → Create webhook), one per dataset:

**Dev webhook:**
- URL: `https://api.github.com/repos/IncredibleMrTim/skim-reapers/dispatches`
- Dataset: `development`
- Trigger on: Create, Update
- Filter (GROQ): `!(_id in path("drafts.**"))` — skips draft autosaves
- HTTP method: `POST`
- Headers: `Authorization: Bearer <token>`, `Accept: application/vnd.github+json`
  — the token is a GitHub fine-grained personal access token scoped to
  just this repo with **Contents: Read and write** permission (create
  once in GitHub Settings → Developer settings → Personal access
  tokens; the same token works for both webhooks)
- Payload: `{"event_type": "sanity-publish-dev"}`

**Production webhook:** same as above, except:
- Dataset: `production`
- Payload: `{"event_type": "sanity-publish-prod"}`

## First deploy

Push to `dev` first, then `main`. If a deploy step fails, the workflow
prints cPanel's JSON response (including `errors`), which is usually
enough to diagnose.
