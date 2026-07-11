#!/usr/bin/env bash
# Ревью-фикс петля (§8.3): ревьюер и фиксер — разные свежие процессы.
# Скоринг/порог — по образцу официального плагина code-review (anthropics/claude-code).
# Использование: NS_WT=<wt> NS_STATE=<.night> review-loop.sh <change> <base_sha>
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

CHANGE="$1"; BASE_SHA="$2"
: "${NS_WT:?}"; : "${NS_STATE:?}"
ns_init "$NS_WT"

SDIR="$NS_STATE/state/$CHANGE"; LDIR="$NS_STATE/logs/${NS_NIGHT_DATE:-$(date +%F)}/$CHANGE"
mkdir -p "$SDIR" "$LDIR"
REVIEW="$SDIR/REVIEW.md"; PROGRESS="$SDIR/PROGRESS.md"
CLAUDE_BIN="$(ns_cfg '.claude_bin' 'claude')"
R_MODEL="$(ns_cfg '.models.review')"; F_MODEL="$(ns_cfg '.models.fix')"
CYCLES="$(ns_cfg '.review_fix_cycles' 2)"
TIMEOUT_MIN="$(ns_cfg '.episode_timeout_min' 60)"
export NS_GATE_LOG="$LDIR/review.verify.log"

run_claude() { # $1=prompt-file $2=model $3=log-suffix
  ns_guard_subscription
  TSECS=$(( TIMEOUT_MIN * 60 ))
  if [[ -n "${NS_DEADLINE_EPOCH:-}" ]]; then
    REM=$(( NS_DEADLINE_EPOCH - $(date +%s) ))
    (( REM < TSECS )) && TSECS=$REM
    (( TSECS < 60 )) && TSECS=60
  fi
  ( cd "$NS_WT" && ns_timeout "$TSECS" \
      "$CLAUDE_BIN" -p "$(cat "$1")" --model "$2" \
      --dangerously-skip-permissions --output-format json ) \
      > "$LDIR/$3.json" 2> "$LDIR/$3.err"
}

do_review() { # $1=cycle_no ; результат: файл REVIEW
  local pf; pf="$(mktemp)"
  ns_render "$NS_SKILL_DIR/prompts/review.md" "$pf" \
    CHANGE="$CHANGE" BASE_SHA="$BASE_SHA" REVIEW_PATH="$REVIEW"
  rm -f "$REVIEW"
  run_claude "$pf" "$R_MODEL" "review-$1" || true
  [[ -f "$REVIEW" ]] || { ns_log "review crashed/не создал файл"; return 1; }
  # Валидация формата (fail-closed), построчно: каждая непустая строка — заголовок,
  # находка или CLEAN; плюс файл обязан содержать хотя бы CLEAN или одну находку.
  if ! awk 'NF==0{next} /^# REVIEW /{next} /^\- SCORE=[0-9]+ /{next} /^CLEAN$/{next} {exit 1}' "$REVIEW" \
     || ! grep -qE '^(CLEAN$|\- SCORE=[0-9]+ )' "$REVIEW"; then
    ns_log "review не по формату"; return 1
  fi
}

blockers() { grep -cE '^\- SCORE=(8[0-9]|9[0-9]|100) ' "$REVIEW" 2>/dev/null || true; }

do_review 0 || { echo "REVIEW FAILED" > "$REVIEW"; exit 31; }
[[ "$(blockers)" -eq 0 ]] && exit 30

for (( c=1; c<=CYCLES; c++ )); do
  pre_sha="$(git -C "$NS_WT" rev-parse HEAD)"
  pf="$(mktemp)"
  ns_render "$NS_SKILL_DIR/prompts/fix.md" "$pf" \
    CHANGE="$CHANGE" REVIEW_PATH="$REVIEW" PROGRESS_PATH="$PROGRESS"
  run_claude "$pf" "$F_MODEL" "fix-$c" || true
  grc=0; ns_gate "$NS_WT" "$pre_sha" || grc=$?
  [[ $grc -ne 0 ]] && ns_log "fix cycle $c: гейт=$grc (откачено)"
  do_review "$c" || exit 31
  [[ "$(blockers)" -eq 0 ]] && exit 30
done
exit 31
