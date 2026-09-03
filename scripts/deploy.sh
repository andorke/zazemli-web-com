#!/usr/bin/env bash
# Деплой статики на VPS Рег.облака (ssh-хост `zazemli` из ~/.ssh/config).
set -euo pipefail
cd "$(dirname "$0")/.."

# Публичные переменные Next инлайнятся В МОМЕНТ СБОРКИ. Деплой идёт с машины
# разработчика, и без этого файла `process.env.NEXT_PUBLIC_*` уезжает в бандл
# необработанным обращением — счётчик Метрики тогда не грузится вообще, молча.
# Файл не в git (.gitignore: .env*), значения берутся у владельца.
if [ -f .env.production ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env.production
  set +a
  echo "→ env сборки: .env.production подхвачен"
else
  echo "→ .env.production нет: Метрика и эндпоинт формы останутся выключенными"
fi

npm run build

# Сборка молча уносит незаданные переменные в бандл как есть — проверяем итог,
# а не намерение: если ID задан, он должен оказаться в статике.
if [ -n "${NEXT_PUBLIC_METRIKA_ID:-}" ]; then
  if grep -rq "$NEXT_PUBLIC_METRIKA_ID" out/_next/static 2>/dev/null; then
    echo "✓ Метрика: ID $NEXT_PUBLIC_METRIKA_ID в сборке"
  else
    echo "✗ Метрика: ID задан, но в сборку не попал — деплой остановлен" >&2
    exit 1
  fi
fi
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
