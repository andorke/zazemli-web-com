#!/usr/bin/env bash
# Деплой статики на VPS Рег.облака (ssh-хост `zazemli` из ~/.ssh/config).
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
rsync -az --delete out/ zazemli:/var/www/zazemli/

echo "Deployed: http://zazemli.com/ (195.19.12.196)"
