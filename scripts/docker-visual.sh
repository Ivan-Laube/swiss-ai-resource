#!/usr/bin/env bash
# Regenerate or run R50 visual snapshots on Linux (Playwright Docker image).
# Usage from repo root (Docker Desktop / Linux):
#   bash scripts/docker-visual.sh              # compare
#   bash scripts/docker-visual.sh --update     # write baselines
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="mcr.microsoft.com/playwright:v1.63.0-jammy"
UPDATE=0
if [[ "${1:-}" == "--update" ]]; then
  UPDATE=1
fi

docker run --rm --ipc=host \
  -v "${ROOT}:/work" \
  -v swiss-ai-nm:/work/node_modules \
  -w /work \
  -e CI=1 \
  "$IMAGE" \
  bash -lc "
    set -euo pipefail
    if [[ ! -x node_modules/.bin/playwright ]]; then
      npm ci
    fi
    if [[ ! -d out-e2e ]]; then
      npm run build:e2e
    fi
    if [[ '$UPDATE' == '1' ]]; then
      npx playwright test e2e/visual --update-snapshots
    else
      npx playwright test e2e/visual
    fi
  "
