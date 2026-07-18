#!/usr/bin/env bash
#
# Financial Tracker V2 — build & verify pipeline.
# Runs: install -> build packages -> type-check -> lint -> test -> build web.
#
# Usage:
#   ./build.sh          # run everything
#   bash build.sh       # if not executable (e.g. on Windows/Git Bash)
#
set -euo pipefail

cd "$(dirname "$0")"

step() { echo; echo "==> $1"; }
ok()   { echo "$1"; }

# Ensure pnpm is available (project is pinned to pnpm@9.15.4).
if ! command -v pnpm >/dev/null 2>&1; then
  step "pnpm not found — enabling via corepack"
  corepack enable pnpm 2>/dev/null || npm install -g pnpm@9.15.4
fi

step "Installing dependencies"
pnpm install

step "Building shared packages (generates dist/ that the apps import)"
pnpm -r --filter "./packages/*" run build

step "Type-checking all packages and apps"
pnpm -r run type-check

step "Linting"
pnpm -r run lint

step "Running unit tests"
pnpm -r run test

step "Building the web app (production)"
pnpm --filter @financial-tracker/web run build

printf '\n'
ok "Build & verification passed ✅"
