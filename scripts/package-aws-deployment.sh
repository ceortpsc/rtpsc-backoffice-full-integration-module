#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
ZIP_PATH="$DIST_DIR/rtpsc-backoffice-deployment.zip"

mkdir -p "$DIST_DIR"
rm -f "$ZIP_PATH"

if ! command -v zip >/dev/null 2>&1; then
  echo "[PACKAGE_AWS] zip command is required." >&2
  exit 1
fi

cd "$ROOT_DIR"
zip -r "$ZIP_PATH" \
  assets app cloudflare config docs lib scripts \
  advanced-presentation.html billing-dashboard.html forms-cabinet.html letterhead.html report-engine.html rosssign-pad.html system-health-report.html \
  server.js self-healing-worker.js vantage_db_driver.js package.json amplify.yml next.config.js wrangler.toml \
  -x "*.env" \
  -x ".env" \
  -x ".git/*" \
  -x "node_modules/*" \
  -x "dist/*" \
  -x "authorized_8821_vault/*" \
  -x "*.pdf" \
  -x "*.xlsx" \
  -x "*.csv" \
  -x "*.zip"

echo "[PACKAGE_AWS] Wrote $ZIP_PATH"
