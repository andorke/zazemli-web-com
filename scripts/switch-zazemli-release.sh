#!/usr/bin/env bash
set -euo pipefail

release="${1:?Каталог релиза}"
active="${2:?Путь активной ссылки}"
[[ -d "$release" && -s "$release/index.html" ]]
if [[ -e "$active" && ! -L "$active" ]]; then
  printf '%s\n' "Активный путь должен быть ссылкой: $active" >&2
  exit 1
fi

# Сохраняем указатель до переключения. Рабочая директория и данные остаются на месте.
dir="$(dirname "$active")"
previous="$active.previous"
temp="$(mktemp -d "$dir/.switch.XXXXXXXX")"
trap 'rm -f "$temp/current" "$temp/previous"; rmdir "$temp"' EXIT
if [[ -L "$active" ]]; then
  ln -s "$(readlink "$active")" "$temp/previous"
  mv -Tf "$temp/previous" "$previous"
fi
ln -s "$release" "$temp/current"
mv -Tf "$temp/current" "$active"
printf 'Активный релиз: %s\n' "$(readlink "$active")"
if [[ -L "$previous" ]]; then
  printf 'Предыдущий релиз: %s\n' "$(readlink "$previous")"
fi
