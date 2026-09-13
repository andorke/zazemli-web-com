#!/usr/bin/env bash
# Обновляет только экспериментальную витрину, не основной сайт.
set -euo pipefail
cd "$(dirname "$0")/.."
concept_source="${1:?Укажите content/ локального прототипа}"
concept_release="$(date -u +%Y%m%dT%H%M%SZ)"
concept_build="$(mktemp -d "${TMPDIR:-/tmp}/zazemli-concepts.XXXXXX")"
trap 'rm -rf "$concept_build"' EXIT
python3 scripts/package-concepts.py "$concept_source" "$concept_build/rubinovoe-more"
ssh -o BatchMode=yes zazemli "test ! -e /var/www/zazemli-experiments/releases/$concept_release && mkdir -p /var/www/zazemli-experiments/releases/$concept_release"
rsync -rlptz --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r "$concept_build/rubinovoe-more/" "zazemli:/var/www/zazemli-experiments/releases/$concept_release/"
ssh -o BatchMode=yes zazemli bash -s -- "$concept_release" <<'REMOTE'
set -euo pipefail
release="$1"
cd /var/www/zazemli-experiments
if [ -e rubinovoe-more ] && [ ! -L rubinovoe-more ]; then
    echo 'rubinovoe-more уже существует и не является ссылкой; оставлен без изменений' >&2
    exit 1
fi
ln -s "releases/$release" "rubinovoe-more.$release"
mv -Tf "rubinovoe-more.$release" rubinovoe-more
printf 'Релиз концептов: %s\n' "$release"
REMOTE
printf 'Опубликовано: https://zazemli.com/rubinovoe-more/\n'
