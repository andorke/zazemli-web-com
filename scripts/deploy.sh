#!/usr/bin/env bash
# Этапы выкладки статического экспорта ЗАЗЕМЛИ на VPS.
set -euo pipefail
cd "$(dirname "$0")/.."

case "${1:-}" in
  stage)
    release="${2:-$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)}"
    ;;
  activate)
    release="${2:?Укажи идентификатор подготовленного релиза}"
    ;;
  *)
    printf '%s\n' 'Использование: scripts/deploy.sh stage [release] | activate release' >&2
    exit 2
    ;;
esac

if [[ ! "$release" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$ ]]; then
  printf '%s\n' 'Неверный идентификатор релиза' >&2
  exit 2
fi

if [[ "$1" == stage ]]; then
  if [[ -f .env.production ]]; then
    set -a
    . ./.env.production
    set +a
  fi
  export NEXT_PUBLIC_METRIKA_ID="${NEXT_PUBLIC_METRIKA_ID-114508903}"
  npm run build
  if [[ -n "${NEXT_PUBLIC_METRIKA_ID:-}" ]]; then
    [[ "$NEXT_PUBLIC_METRIKA_ID" =~ ^[1-9][0-9]*$ ]]
    rg -Fq "$NEXT_PUBLIC_METRIKA_ID" out/_next/static
  fi

  if [[ -n "$(find out -type f \( -name '*.py' -o -name '*.sqlite*' -o -name '.env*' -o -name 'start-cjm.html' -o -name 'unsubscribe-*.html' \) -print -quit)" ]]; then
    printf '%s\n' 'В экспорте обнаружены непубличные файлы' >&2
    exit 1
  fi
  ssh zazemli "install -d -m 0755 /var/www/zazemli-releases && mkdir -- /var/www/zazemli-releases/$release"
  rsync -az out/ "zazemli:/var/www/zazemli-releases/$release/"
  ssh zazemli "test -s /var/www/zazemli-releases/$release/index.html && touch /var/www/zazemli-releases/$release/.ready"
  printf 'Кандидат %s загружен\n' "$release"
else
  ssh zazemli "test -f /var/www/zazemli-releases/$release/.ready && nginx -t && bash -s -- /var/www/zazemli-releases/$release /var/www/zazemli-current" < scripts/switch-zazemli-release.sh
fi
