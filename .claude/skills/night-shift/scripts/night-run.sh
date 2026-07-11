#!/usr/bin/env bash
# Оркестратор ночи (§8): bash управляет, Claude исполняет. Последовательно по очереди.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

NOW_MODE=0; ONLY_CHANGE=""
while [[ $# -gt 0 ]]; do case "$1" in
  --now) NOW_MODE=1;; --change) ONLY_CHANGE="$2"; shift;;
  *) ns_die "неизвестный аргумент: $1";; esac; shift; done

ns_init "$PWD"
NS_STATE="$NS_ROOT/.night"; export NS_STATE
QUEUE="$NS_STATE/queue.json"
mkdir -p "$NS_STATE"
export NS_NIGHT_DATE="$(date +%F)"
mkdir -p "$NS_STATE/logs/$NS_NIGHT_DATE"
export NS_LOG_FILE="$NS_STATE/logs/$NS_NIGHT_DATE/runner.log"
ns_log "=== ночь $NS_NIGHT_DATE: старт pid $$, режим $([[ $NOW_MODE -eq 1 ]] && echo ручной || echo расписание) ==="
[[ -f "$QUEUE" ]] || ns_die "нет $QUEUE — собери очередь (/night-shift queue)"

if ! mkdir "$NS_STATE/run.lock" 2>/dev/null; then
  OLDPID="$(cat "$NS_STATE/run.lock/pid" 2>/dev/null || true)"
  if [[ -n "$OLDPID" ]] && kill -0 "$OLDPID" 2>/dev/null; then
    ns_die "run.lock: раннер уже идёт (pid $OLDPID)"
  fi
  ns_log "стейл-лок (pid ${OLDPID:-нет}) — рекламирую"
  rm -rf "$NS_STATE/run.lock"
  mkdir "$NS_STATE/run.lock" || ns_die "не смог пересоздать run.lock"
fi
echo $$ > "$NS_STATE/run.lock/pid"
CAFF_PID=""
cleanup() { rc=$?
  rm -rf "$NS_STATE/run.lock" 2>/dev/null || true
  [[ -n "$CAFF_PID" ]] && kill "$CAFF_PID" 2>/dev/null || true
  # финализация state рана: in_progress -> done|failed (prepared не трогаем)
  if [[ -f "${QUEUE:-}" ]] && [[ "$(jq -r '.state // empty' "$QUEUE" 2>/dev/null)" == "in_progress" ]]; then
    local t; t="$(mktemp)"
    if jq --arg s "$([[ $rc -eq 0 ]] && echo done || echo failed)"           --arg f "$(date '+%F %T')" --arg rc "$rc"           '.state=$s | .finished_at=$f | (if $s=="failed" then .fail_note=("exit "+$rc) else . end)'           "$QUEUE" > "$t" 2>/dev/null; then mv "$t" "$QUEUE" 2>/dev/null || true; else rm -f "$t"; fi
  fi
  return 0; }
trap cleanup EXIT
trap 'exit 130' INT

# --- дедлайн ночи ---
GRACE_MIN="$(ns_cfg '.schedule.grace_min' 15)"
if [[ $NOW_MODE -eq 1 ]]; then END_EPOCH=$(( $(date +%s) + 6*3600 ))
else
  _start_hm="$(ns_cfg '.schedule.start' '01:00')"; _end_hm="$(ns_cfg '.schedule.end' '07:00')"
  S1="$(ns_hm_to_today_epoch "$_start_hm")"; E1="$(ns_hm_to_today_epoch "$_end_hm")"
  [[ "$E1" -le "$S1" ]] && E1=$(( E1 + 86400 ))
  S0=$(( S1 - 86400 )); E0=$(( E1 - 86400 ))
  NOW_TS="$(date +%s)"
  if (( NOW_TS >= S1 - 1800 && NOW_TS < E1 )); then END_EPOCH="$E1"
  elif (( NOW_TS >= S0 - 1800 && NOW_TS < E0 )); then END_EPOCH="$E0"
  else ns_die "вне ночного окна ${_start_hm}-${_end_hm} — для ручного прогона используй --now"; fi
