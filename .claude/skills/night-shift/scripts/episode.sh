#!/usr/bin/env bash
# Один ночной эпизод: свежий claude -p + гейты снаружи модели (§8.2).
# Паттерн цикла — по мотивам continuous-claude (MIT) и Anthropic building-c-compiler.
# Использование: NS_WT=<worktree> NS_STATE=<abs .night> episode.sh <change> <model> <ep_no>
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

CHANGE="$1"; MODEL="$2"; EP="$3"
: "${NS_WT:?}"; : "${NS_STATE:?}"
ns_init "$NS_WT"    # конфиг читается из worktree (night.config.json в git)

SDIR="$NS_STATE/state/$CHANGE"; LDIR="$NS_STATE/logs/${NS_NIGHT_DATE:-$(date +%F)}/$CHANGE"
mkdir -p "$SDIR" "$LDIR"
PROGRESS="$SDIR/PROGRESS.md"; OUT="$LDIR/ep-$(printf '%02d' "$EP").json"
export NS_GATE_LOG="$LDIR/ep-$(printf '%02d' "$EP").verify.log"

START_SHA="$(git -C "$NS_WT" rev-parse HEAD)"
TASKS="openspec/changes/$CHANGE/tasks.md"
[[ -f "$NS_WT/$TASKS" ]] || ns_die "нет $TASKS" 12
if ! grep -q '^\- \[ \]' "$NS_WT/$TASKS"; then exit 13; fi
# строки PROGRESS до эпизода: маркеры (OWNER_ONLY_LEFT) читаем только из дописанного хвоста
PRE_LINES="$(wc -l < "$PROGRESS" 2>/dev/null || echo 0)"

PROMPT_FILE="$(mktemp)"
trap 'rm -f "$PROMPT_FILE"' EXIT
ns_render "$NS_SKILL_DIR/prompts/episode.md" "$PROMPT_FILE" \
  CHANGE="$CHANGE" PROGRESS_PATH="$PROGRESS"

CLAUDE_BIN="$(ns_cfg '.claude_bin' 'claude')"
MAX_TURNS="$(ns_cfg '.episode_max_turns' 40)"
TIMEOUT_MIN="$(ns_cfg '.episode_timeout_min' 60)"
ns_guard_subscription

TSECS=$(( TIMEOUT_MIN * 60 ))
if [[ -n "${NS_DEADLINE_EPOCH:-}" ]]; then
  REM=$(( NS_DEADLINE_EPOCH - $(date +%s) ))
  (( REM < TSECS )) && TSECS=$REM
  (( TSECS < 60 )) && TSECS=60
fi
rc=0
( cd "$NS_WT" && ns_timeout "$TSECS" \
    "$CLAUDE_BIN" -p "$(cat "$PROMPT_FILE")" --model "$MODEL" \
    --dangerously-skip-permissions --max-turns "$MAX_TURNS" \
    --output-format json ) > "$OUT" 2> "$OUT.err" || rc=$?

if [[ $rc -ne 0 ]]; then
  # stderr CLI — приоритетный источник; stdout result-JSON проверяется ниже только при is_error==true
  if grep -qiE 'usage limit|rate.?limit|limit will reset|hit your limit' "$OUT.err"; then
    ns_parse_reset_epoch "$OUT.err" > "$SDIR/rate_reset" || true
    exit 20
  fi
  if grep -qiE 'authentication_failed|not logged in|invalid api key|oauth token (expired|revoked|invalid)|please run /login' "$OUT.err"; then
    exit 21
  fi
  if jq -e '.is_error == true' "$OUT" >/dev/null 2>&1 \
     && grep -qiE 'usage limit|rate.?limit|limit will reset' "$OUT"; then
    ns_parse_reset_epoch "$OUT" > "$SDIR/rate_reset" || true
    exit 20
  fi
  exit 22
fi

NEW_SHA="$(git -C "$NS_WT" rev-parse HEAD)"
if [[ "$NEW_SHA" != "$START_SHA" ]]; then
  grc=0; ns_gate "$NS_WT" "$START_SHA" || grc=$?
  [[ $grc -ne 0 ]] && exit "$grc"
  git -C "$NS_WT" rev-parse HEAD > "$SDIR/last_green"
fi

if grep -q 'ALL_TASKS_DONE' "$PROGRESS" 2>/dev/null \
   && ! grep -q '^\- \[ \]' "$NS_WT/$TASKS"; then exit 13; fi

# эпизод констатировал: остались только задачи владельца (маркер именно этого эпизода)
if [[ "$NEW_SHA" == "$START_SHA" ]] \
   && tail -n +"$(( PRE_LINES + 1 ))" "$PROGRESS" 2>/dev/null | grep -q '^OWNER_ONLY_LEFT'; then exit 14; fi

[[ "$NEW_SHA" == "$START_SHA" ]] && exit 12
exit 0
