#!/usr/bin/env bash
# Builds release/ and ships it to the company server, then restarts the app and checks health.
# Run from your laptop (Linux x64, same arch as the server):  scripts/deploy.sh
#
# Server side (no sudo, user mohamed, set up once by speakerreg-user-setup.sh, see docs/DEPLOY.md):
#   ~/apps/speakerreg/app/            this release
#   ~/apps/speakerreg/ctl.sh          start | stop | restart | status | logs  (runs migrations, then server.js)
#   ~/apps/speakerreg/speakerreg.env  DATABASE_URL, IP_HASH_SALT, ...  (never in git)
# The app listens on 127.0.0.1:4195; Caddy proxies https://global.expertslive.sa/speakerreg* to it.
set -Eeuo pipefail

DEPLOY_HOST="${DEPLOY_HOST:-mohamed@37.221.197.80}"
# Relative to the remote user's home directory
DEPLOY_DIR="${DEPLOY_DIR:-apps/speakerreg/app/}"
CTL="${CTL:-~/apps/speakerreg/ctl.sh}"
PORT="${PORT:-4195}"
BASE_PATH="${RELEASE_BASE_PATH:-/speakerreg}"

trap 'echo -e "\n\033[1;31mDEPLOY FAILED\033[0m at line $LINENO: $BASH_COMMAND" >&2' ERR

cd "$(dirname "$0")/.."

for cmd in pnpm rsync ssh; do
  command -v "$cmd" >/dev/null || { echo "missing command: $cmd" >&2; exit 1; }
done

if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  echo "warning: uncommitted changes; they will be deployed (release.json marks the commit as -dirty)" >&2
fi

echo "==> building release/"
pnpm release

echo "==> uploading to $DEPLOY_HOST:$DEPLOY_DIR"
rsync -az --delete --exclude '.next/cache' release/ "$DEPLOY_HOST:$DEPLOY_DIR"

echo "==> restarting and checking health"
# shellcheck disable=SC2029 # expanded locally on purpose; ~ is expanded by the remote shell
ssh "$DEPLOY_HOST" "$CTL restart && sleep 3 && curl -fsS http://127.0.0.1:$PORT$BASE_PATH/api/health"
echo

echo -e "\033[1;32mdeployed\033[0m $(grep -o '"commit": "[^"]*"' release/release.json) → https://global.expertslive.sa$BASE_PATH"