fi
night_over() { [[ "$(date +%s)" -ge "$END_EPOCH" ]]; }
# ревью запускаем, только если до конца окна остался запас на review+fix (~15 мин)
review_fits() { (( $(date +%s) + 900 < END_EPOCH )); }

# --- идентичность рана (после гейта окна: вне окна state остаётся prepared) ---
RUN_ID="$(jq -r '.run_id // empty' "$QUEUE")"
[[ -z "$RUN_ID" ]] && RUN_ID="night-$(date +%Y%m%d-%H%M%S)"
q_state() { local t; t="$(mktemp)"
  jq --arg s "$1" --arg ts "$(date '+%F %T')" \
     '.state=$s | (if $s=="in_progress" then .started_at=$ts | del(.finished_at) | del(.fail_note)
                   else .finished_at=$ts end)' "$QUEUE" > "$t" && mv "$t" "$QUEUE"; }
_t="$(mktemp)" && jq --arg id "$RUN_ID" '.run_id=$id' "$QUEUE" > "$_t" && mv "$_t" "$QUEUE"
q_state in_progress
ns_log "ран $RUN_ID: in_progress"
export NS_DEADLINE_EPOCH=$(( END_EPOCH + GRACE_MIN * 60 ))

ns_guard_subscription; ns_check_version
command -v caffeinate >/dev/null && { caffeinate -dimsu -w $$ & CAFF_PID=$!; }

# --- git env (обход прокси для origin при git_no_proxy) ---
GITE=(env)
[[ "$(ns_cfg '.git_no_proxy' 'false')" == "true" ]] \
  && GITE=(env HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy=)

# --- baseline в чистом worktree (§8.1 п.3) ---
CFG_BASE="$(ns_cfg '.base_ref' '')"
if [[ -n "$CFG_BASE" ]]; then
  "${GITE[@]}" git fetch origin -q 2>/dev/null || ns_log "WARN: fetch origin не удался"
  if git rev-parse --verify -q "$CFG_BASE" >/dev/null; then BASE_REF="$CFG_BASE"
  elif git rev-parse --verify -q "origin/$CFG_BASE" >/dev/null; then BASE_REF="origin/$CFG_BASE"
  else ns_die "base_ref '$CFG_BASE' не найден ни локально, ни на origin"; fi
  ns_log "база ночи: $BASE_REF (из конфига)"
else
  BASE_REF="main"
  if git rev-parse --verify -q origin/main >/dev/null; then
    "${GITE[@]}" git fetch origin -q || ns_log "WARN: fetch origin не удался, беру локальный main"
    BASE_REF="origin/main"
  fi
fi
# сеем в worktree файлы вне git (SDK-пути и т.п.) из конфига
wt_seed() { local wt="$1" f
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    [[ -f "$NS_ROOT/$f" && ! -e "$wt/$f" ]] && cp "$NS_ROOT/$f" "$wt/$f" 2>/dev/null || true
  done < <(jq -r '.worktree_copy_files[]? // empty' "$NS_CFG"); return 0; }

BWT="$NS_STATE/wt/_baseline"
git worktree remove -f "$BWT" 2>/dev/null || true
git worktree add -q --detach "$BWT" "$BASE_REF"
wt_seed "$BWT"
if ! (cd "$BWT" && bash -c "$(ns_cfg '.verify')") > "$NS_STATE/baseline.log" 2>&1; then
  git worktree remove -f "$BWT" || true
  echo "baseline_broken" >> "$NS_STATE/warnings.log"
  q_state failed
  "$NS_SKILL_DIR/scripts/report.sh" || true
  ns_die "baseline красный — ночь отменена (см .night/baseline.log)"
fi
git worktree remove -f "$BWT" || true

# --- утилиты очереди ---
q_len() { jq '.items|length' "$QUEUE"; }
q_get() { jq -r ".items[$1].$2 // empty" "$QUEUE"; }
q_set() { local t; t="$(mktemp)"  # $1 idx $2 field $3 value $4 type(str|num)
  if [[ "${4:-str}" == num ]]; then jq ".items[$1].$2 = $3" "$QUEUE" > "$t"
  else jq --arg v "$3" ".items[$1].$2 = \$v" "$QUEUE" > "$t"; fi
  mv "$t" "$QUEUE"; }

