#!/usr/bin/env bash
# Run-level aggregate of every job's result, as one JSON block.
# Needs GH_TOKEN with actions:read (set in ci.yml's ci-status job).
set -euo pipefail

: "${GITHUB_REPOSITORY:?}" "${GITHUB_RUN_ID:?}"

jobs_json="$(gh api "repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID/jobs" \
  --jq '[.jobs[] | select(.name != "ci-status")
         | {job: .name, status: (.conclusion // .status)}]' 2>/dev/null || echo '[]')"

printf '\n```json\n'
jq -n --argjson jobs "$jobs_json" --arg run "$GITHUB_RUN_ID" '{
  run_id: $run,
  status: (if ($jobs | length) == 0 then "unknown"
           elif any($jobs[]; .status == "failure" or .status == "cancelled") then "failure"
           else "success" end),
  jobs: $jobs,
  failed: [$jobs[] | select(.status == "failure" or .status == "cancelled") | .job],
  repro: "just ci-local"
}'
printf '```\n'
