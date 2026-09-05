#!/usr/bin/env bash
set -euo pipefail

# GitHub Pages serves the browser application while API requests continue to
# use the deployed Cloudflare worker. Route handlers therefore must not be
# included in Next.js' static export.
api_dir="app/api"
holding_dir="$(mktemp -d)/api"

restore_api() {
  if [[ -d "$holding_dir" ]]; then
    mkdir -p app
    mv "$holding_dir" "$api_dir"
  fi
}

trap restore_api EXIT HUP INT TERM

if [[ -d "$api_dir" ]]; then
  mv "$api_dir" "$holding_dir"
fi

npx next build
