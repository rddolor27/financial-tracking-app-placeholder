#!/usr/bin/env bash
#
# Financial Tracker V2 — run everything (dev servers).
# Starts the API, the web app, and the Expo mobile bundler together.
# Press Ctrl+C once to stop all of them.
#
#   API    -> http://localhost:3000/api   (NestJS; needs Postgres — `docker-compose up`)
#   Web    -> http://localhost:3001        (Next.js; talks to the API on 3000)
#   Mobile -> Expo dev server (scan the QR with Expo Go)
#
# Usage:
#   ./run.sh
#   bash run.sh
#
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable pnpm 2>/dev/null || npm install -g pnpm@9.15.4
fi

pids=()
cleanup() {
  echo
  echo "Stopping all dev servers..."
  for pid in "${pids[@]}"; do kill "$pid" 2>/dev/null || true; done
}
trap cleanup EXIT INT TERM

echo "==> Starting API on http://localhost:3000/api"
pnpm --filter @financial-tracker/api start:dev &
pids+=($!)

# Web dev server runs on 3001 so it doesn't collide with the API on 3000.
echo "==> Starting Web on http://localhost:3001"
PORT=3001 pnpm --filter @financial-tracker/web dev &
pids+=($!)

echo "==> Starting Mobile (Expo)"
pnpm --filter @financial-tracker/mobile start &
pids+=($!)

# Wait for any process; keep running until Ctrl+C.
wait
