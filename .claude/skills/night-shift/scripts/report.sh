#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
ns_init "$PWD"
: "${NS_STATE:=$NS_ROOT/.night}"
Q="$NS_STATE/queue.json"; OUT="$NS_STATE/NIGHT_REPORT.md"
D="${NS_NIGHT_DATE:-$(date +%F)}"

OUT_TMP="$(mktemp)"
{
  echo "# Ночной отчёт — $D (ран $(jq -r '.run_id // "—"' "$Q" 2>/dev/null), статус $(jq -r '.state // "—"' "$Q" 2>/dev/null))"
  echo
  echo "| change | статус | эпизоды | MR | заметка |"
  echo "|---|---|---|---|---|"
  jq -r '.items[] | "| \(.change) | \(.status) | \(.episodes_done // 0) | \(if (.mr_url // "") == "" then "—" else "[MR](\(.mr_url))" end) | \((.note // "") | gsub("[|\n]"; " ")) |"' "$Q"
  echo
  echo "## Эскалации / отклонённые находки"
  found=0
  for f in "$NS_STATE"/state/*/PROGRESS.md; do
    [[ -f "$f" ]] || continue
    ch="$(basename "$(dirname "$f")")"
    while IFS= read -r l; do echo "- **$ch**: $l"; found=1; done \
      < <(grep -E '^(ESCALATE|REJECTED):' "$f" 2>/dev/null || true)
  done
  [[ $found -eq 0 ]] && echo "_нет_"
  echo
  echo "## Предупреждения раннера"
  if [[ -s "$NS_STATE/warnings.log" ]]; then sed 's/^/- /' "$NS_STATE/warnings.log"; else echo "_нет_"; fi
  echo
  echo "## Сессии Claude (зайти: claude --resume <id>)"
  found_s=0
  for f in "$NS_STATE/logs/$D"/*/*.json; do
    [[ -f "$f" ]] || continue
    sid="$(jq -r '.session_id // empty' "$f" 2>/dev/null || true)"
    [[ -z "$sid" ]] && continue
    ch="$(basename "$(dirname "$f")")"; nm="$(basename "$f" .json)"
    echo "- $ch / $nm: \`claude --resume $sid\`"; found_s=1
  done
  [[ $found_s -eq 0 ]] && echo "_нет session_id в логах_"
  echo
  echo "## Логи ночи"
  echo "- \`$NS_STATE/logs/$D/runner.log\` — оркестратор (старт/эпизоды/rc/ожидания)"
  echo "- \`$NS_STATE/logs/$D/<change>/ep-NN.json(.err)\` — полный вывод каждого эпизода"
  echo "- \`$NS_STATE/logs/$D/<change>/*.verify.log\` — сборка/линт гейтов"
  echo "- \`$NS_STATE/logs/$D/<change>/review-*.json, fix-*.json\` — ночное ревью и фиксы"
  echo
  echo "## Расход (виртуальный total_cost_usd из JSON-выводов; на подписке денег не жжёт)"
  COST_FILES=()
  for f in "$NS_STATE/logs/$D"/*/ep-*.json; do [[ -f "$f" ]] && COST_FILES+=("$f"); done
  if (( ${#COST_FILES[@]} > 0 )); then
    jq -s '[.[] | select(.total_cost_usd != null) | .total_cost_usd] | add // 0' \
      "${COST_FILES[@]}" 2>/dev/null || echo 0
  else
    echo 0
  fi
} > "$OUT_TMP"
mv "$OUT_TMP" "$OUT"
ns_log "отчёт: $OUT"