AUTH_DEAD=0
for (( i=0; i<$(q_len); i++ )); do
  CH="$(q_get "$i" change)"; ST="$(q_get "$i" status)"
  # queued — обычный путь; running — продолжение после краша раннера (§8.4)
  [[ "$ST" != "queued" && "$ST" != "running" ]] && continue
  [[ -n "$ONLY_CHANGE" && "$CH" != "$ONLY_CHANGE" ]] && continue
  if [[ $AUTH_DEAD -eq 1 ]] || night_over; then q_set "$i" status skipped; continue; fi
  [[ -d "$NS_ROOT/openspec/changes/$CH" ]] || { q_set "$i" status failed
    q_set "$i" note "нет openspec/changes/$CH"; continue; }

  q_set "$i" status running
  MODEL="$(q_get "$i" model)"; [[ -z "$MODEL" ]] && MODEL="$(ns_cfg '.models.apply')"
  MAXEP="$(q_get "$i" max_episodes)"; [[ -z "$MAXEP" ]] && MAXEP="$(ns_cfg '.max_episodes' 6)"
  BR="$(ns_cfg '.branch_prefix' 'night/')$CH"
  WT="$NS_STATE/wt/$CH"; export NS_WT="$WT"
  git worktree remove -f "$WT" 2>/dev/null || true
  if git rev-parse --verify -q "$BR" >/dev/null; then git worktree add -q "$WT" "$BR"
  else git worktree add -q -b "$BR" "$WT" "$BASE_REF"; fi
  wt_seed "$WT"
  # merge-base, не tip: при резюме ветки tip уже содержит докрашевые коммиты,
  # а MR/ревью-диапазон должен покрывать всю ветку от точки ветвления
  BASE_SHA="$(git -C "$WT" merge-base "$BASE_REF" HEAD)"
  LDIR="$NS_STATE/logs/$NS_NIGHT_DATE/$CH"

  PREV_DONE="$(q_get "$i" episodes_done)"; [[ "$PREV_DONE" =~ ^[0-9]+$ ]] || PREV_DONE=0
  fails=0; crashes=0; ep=$(( PREV_DONE + 1 )); FINAL=""; FB_USED=0
  while (( ep <= MAXEP )); do
    night_over && { FINAL="night_end"; break; }
    rc=0; "$NS_SKILL_DIR/scripts/episode.sh" "$CH" "$MODEL" "$ep" || rc=$?
    q_set "$i" episodes_done "$ep" num
    ns_log "$CH ep=$ep rc=$rc model=$MODEL"
    case $rc in
      0)  fails=0; crashes=0; (( ep++ ));;
      13) FINAL="tasks_done"; break;;
      14) FINAL="owner_only"; break;;
      10|11|12) (( ++fails >= 3 )) && { FINAL="failed"; q_set "$i" note "3 фейла подряд (rc=$rc)"; break; };;
      20) LG="$(cat "$NS_STATE/state/$CH/last_green" 2>/dev/null || echo "$BASE_SHA")"
          git -C "$WT" reset --hard "$LG" -q 2>/dev/null || true
          git -C "$WT" clean -fdq 2>/dev/null || true
          EPF="$LDIR/ep-$(printf '%02d' "$ep").json"
          if ns_limit_is_weekly "$EPF" "$EPF.err" && [[ "$MODEL" == *opus* && $FB_USED -eq 0 ]]; then
            FB="$(ns_cfg '.models.apply_fallback' '')"
            if [[ -n "$FB" ]]; then ns_log "$CH: недельный кап Opus -> $FB"
              q_set "$i" note "weekly cap: fallback $FB"; MODEL="$FB"; FB_USED=1; continue; fi
          fi
          RE="$(cat "$NS_STATE/state/$CH/rate_reset" 2>/dev/null || true)"
          if [[ -n "$RE" && "$RE" -lt "$END_EPOCH" ]]; then
            ns_log "rate-limit: сплю до $(date -r "$RE" '+%H:%M') +120s"
            sleep $(( RE - $(date +%s) + 120 )); continue
          fi
          FINAL="failed"; q_set "$i" note "rate-limit до конца ночи"; break;;
      21) FINAL="failed"; q_set "$i" note "auth: перегенерируй setup-token"; AUTH_DEAD=1; break;;
      22|137|143) LG="$(cat "$NS_STATE/state/$CH/last_green" 2>/dev/null || echo "$BASE_SHA")"
          git -C "$WT" reset --hard "$LG" -q 2>/dev/null || true
          git -C "$WT" clean -fdq 2>/dev/null || true
          (( ++crashes >= 3 )) && { FINAL="failed"; q_set "$i" note "3 крэша claude"; break; }
          ns_backoff "$crashes";;
      *)  FINAL="failed"; q_set "$i" note "episode rc=$rc"; break;;
    esac
  done
  [[ -z "$FINAL" && $ep -gt $MAXEP ]] && FINAL="episode_budget"

  HAS_WORK=$([[ "$(git -C "$WT" rev-parse HEAD)" != "$BASE_SHA" ]] && echo 1 || echo 0)
  STATUS="failed"
  if [[ "$FINAL" == "tasks_done" ]] && ! night_over; then
    rrc=0; "$NS_SKILL_DIR/scripts/review-loop.sh" "$CH" "$BASE_SHA" || rrc=$?
    case $rrc in 30) STATUS="done";; 31) STATUS="needs_review";;
      *) STATUS="needs_review"; q_set "$i" note "review rc=$rrc";; esac
  elif [[ "$FINAL" == "owner_only" ]]; then
    # агентская часть закрыта — остались только задачи владельца (installDebug/smoke/устройство)
    if [[ $HAS_WORK -eq 1 ]] && review_fits; then
      rrc=0; "$NS_SKILL_DIR/scripts/review-loop.sh" "$CH" "$BASE_SHA" || rrc=$?
      case $rrc in 30) STATUS="ready_for_owner"; q_set "$i" note "агентское сделано, ревью чистое — остались задачи владельца";;
        *) STATUS="needs_review"; q_set "$i" note "агентское сделано, остались задачи владельца (ревью: есть находки)";; esac
    elif [[ $HAS_WORK -eq 1 ]]; then
      STATUS="ready_for_owner"; q_set "$i" note "остались только задачи владельца (без ночного ревью)"
    else
      STATUS="ready_for_owner"; q_set "$i" note "остались только задачи владельца"
    fi
  elif [[ "$FINAL" == "episode_budget" ]] && [[ $HAS_WORK -eq 1 ]] && review_fits; then
    # бюджет съеден на середине работы — ревьюим частичный результат, утро получает проверенный код
    rrc=0; "$NS_SKILL_DIR/scripts/review-loop.sh" "$CH" "$BASE_SHA" || rrc=$?
    case $rrc in 30) STATUS="needs_review"; q_set "$i" note "частично: episode_budget (ревью частичной работы чистое)";;
      *) STATUS="needs_review"; q_set "$i" note "частично: episode_budget (ревью: есть находки)";; esac
  elif [[ "$FINAL" == "night_end" || "$FINAL" == "episode_budget" ]] && [[ $HAS_WORK -eq 1 ]]; then
    STATUS="needs_review"; q_set "$i" note "частично: $FINAL (без ночного ревью)"
  elif [[ "$FINAL" == "night_end" && $HAS_WORK -eq 0 ]]; then
    STATUS="skipped"; q_set "$i" note "не успел начать"
  fi
  q_set "$i" status "$STATUS"

  if [[ $HAS_WORK -eq 1 ]]; then
    MRURL="$("$NS_SKILL_DIR/scripts/make-mr.sh" "$CH" 2>>"$NS_STATE/warnings.log" || true)"
    [[ -n "$MRURL" ]] && q_set "$i" mr_url "$MRURL"
  fi
  git worktree remove -f "$WT" 2>/dev/null || true
done

find "$NS_STATE/logs" -maxdepth 1 -type d -mtime +14 -exec rm -rf {} + 2>/dev/null || true
q_state done
"$NS_SKILL_DIR/scripts/report.sh" || ns_log "report.sh упал"
ns_log "ночь завершена: ран $RUN_ID -> done"
