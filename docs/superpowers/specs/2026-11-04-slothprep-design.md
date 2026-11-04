# slothprep — design

Date: 2026-11-04. Status: agreed direction; milestones are specced item by item
under `roadmap/`.

## Goal

A local app where one engineer practises for the specific interviews they have
coming up, on top of the files career-ops already keeps. Each practice session
is measured, scored and turned into the next thing to practise.

## Users and constraints

- One user, on their own Mac, practising alone. Desktop first; usable on a phone.
- Data lives in the user's career-ops folder. The repo is public and holds no
  personal data (fictional fixtures only).
- Claude runs through the user's own Claude Code, not an API key.
- The app never applies to jobs, never submits forms, never changes an
  application's status to Applied.

## Non-goals (for now)

- Job discovery, evaluation, CV tailoring and application tracking: career-ops
  does these. slothprep may *show* tracker and report data read-only.
- Help during a real interview. Practice only.
- Multi-user, accounts, cloud sync.

## What career-ops already provides (reuse, don't rebuild)

- `modes/interview/practice.md` and `debrief.md`: interviewer behaviour, one
  question at a time, per-answer feedback (what landed / what to sharpen /
  stronger version / ✅🟡🔴), session summary.
- `modes/interview-prep.md`: per-company prep file
  `interview-prep/{company}-{role}.md`.
- `templates/story-bank.template.md`: STAR+R story block format with
  provenance; `interview-prep/story-bank.md` is user layer.
- `interview-prep/sessions/{company}-{role}-{round}-{date}.md`: session file
  with front matter and `## Q1` blocks.
- Scripts: `match-star.mjs` (best story for a question),
  `story-provenance-check.mjs` (story figures vs the CV), `weekly-digest.mjs`.
- Reports `reports/NNN-*.md` with an "F) Interview Plan" section.

Gaps slothprep fills: a UI; timers; drill and problem tracking with spaced
repetition; per-answer scores stored as data; readiness measured, not guessed;
links between a company's report, prep file, exercises and sessions.

## Sections

1. **Today** — due drills and re-drills, upcoming interviews, readiness
   criteria with their measured state.
2. **Stories** — story bank with a competency × story coverage grid, five short
   anchors per story, scripted first/last line, a "Do not claim" field, and
   rehearsal modes (recall → compress → reframe → cold → hostile).
3. **Companies** — per role: process, topics sorted into go deep / gap / will be
   probed / nice to have, likely questions each with what it tests, strong and
   weak anchors and a follow-up ladder; links to the report and sessions.
4. **Mock room** — interviewer stays in character, one question at a time;
   live counters (answer time vs 2:00, filler words, I vs we, hedges, names on
   the user's confidentiality list); typed first, voice later.
5. **Scorecard / History** — hire / no-hire at target level with confidence,
   per-answer status and first gap, every quote verified against the
   transcript, rubric version snapshot, re-drill = a new question on the weakest
   dimension; trends per dimension over time.
6. **Drills** — multi-level coding tasks (one codebase extended per level),
   hidden tests as data (`simulate(commands)`), level gating, timer per level,
   code snapshots per level, post-session review against a fixed rubric that
   quotes line ranges and never rewrites code.
7. Later: presentation rehearsal (reading-the-slide detection, pace, numbers
   spoken vs on slides, interrupting panel), step-gated system design with a
   diagram read as text, AI-assisted coding drill graded on how the AI is used.

## Architecture

- `apps/web` — TanStack Start. Server functions read and write files and run
  Claude Code; the client never touches the filesystem.
- `packages/core` — Zod schemas for every file format, parsers/serialisers for
  career-ops files, pure scoring and scheduling logic. No framework imports.
- Claude Code: interviewer and grader are separate invocations; grader returns
  schema-validated JSON. Start with `claude -p --output-format json`; move to a
  long-running process (`--input-format stream-json`) when latency matters.
- Scheduling: FSRS (`ts-fsrs`). Ratings derived from objective results
  (passed in time = Easy … two levels failed = Again), lowered by one when the
  review's weakest dimension is poor.
- Drill runner: Python solutions run as `python -I` subprocesses with per-case
  timeouts; tests are JSON command rows; hidden tests live outside the work dir;
  expected outputs generated from a reference solution.
- Evals: `evals/` holds fixed fictional transcripts with known grades; the
  grader is re-run against them whenever prompts change.

## Where state lives

- In career-ops (`$CAREER_OPS_DIR/interview-prep/`): `story-bank.md`,
  `question-bank.md`, `{company}-{role}.md`, `sessions/*.md`, plus slothprep's
  sidecars `sessions/*.score.json` and `progress.json` (drill/problem FSRS
  state). These are user-layer paths career-ops updates never touch.
- In slothprep (gitignored, local): drill work dirs and attempt snapshots.

## Voice (staged)

1. Claude Code `/voice` dictation plus macOS `say` — no build.
2. Local: Silero VAD, MLX Whisper in, Kokoro (or `say`) out, one long-running
   Claude process; target under 4 s per turn.
3. Optional: OpenAI Realtime API only if local latency is unacceptable (separate
   billing, data goes to OpenAI).
- External voice apps (ChatGPT voice, Claude app voice) are supported as a side
  door: slothprep writes a trimmed briefing to paste, and a "score a transcript"
  box grades the pasted result. Transcripts from those apps are not verbatim,
  so only content is scored.
- Browser speech recognition is not used (Chrome sends audio to Google; Safari
  is unreliable over long sessions).

## Desktop shell (later)

Keep logic in `packages/core` and server functions thin, so the app can later
run inside a Tauri shell (Node sidecar) or Electron if a desktop app is wanted.
No Rust now.

## Milestones (sketch)

- F1 — Foundations + reading views: career-ops readers, Today, Stories, Companies, History (read-only + story editing).
- F2 — Drill runner + scheduler.
- F3 — Mock room (typed) + grader + scorecard + evals + transcript import.
- F4 — Local voice.
- F5 — Presentation, system design, AI-assisted coding modes.

## Prior art

Ideas borrowed (no code copied): presentation-coach (code measures, agent
judges), mockingbird (quote verification), Crucible (question anchors and
follow-up ladder), superinterview-skill (first gap only, variant re-drill),
story-bank and behavior-question-skill (anchors, do-not-claim, competency
index), OpenJob (job-post × CV topic sorting), OfferLoop (rubric snapshot),
CodeSignal practice framework (tests as command rows), py-fsrs/leetsolv
(scheduling), Hello Interview (hire call with confidence, timestamped replay,
step-gated design), Google Interview Warmup (talking-point tags),
PowerPoint Speaker Coach (reading-the-slide detection).
