# Deploying to Krystal Hosting

Krystal (cPanel + Passenger) has no native GitHub integration or webhook
deploy, so this repo's CI/CD is hand-wired. There are two environments,
each a separate cPanel Node.js app with its own Git Version Control repo:

| Environment | URL | Source branch | Deploy branch | cPanel app |
|---|---|---|---|---|
| Production | skimreapers.co.uk | `main` | `deploy/main` | `app-prod` |
| Dev | dev.skimreapers.co.uk | `dev` | `deploy/dev` | `app-dev` |

## Why the app is never built on the server

This account's Next.js compiler OOMs no matter what's tried — Turbopack
needs WebAssembly and hits `Cannot allocate Wasm memory for new
instance`; falling back to webpack doesn't help, because Next's SWC
compiler *also* falls back to a WASM build when its native binary isn't
compatible with the platform, hitting the identical crash. `pnpm
install`'s own parallelism separately triggers a V8 "Failed to reserve
virtual memory for CodeRange" OOM under the account's memory limits.
All of this was confirmed by reading the actual deployment logs (cPanel
UAPI `VersionControlDeployment::retrieve` + `Fileman::get_file_content`)
across many iterations — this account's virtual/WASM memory ceiling is
too low to run any Next.js build, full stop.

So the app is built in GitHub Actions instead (plenty of memory there),
using [`output: 'standalone'`](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) —
Next.js traces only the files each page actually needs and emits a
self-contained folder with its own minimal `server.js` (already listens
on `process.env.PORT`, satisfying Passenger) plus a pared-down
`node_modules`. `.github/workflows/deploy.yml`:

1. Builds and lints the source branch (`main`/`dev`) as normal.
2. Copies `public/` and `.next/static/` into the standalone output (Next
   doesn't do this automatically — see the output docs above).
3. Pushes that standalone output as a **single commit** to a dedicated
   `deploy/main` or `deploy/dev` branch (force-pushed each time, so the
   branch never accumulates history — it's a build artifact, not code).
4. Calls cPanel's UAPI over HTTPS (port 2083, using an API token — see
   below) to pull that deploy branch into the server-side repo and
   trigger a deployment.

The `.cpanel.yml` that ships *inside* the standalone output (written by
the workflow itself, not checked into source) does nothing but restart
Passenger — no install, no build, just picking up the files that were
already pushed:

```yaml
deployment:
  tasks:
    - mkdir -p tmp && touch tmp/restart.txt
```

> **Why API token instead of SSH**: SSH (port 22) is firewalled off on
> this account/server — confirmed by connection timeouts from multiple
> networks, not just the account holder's own key setup. `VersionControl::update`
> and `VersionControlDeployment::create` were verified directly against
> this account before being wired into the workflow.

Do the following once in cPanel, **twice** — once per environment —
before the workflow will work.

## 1. Set up the Node.js app

cPanel > **Setup Node.js App** > Create Application.

- Node version: 20 or later (match what's used in CI).
- Application root: a clean, never-before-used path per environment
  (cPanel scaffolds stub files into whatever you pick, and CloudLinux's
  NodeJS Selector separately manages `node_modules` as its own symlink —
  reusing an old path tends to leave conflicting artifacts behind).
  e.g. `app-prod` / `app-dev`.
- Domain: point the production app at `skimreapers.co.uk` and the dev
  app at the `dev.skimreapers.co.uk` subdomain.
- Application mode: **Production** (sets `NODE_ENV=production`).
- Application startup file: `server.js` — this will be the one Next.js
  itself generates inside the standalone output once a deploy has run,
  not a file you create manually.

## 2. Set up Git Version Control

cPanel > **Git Version Control** > Create. Do this once per app.

- Clone URL: this repo's GitHub URL.
- **Repository path**: must exactly match that app's application root
  from step 1 (e.g. `/home/USER/app-prod`) — the workflow deploys
  directly into this path, no separate copy step.
- Branch: doesn't matter which branch you pick here initially — the
  workflow always passes an explicit `branch=deploy/main` or
  `branch=deploy/dev` on every `VersionControl::update` call, which
  switches the checked-out branch regardless of what was set at
  creation. (Those branches won't exist until the first successful
  workflow run creates them.)

Note the **Repository Path** shown for each app — those are the values
for `KRYSTAL_PROD_REPO_ROOT` / `KRYSTAL_DEV_REPO_ROOT` below.

## 3. Create a cPanel API token

cPanel > **Security > Manage API Tokens** > Create.

- Name it something identifiable, e.g. `github-actions-deploy`.
- Restrict scope to `VersionControl` if cPanel offers that option
  (least privilege).
- Copy the token when shown (cPanel only displays it once). One token
  covers both environments since they're on the same cPanel account.

## 4. Add GitHub Actions secrets

Repo Settings > Secrets and variables > Actions > New repository secret:

| Secret | Value |
|---|---|
| `KRYSTAL_HOST` | Krystal server hostname, e.g. `s99.lon.krystal.io` (shared) |
| `KRYSTAL_USER` | cPanel username (shared) |
| `KRYSTAL_API_TOKEN` | API token from step 3 (shared) |
| `KRYSTAL_PROD_REPO_ROOT` | Repository path for the production app |
| `KRYSTAL_DEV_REPO_ROOT` | Repository path for the dev app |

The workflow tags its two deploy jobs with GitHub Environments
(`production` and `dev`) — these are created automatically on first run.
Optionally add required-reviewer protection to the `production`
environment later (Repo Settings > Environments) to gate production
deploys behind manual approval.

## 5. First deploy

Push to `dev` first to shake out issues against the lower-stakes
environment, then to `main`. If a deploy step fails, the workflow prints
cPanel's JSON response (including `errors`), which is usually enough to
diagnose.
