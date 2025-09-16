#!/usr/bin/env bash
set -euo pipefail

# Deploy with Vercel CLI. This script does not perform login if creds are missing.

PROJECT_NAME="danverse-v2"

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install with: npm i -g vercel" >&2
  exit 0
fi

vercel pull --yes --environment=production || true
vercel build || true
vercel deploy --prebuilt || true


