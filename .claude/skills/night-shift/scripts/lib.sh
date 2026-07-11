#!/usr/bin/env bash
# night-shift shared lib. Источник паттернов: continuous-claude (MIT) — циклы/заметки;
# Anthropic effective-harnesses — JSON-очередь. Только BSD-утилиты (macOS).
set -euo pipefail

NS_SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ns_log() {
  printf '%s %s\n' "$(date '+%H:%M:%S')" "$*" >&2
  if [[ -n "${NS_LOG_FILE:-}" ]]; then
    printf '%s %s\n' "$(date '+%H:%M:%S')" "$*" >> "$NS_LOG_FILE" 2>/dev/null || true
  fi
}
ns_die() { ns_log "FATAL: $1"; exit "${2:-1}"; }

# ns_init [repo_dir] — cd в корень репо, находит конфиг
ns_init() {
  local dir="${1:-$PWD}"
  NS_ROOT="$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)" \
    || ns_die "не git-репозиторий: $dir"
  NS_CFG="$NS_ROOT/night.config.json"
  [[ -f "$NS_CFG" ]] || ns_die "нет night.config.json в $NS_ROOT (запусти онбординг)"
  export NS_ROOT NS_CFG
  cd "$NS_ROOT"
}

# ns_cfg <jq-path> [default] — значение из конфига; null/отсутствие -> default
ns_cfg() {
  local v
  v="$(jq -r "$1 // empty" "$NS_CFG")" || ns_die "ns_cfg: jq упал на '$1'"
  if [[ -z "$v" ]]; then echo "${2:-}"; else echo "$v"; fi
}

# ns_render <template> <out> KEY=VAL... — подстановка {{KEY}} (VAL без символа |)
ns_render() {
  local tmpl="$1" out="$2"; shift 2
  local script=""
  local kv
  for kv in "$@"; do
    local k="${kv%%=*}" v="${kv#*=}"
    v="${v//\\/\\\\}"; v="${v//|/\\|}"; v="${v//&/\\&}"
    script+="s|{{${k}}}|${v}|g;"
  done
  sed -e "$script" "$tmpl" > "$out"
}

ns_now_hm() { date '+%H:%M'; }

# ns_hm_to_today_epoch HH:MM -> epoch сегодняшнего дня (BSD date)
ns_hm_to_today_epoch() {
  date -j -f '%Y-%m-%d %H:%M:%S' "$(date '+%Y-%m-%d') $1:00" '+%s'
}

