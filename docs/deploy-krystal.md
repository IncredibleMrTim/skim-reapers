# Deploying to Krystal Hosting

Krystal (cPanel + Passenger) has no native GitHub integration or webhook
deploy, so this repo's CI/CD is hand-wired. There are two environments,
each a separate cPanel Node.js app with its own Git Version Control repo
tracking a different branch:

| Environment | URL | Branch | cPanel app |
|---|---|---|---|
| Production | skimreapers.co.uk | `main` | e.g. `skim-reapers-web` |
| Dev | dev.skimreapers.co.uk | `dev` | e.g. `skim-reapers-web-dev` |

`.github/workflows/deploy.yml` builds and lints on every push/PR to
either branch, then on a push to `main` or `dev` calls cPanel's UAPI
over HTTPS (port 2083) using an API token, for the matching environment:
- `VersionControl::update` pulls the latest commit into that
  environment's server-side repo
- `VersionControlDeployment::create` triggers a deployment, which runs
  the tasks in `.cpanel.yml` (install deps, build, restart the app)

> **Why API token instead of SSH**: SSH (port 22) is firewalled off on
> this account/server — confirmed by connection timeouts from multiple
> networks, not just the account holder's own key setup. cPanel's own
> web port (2083) is reachable, and UAPI calls over HTTPS with an API
> token work fine, so that's the deploy path this workflow uses instead.
> Both `VersionControl::update` and `VersionControlDeployment::create`
> were verified directly against this account before being wired into
> the workflow.

Do the following once in cPanel, **twice** — once per environment —
before the workflow will work.

## 1. Set up the Node.js app

cPanel > **Setup Node.js App** > Create Application.

- Node version: 20 or later (match what's used locally/in CI). Use the
  same version for both environments to avoid drift.
- Application root: pick a path per environment, e.g. `skim-reapers-web`
  (prod) and `skim-reapers-web-dev` (dev) — these become
  `/home/<cpanel-user>/skim-reapers-web` and `.../skim-reapers-web-dev`.
- Domain: point the production app at `skimreapers.co.uk` and the dev
  app at the `dev.skimreapers.co.uk` subdomain (create the subdomain
  first in cPanel > Domains if it doesn't exist yet).
- Application startup file: `server.js` (already in this repo — a plain
  Node custom server that listens on `process.env.PORT`, which is what
  Passenger requires; the Next.js CLI itself isn't a valid entrypoint).
- Copy the **"Enter to the virtual environment"** command cPanel shows
  you for *this* app (looks like
  `source /home/USER/nodevenv/skim-reapers-web/20/bin/activate` — the
  path differs between the two apps). Paste it into that environment's
  checked-out `.cpanel.yml` in place of `NODEVENV_ACTIVATE`.

  Because the activation path is app-specific, `.cpanel.yml` is expected
  to differ between the `main` and `dev` branches — edit it directly on
  each branch once its cPanel app exists, rather than trying to keep the
  two identical.

## 2. Set up Git Version Control

cPanel > **Git Version Control** > Create. Do this once per app, pointed
at the matching branch.

- Clone URL: this repo's GitHub URL (use a deploy key or PAT if private).
- **Repository path**: set this to the *same* directory as that app's
  application root above, so `.cpanel.yml`'s tasks run directly in the
  app directory with no separate copy step.
- Branch: `main` for the production app, `dev` for the dev app.

Note the **Repository Path** shown on this screen for each app — those
are the values for `KRYSTAL_PROD_REPO_ROOT` / `KRYSTAL_DEV_REPO_ROOT`
below (e.g. `/home/USER/skim-reapers-web` and
`/home/USER/skim-reapers-web-dev`).

## 3. Create a cPanel API token

cPanel > **Security > Manage API Tokens** > Create.

- Name it something identifiable, e.g. `github-actions-deploy`.
- If cPanel offers an ACL/scope restriction, restrict it to
  `VersionControl` (least privilege — this token only needs to pull and
  deploy repos, not manage email/DNS/billing/etc).
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
diagnose — most likely culprits are a wrong `repository_root` or the
Node app not yet existing at that path.
