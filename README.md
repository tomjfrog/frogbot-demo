# Frogbot demo

[![Scanned by Frogbot](https://raw.github.com/jfrog/frogbot/master/images/frogbot-badge.svg)](https://jfrog.com/help/r/jfrog-security-user-guide/shift-left-on-security/frogbot)

Small **Node.js / Express** sample used to **demonstrate [JFrog Frogbot](https://docs.jfrog.com/security/docs/frogbot)** in a pre-sales or learning context. The application itself is minimal (`server.js`, `primes.js`, Jasmine specs); the interesting part for demos is how **dependencies and CI** surface in Frogbot (SCA on `package.json`, PR comments, optional repository scans and autofix PRs).

**What this repo is meant to show**

- **Pull request scanning** — Frogbot comments on opened/updated PRs when issues are introduced or changed.
- **Repository scanning** — On a schedule and via **Actions → Run workflow** (`workflow_dispatch`), with the option to open **fix PRs** against configured branches (default: `main`).
- **Intentional SCA surface** — Older or problematic dependencies (for example `express` pinned to an older line, deprecated `request`, the `fs` placeholder package, duplicate `pack-zip`) so scans produce teachable results. A lockfile and stricter install commands (for example `npm ci`) can be added for a more deterministic scan story.

Some Frogbot features (SAST depth, secrets, IaC, CVE contextual analysis, license policy) depend on **platform entitlements and Xray version**; align expectations with your tenant before promising a given narrative.

---

## Configuration structure

| Piece | Role |
|--------|------|
| [`.github/workflows/frogbot-scan-pull-request.yml`](.github/workflows/frogbot-scan-pull-request.yml) | Runs on `pull_request_target` (opened, synchronize). Checks out the PR head, installs Node, runs `jfrog/frogbot@v2` for **scan-pull-request**. Uses optional GitHub **Environment** `frogbot` as an approval gate. |
| [`.github/workflows/frogbot-scan-repository.yml`](.github/workflows/frogbot-scan-repository.yml) | **Scheduled** (daily UTC) and **`workflow_dispatch`** full-repo scan; can create **autofix PRs** against the matrix branch (`main`). |
| [`.github/workflows/build.yml`](.github/workflows/build.yml) | Legacy-style build workflow (JFrog CLI / npm publish pattern). Separate from Frogbot; useful only if you still want that pipeline in the demo. |
| **`.frogbot/frogbot-config.yml`** *(optional, not in this repo yet)* | Repo-local Frogbot settings: branches, projects/working dirs, watches, JFrog project key, aggregate fixes, severity thresholds, per-project install commands, and more. See [config file docs](https://docs.jfrog.com/security/docs/the-frogbot-config-yml-file-structure). |

**GitHub Actions vs `frogbot-config.yml`**

- The **workflow YAML** is CI glue: when Frogbot runs, GitHub permissions, OIDC or token auth, and **environment variables** passed into the action (`JF_URL`, `JF_GIT_TOKEN`, `JF_INSTALL_DEPS_CMD`, `JF_GIT_BASE_BRANCH`, optional `JF_DEPS_REPO`, and others).
- **`frogbot-config.yml`** is Frogbot’s own configuration in the repository. It describes **scan behavior** (what to scan, how to fail, autofix aggregation, platform alignment). Many of the same knobs can be set only via env vars in the workflow; if the file is absent, Frogbot falls back to that env-based configuration. Using **both** is common: workflows for secrets and auth, config file for structured multi-project or branch-specific scan policy.

**Centralized Git repository configuration (large enterprises)**

For many repositories, teams often prefer **one place in the JFrog Platform** to define Frogbot-related scan settings (branches, projects, policies, and related options) instead of copying `.frogbot/frogbot-config.yml` into every repo. That **centralized Git repository configuration** story scales governance and reduces config drift across the estate. This demo’s workflows set **`JF_USE_CONFIG_PROFILE: "true"`** so Frogbot can apply a **config profile** from Xray when your platform has Git repositories indexed and a profile configured for this project. Repo-local `frogbot-config.yml` still works for smaller setups or overrides; see the [Frogbot documentation](https://docs.jfrog.com/security/docs/frogbot) for how centralized and per-repo configuration interact on your Xray version.

---

## Setup (GitHub + JFrog)

1. **JFrog** — [OpenID Connect integration](https://docs.jfrog.com/security/docs/github-actions#openid-connect-authentication) with a **Provider Name** and identity mapping for this repository (or organization), plus a supported **Xray** version.
2. **GitHub repository variables** (example names used in the workflows):
   - `JF_URL` — JFrog platform base URL  
   - `JF_OIDC_PROVIDER_NAME` — must match the OIDC **Provider Name** in JFrog  
   - `JF_OIDC_AUDIENCE` — optional; set if your identity mapping expects a custom audience  
3. **GitHub Environment** — Create an environment named `frogbot` if you want the optional **manual approval** gate before PR scans run; remove the `environment:` key from the PR workflow if you prefer every PR to scan without that step.
4. **Allow Actions to open PRs** — In the repo’s **Settings → Actions → General**, enable workflows to create pull requests if you want autofix PRs from the repository scan.

For token-based setup instead of OIDC, see the [official GitHub Actions guide](https://docs.jfrog.com/security/docs/github-actions) and the comments in each workflow file.

---

## Documentation

- [Frogbot — JFrog Docs](https://docs.jfrog.com/security/docs/frogbot)  
- [The `frogbot-config.yml` file structure](https://docs.jfrog.com/security/docs/the-frogbot-config-yml-file-structure)  
- [Frogbot + GitHub Actions](https://docs.jfrog.com/security/docs/github-actions)  
- [jfrog/frogbot on GitHub](https://github.com/jfrog/frogbot) (README and upstream workflow templates)  
- [Frogbot — JFrog Security user guide](https://jfrog.com/help/r/jfrog-security-user-guide/shift-left-on-security/frogbot)  

---

## Suggested demo flow

1. Open a PR that touches `package.json` or dependencies — observe **Frogbot** on the PR after the scan job completes.  
2. Run **Actions → Frogbot Scan Repository → Run workflow** — show a full-branch scan and any **fix PR** Frogbot opens.  
3. (Optional) Add `.frogbot/frogbot-config.yml` to show **branch lists**, **`aggregateFixes`**, or **watches** without cluttering the workflow file.