# ns_guard_subscription — инварианты подписки (§8.1); вызывать перед КАЖДЫМ claude
ns_guard_subscription() {
  unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN || true
  [[ -n "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]] \
    || ns_die "CLAUDE_CODE_OAUTH_TOKEN не задан — подписка-only ран невозможен" 21
  local sub; sub="$(ns_cfg '.models.subagent' '')"
  if [[ -n "$sub" ]]; then export CLAUDE_CODE_SUBAGENT_MODEL="$sub"
  else unset CLAUDE_CODE_SUBAGENT_MODEL || true; fi
}

# ns_check_version — предупреждение при несовпадении версии CLI с пином
ns_check_version() {
  local pinned actual bin
  pinned="$(ns_cfg '.pinned_claude_version')"
  [[ -z "$pinned" ]] && return 0
  bin="$(ns_cfg '.claude_bin' 'claude')"
  actual="$("$bin" --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)"
  if [[ "$actual" != "$pinned" ]]; then
    ns_log "WARN: claude $actual != пин $pinned — проверь changelog (--bare-флип!)"
    mkdir -p "$NS_ROOT/.night"
    echo "claude_version_mismatch: $actual != $pinned" >> "$NS_ROOT/.night/warnings.log"
  fi
}

# ns_timeout <secs> <cmd...> — TERM по истечении, KILL через 10с, без сирот-sleep
ns_timeout() {
  local secs="$1"; shift
  "$@" & local pid=$!
  ( sleep "$secs"; kill -TERM "$pid" 2>/dev/null; sleep 10; kill -KILL "$pid" 2>/dev/null ) & local wd=$!
  local rc=0; wait "$pid" || rc=$?
  pkill -P "$wd" 2>/dev/null || true
  kill "$wd" 2>/dev/null || true
  wait "$wd" 2>/dev/null || true
  return "$rc"
}

# ns_gate <wt> <start_sha> — verify + lint + границы; красное -> git reset --hard start_sha
# exit-коды: 0 ок; 10 verify/lint красный; 11 границы. Логи: $NS_GATE_LOG (если задан)
ns_gate() {
  local wt="$1" start="$2" vcmd lcmd f patt
  vcmd="$(ns_cfg '.verify')"; lcmd="$(ns_cfg '.lint' '')"
  [[ -n "$vcmd" ]] || ns_die "config: verify пуст — гейт невозможен"
  if ! (cd "$wt" && bash -c "$vcmd") >> "${NS_GATE_LOG:-/dev/null}" 2>&1; then
    git -C "$wt" reset --hard "$start" -q; git -C "$wt" clean -fdq 2>/dev/null || true; return 10
  fi
  if [[ -n "$lcmd" ]] && ! (cd "$wt" && bash -c "$lcmd") >> "${NS_GATE_LOG:-/dev/null}" 2>&1; then
    git -C "$wt" reset --hard "$start" -q; git -C "$wt" clean -fdq 2>/dev/null || true; return 10
  fi
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    # спеки read-only (§7)
    if [[ "$f" == openspec/changes/*/design.md || "$f" == openspec/changes/*/proposal.md \
       || "$f" == openspec/changes/*/specs/* ]]; then
      ns_log "BOUNDARY: спека изменена: $f"; git -C "$wt" reset --hard "$start" -q; git -C "$wt" clean -fdq 2>/dev/null || true; return 11
    fi
    while IFS= read -r patt; do
      [[ -z "$patt" ]] && continue
      # shellcheck disable=SC2254
      case "$f" in $patt) ns_log "BOUNDARY: запретный путь: $f ($patt)"
        git -C "$wt" reset --hard "$start" -q; git -C "$wt" clean -fdq 2>/dev/null || true; return 11;; esac
    done < <(jq -r '.forbidden_paths[]?' "$NS_CFG")
  done < <(git -C "$wt" diff --name-only "$start"..HEAD)
  return 0
}

# ns_parse_reset_epoch <file...> — ищет "reset(s) at 3:30am"/"at 14:00" в файлах,
# печатает epoch ближайшего будущего сброса; ничего не печатает, если не распарсили.
# Алгоритм по мотивам claude-auto-retry (tz-строку игнорируем: локальная TZ).
ns_parse_reset_epoch() {
  local m h min ampm epoch now
  m="$(grep -ihoE 'reset[s]? (at|:)? ?[0-9]{1,2}(:[0-9]{2})? ?(am|pm)?' "$@" 2>/dev/null | head -1 || true)"
  [[ -z "$m" ]] && return 0
  h="$(echo "$m" | grep -oE '[0-9]{1,2}(:[0-9]{2})?' | head -1)"
  ampm="$(echo "$m" | grep -ioE '(am|pm)' | head -1 | tr '[:upper:]' '[:lower:]' || true)"
  min="${h#*:}"; [[ "$min" == "$h" ]] && min="00"; h="${h%%:*}"
  [[ "$ampm" == "pm" && "$h" -lt 12 ]] && h=$(( h + 12 ))
  [[ "$ampm" == "am" && "$h" -eq 12 ]] && h=0
  epoch="$(ns_hm_to_today_epoch "$(printf '%02d:%s' "$h" "$min")")" || return 0
  now="$(date +%s)"
  [[ "$epoch" -le "$now" ]] && epoch=$(( epoch + 86400 ))
  echo "$epoch"
}

ns_backoff() {
  # bash 3.2: объявление разбито — в combined local арифметика видит n до привязки
  local n="$1"; local s=$(( 30 * (1 << (n - 1)) ))
  (( s > 300 )) && s=300
  s=$(( s + RANDOM % 15 ))
  ns_log "backoff: sleep ${s}s (попытка $n)"; sleep "$s"
}

ns_limit_is_weekly() { grep -qiE 'week(ly)? (usage )?limit' "$@" 2>/dev/null; }
