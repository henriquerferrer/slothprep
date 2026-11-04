# ROADMAP (index)

Direction-level view only. **Backlog items live one file each under
`roadmap/`** (`roadmap/<ID>.md`, e.g. `roadmap/F1.1.md`) — see the sweap
playbook's **Backlog format** section for the item schema (frontmatter:
`id`, `title`, `status`, `depends_on`, `review-dimensions`, optional `followup_of` /
`harm` / `premise` / `blocked` / `handoff`; body: `## Spec` +
`## Acceptance` — or `## Hand-off` for a `status: attended` item, a
planned human hand-off that is never dispatched to an agent). Status truth is
the item files; this index never carries per-item status. Dropped items move to
`roadmap/archive/`.

## Milestones (priority order)

(none specced yet — run `/sweap:roadmap F1`)

## Later milestones (sketch, not yet specced)

- F1 — Foundations and reading views: career-ops file readers (stories, sessions, prep files, reports), Today, Stories, Companies, History; story editing. Design: `docs/superpowers/specs/2026-11-04-slothprep-design.md`.
- F2 — Drill runner (levels, hidden tests, timer, snapshots, review) and FSRS scheduler for drills and problems.
- F3 — Mock room (typed): interviewer + separate grader, live counters, scorecard with verified quotes, re-drill queue, transcript import, grader evals.
- F4 — Local voice: VAD, local speech-to-text, local text-to-speech, long-running Claude process.
- F5 — Presentation rehearsal, step-gated system design, AI-assisted coding drill.
