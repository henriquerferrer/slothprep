# Recipe NAMES are the sweap/CI contract (lint, typecheck, test, e2e,
# ci-local, ci-replay, merge, merge-status). Keep them stable.
# No local services: the app reads plain files, so there is no services-up.

set shell := ["bash", "-euc"]

default: lint typecheck

lint:
    pnpm check

typecheck:
    pnpm typecheck

# Unit + integration tests.
test *args:
    pnpm test {{ args }}

# Builds the app and runs Playwright (mobile + desktop) against the fictional
# career-ops fixture, never a real one.
e2e *args:
    pnpm --filter @slothprep/web e2e {{ args }}

ci-local:
    just lint
    just typecheck
    just test
    just e2e

ci-replay JOB:
    just {{ JOB }}

# Merge a PR through the sweap merge driver (needs the sweap plugin enabled).
merge PR:
    @command -v sweap-merge >/dev/null 2>&1 || { echo "sweap-merge is not on PATH — the sweap plugin is not installed/enabled in this repo. Run: claude plugin update sweap@sweap --scope project, and restart the session."; exit 1; }
    @sweap-merge watch {{ PR }}

merge-status PR="":
    @command -v sweap-merge >/dev/null 2>&1 || { echo "sweap-merge is not on PATH — the sweap plugin is not installed/enabled in this repo. Run: claude plugin update sweap@sweap --scope project, and restart the session."; exit 1; }
    @sweap-merge status {{ PR }}

# Internal — invoked by ci.yml.
_ci-status JOB STATUS:
    bash .github/scripts/ci-status.sh {{ JOB }} {{ STATUS }}

_ci-summary:
    bash .github/scripts/ci-summary.sh
