# slothprep

Interview practice studio built on career-ops. One person practising alone:
stories, a prep page per company, timed coding drills with hidden tests, and
mock interviews (typed first, then voice), each scored, with the next session
aimed at what was weakest. Design: `docs/superpowers/specs/2026-11-04-slothprep-design.md`.

## Repo
- Turborepo + pnpm. `apps/web` (TanStack Start), `packages/core` (Zod + pure logic and file readers).
- Internal packages export TS source directly (no build step). Import via subpaths: `@slothprep/core/career-ops`.
- Single `.env` at repo root; `apps/web/vite.config.ts` loads it. `CAREER_OPS_DIR` points at a career-ops checkout.

## career-ops is the engine, not a dependency we own
- Read career-ops' **plain files**; they are its source of truth (its `ARCHITECTURE.md`). Only rely on paths listed in its `DATA_CONTRACT.md` user layer (e.g. `interview-prep/story-bank.md`, `interview-prep/sessions/*.md`, `reports/*`, `data/applications.md`).
- Write directly only into `interview-prep/` (career-ops' user layer) and slothprep's own state. Anything that changes the tracker, reports or pipeline goes through career-ops' own scripts — never edit those files directly.
- Never fork, vendor or modify career-ops. Never use its name or logo as our product name (its `TRADEMARK.md`); "built on career-ops" is fine.
- Respect career-ops' `modes/_custom.md` house rules when the app acts for the user. The app has **no** submit/apply action anywhere and never sets an application status to `Applied`.

## Privacy (this repo is public)
- No real personal data in the repo: no CV text, stories, sessions, company prep, names, employers or numbers from a real career-ops. Tests and e2e use `fixtures/career-ops/`, which is fictional.
- The user's data never leaves their machine except through Claude Code itself. No analytics, no third-party APIs with user content unless an item explicitly adds one and says so.
- Never log file contents from `CAREER_OPS_DIR` in CI output or error messages shown to others.

## Conventions
- Zod schemas in `packages/core` are the source of truth for every file format we parse or write.
- **Code measures, Claude judges.** Timers, word counts, filler words, test pass rates and quote checks are computed in code and handed to the model, which must not recompute them.
- Interviewer and grader are separate Claude calls. Grader output is schema-validated JSON; every quote it cites must appear in the transcript or it is dropped.
- Claude runs through the user's Claude Code (`claude -p` / a long-running process), not an API key.
- Mobile works, desktop first: practice happens at a laptop. Tap targets ≥ 44px.
- Route search params are validated with Zod using `.catch()`.
- Server-only modules are dynamically imported inside server fns so they stay out of the client bundle.

## Commands
`pnpm dev` (port 3100) · `pnpm typecheck` · `pnpm test` · `pnpm check:fix` · `just e2e`
Server functions use `createServerFn().validator(zodSchema).handler(...)` in this TanStack Start version.

**Read the sweap playbook's Run core (its first section, down to the
`run-core:end` marker) before any feature work:** the hard rules, the per-item
loop, the merge path and how to resume. The rest of the playbook is reference —
read a section when its situation arrives. Specs live in
`docs/superpowers/specs/`, plans in `docs/superpowers/plans/`. Backlog:
`ROADMAP.md` (index) + `roadmap/` (one file per item).

## sweap config (read by pipeline commands — override only what differs)
```
verify.typecheck: just typecheck
verify.lint:      just lint
verify.e2e:       just ci-local            # what CI runs as the authoritative merge gate: the FULL suite (unit+integration+e2e). Locally, run only the part your change touches.
backlog.file:     ROADMAP.md
backlog.dir:      roadmap/                  # one file per item — see playbook "Backlog format"
backlog.prefix:   F                        # one or more comma-separated prefixes, e.g. `F` or `F, DS`
# services.up:    just services-up          # uncomment only if you have local test services
test.url:         http://localhost:3100     # /walkthrough only — where the acceptance pass opens the app; never production
# test.seed:      just seed-test            # /walkthrough only — the ONE command allowed to create test data
audit.lenses:     default
audit.baseline:   []
review.dimensions: security, ui, migration
review.focus:     No real personal data in the repo (fixtures/career-ops is fictional); no writes to career-ops outside interview-prep/ (tracker/reports/pipeline only via career-ops scripts); no submit/apply action and never status Applied; no file contents from CAREER_OPS_DIR in logs or errors; server-only code dynamically imported inside createServerFn; every file format has a Zod schema in packages/core; grader quotes must be verified against the transcript; counts/timers computed in code, not by the model.
# ui.contract:    docs/ui/surface-contract.md  # uncomment for UI-heavy projects — see ui-design skill §2
notify:           push
turns.default:    160
```

## Standing preferences — treat as already answered, do not re-ask
- Always work in an isolated worktree/branch; never implement on `main`.
- Finishing a branch: open a PR by default. Never discard work autonomously.
- Merging an unblocked PR whose gate is green is pre-authorized — do not ask.
  Never pass `--admin`/`--repo`/`-R`; never disable or weaken the gate.
- Plan execution: `/sweap:run` (the script holds the loop; continuous, no check-ins).
- TDD, no exceptions in product code. The implementer's report MUST include TDD
  Evidence: the RED (failing) output and the GREEN (passing) output, pasted.
  Never modify a test to make it pass; never skip/quarantine silently.
- Do not rationalize skipping a code review ("nothing to review", "trivial
  adapter"). Every task gets its fresh-context review.
- When blocked or ambiguous in an unattended run: escalate, don't guess —
  record the question in the item file's `blocked:` key (status: blocked),
  notify, move to the next item. NEVER create a `status: attended` item or
  transition one into it — hand-offs are the human's own planned work, authored
  only in `/roadmap`. Relabelling stuck work as human work is forbidden (and
  mechanically checked by the audit gate).
- Honor each backlog item's `review-dimensions` tags.
- Only when the human is answering in this conversation (never in an
  unattended run): a decision question gives options as what a user would see
  and ends with the **explain** line; see the `explain` skill.
- At the end of an autonomous run: notify with merged-PRs + blocked-items +
  open-hand-offs (`status: attended`) summary.
