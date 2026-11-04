#!/usr/bin/env bash
# Emits the per-job JSON status block (sweap/agentic-ci convention, see
# CLAUDE.md "CI") to stdout; ci.yml appends it to $GITHUB_STEP_SUMMARY.
# Usage: ci-status.sh <job> <success|failure|cancelled>
set -euo pipefail

job="${1:?job name}"
status="${2:?status}"

case "$job:$status" in
  *:success)   next="none" ;;
  *:cancelled) next="re-run the workflow; the job was cancelled before finishing" ;;
  lint:*)      next="run 'pnpm check:fix' locally, then 'just lint' and commit the result" ;;
  typecheck:*) next="run 'just typecheck' locally and fix the reported TS errors" ;;
  test:*)      next="run 'just test' locally; failing vitest output is in this job's log" ;;
  e2e:*)       next="run 'just services-up && just e2e' locally; download the e2e-report artifact for traces" ;;
  *)           next="run 'just ci-replay $job' locally" ;;
esac

# Optional: a step may export CI_ANNOTATIONS as a JSON array of
# {file, line, level, message}; defaults to empty.
annotations="${CI_ANNOTATIONS:-[]}"

printf '\n```json\n'
jq -n \
  --arg job "$job" --arg status "$status" --arg next "$next" \
  --argjson annotations "$annotations" \
  '{job: $job, status: $status, annotations: $annotations,
    repro: ("just ci-replay " + $job), next_action: $next}'
printf '```\n'
