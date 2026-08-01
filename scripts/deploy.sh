#!/usr/bin/env bash
# Деплой статики на VPS Рег.облака (ssh-хост `zazemli` из ~/.ssh/config).
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
rsync -az --delete out/ zazemli:/var/www/zazemli/

# IndexNow-пинг Яндекса: ускоряет переобход после публикации (Google протокол
# не поддерживает — ему хватает sitemap). Ключ публичный, лежит в public/<key>.txt.
# Фейл пинга деплой не роняет.
INDEXNOW_KEY="29ebd8867fd547e41d2648eb988c44b2"
urls=$(grep -o '<loc>[^<]*</loc>' out/sitemap.xml | sed 's/<[^>]*>//g' \
  | python3 -c 'import json,sys; print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))')
curl -sS -m 20 -X POST "https://yandex.com/indexnow" \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{\"host\":\"zazemli.com\",\"key\":\"$INDEXNOW_KEY\",\"urlList\":$urls}" \
  && echo " IndexNow: ok" || echo "IndexNow ping failed (не критично)"

echo "Deployed: http://zazemli.com/ (195.19.12.196)"
