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
either branch, then on a push to `main` or `dev` SSHes into the Krystal
account and, for the matching environment:
- `git pull`s the latest commit into that environment's server-side repo
- runs `uapi VersionControl deployment create ...`, which executes the
  tasks in `.cpanel.yml` (install deps, build, restart the app)

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

## 3. Enable SSH key access

cPanel > **SSH Access** > Manage SSH Keys > Generate a new key (or import
one). Authorize it, then download the private key. One key covers both
apps since they're on the same cPanel account.

- Test it: `ssh -p <port> <cpanel-user>@<host>` from your machine.
- Confirm `uapi` is runnable in that shell: `uapi --showapi VersionControl`
  should list `deployment_create`/similar functions. If the function name
  differs from what's in `deploy.yml`'s script steps, update those steps
  to match — Krystal's exact cPanel version may vary.

## 4. Add GitHub Actions secrets

Repo Settings > Secrets and variables > Actions > New repository secret:

| Secret | Value |
|---|---|
| `KRYSTAL_SSH_HOST` | Krystal server hostname (shared) |
| `KRYSTAL_SSH_USER` | cPanel username (shared) |
| `KRYSTAL_SSH_KEY` | SSH private key from step 3 (shared, full contents) |
| `KRYSTAL_SSH_PORT` | SSH port, if not 22 (shared) |
| `KRYSTAL_PROD_REPO_ROOT` | Repository path for the production app |
| `KRYSTAL_DEV_REPO_ROOT` | Repository path for the dev app |

The workflow tags its two deploy jobs with GitHub Environments
(`production` and `dev`) — these are created automatically on first run.
Optionally add required-reviewer protection to the `production`
environment later (Repo Settings > Environments) to gate production
deploys behind manual approval.

## 5. First deploy

Push to `dev` first to shake out issues against the lower-stakes
environment, then to `main`. If an SSH step fails on the `uapi` call,
SSH in manually and run the same command to see the real error — cPanel
version differences are the most likely culprit.
