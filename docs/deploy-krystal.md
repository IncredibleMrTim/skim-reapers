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
| Production | skimreapers.co.uk | `main` | `deploy/main` | `/home/skimreap/app-prod` |
| Dev | dev.skimreapers.co.uk | `dev` | `deploy/dev` | `/home/skimreap/app-dev` |

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

Content lives in Sanity, not in this repo. Project ID `k9mbvitn`,
dataset `production` (confirm/correct in Sanity's manage console if
different). Content is edited at `/studio` on the deployed site (or
locally via `pnpm dev` → `http://localhost:3000/studio`).

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

**Variables** (New repository variable — these are public build-time
values, not secret):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `k9mbvitn` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2026-01-01` |

The workflow tags its two deploy jobs with GitHub Environments
(`production` and `dev`) — created automatically on first run.
Optionally add required-reviewer protection to `production` later
(Repo Settings > Environments).

## First deploy

Push to `dev` first, then `main`. If a deploy step fails, the workflow
prints cPanel's JSON response (including `errors`), which is usually
enough to diagnose.
