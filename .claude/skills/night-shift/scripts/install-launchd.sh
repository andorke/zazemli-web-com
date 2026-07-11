#!/usr/bin/env bash
# Генерация и загрузка LaunchAgent для текущего проекта. Идемпотентно.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

NO_LOAD=0; KEEP_TOKENS=0
while [[ $# -gt 0 ]]; do case "$1" in
  --no-load) NO_LOAD=1;; --keep-tokens) KEEP_TOKENS=1;;
  *) ns_die "неизвестный аргумент: $1";; esac; shift; done
ns_init "$PWD"
PROJECT="$(basename "$NS_ROOT")"
PL="$HOME/Library/LaunchAgents/com.night-shift.$PROJECT.plist"
# --keep-tokens: перегенерация под новое расписание без интерактива —
# токены вычитываются из уже установленного plist
if [[ $KEEP_TOKENS -eq 1 && -f "$PL" ]]; then
  [[ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]] && CLAUDE_CODE_OAUTH_TOKEN="$(plutil -extract EnvironmentVariables.CLAUDE_CODE_OAUTH_TOKEN raw "$PL" 2>/dev/null || true)"
  [[ -z "${GITLAB_TOKEN:-}" ]] && GITLAB_TOKEN="$(plutil -extract EnvironmentVariables.GITLAB_TOKEN raw "$PL" 2>/dev/null || true)"
fi
START="$(ns_cfg '.schedule.start' '01:00')"
HH=$(( 10#${START%%:*} )); MM=$(( 10#${START##*:} ))

RUNNER="$NS_ROOT/.claude/skills/night-shift/scripts/night-run.sh"
[[ -f "$RUNNER" ]] || RUNNER="$NS_SKILL_DIR/scripts/night-run.sh"

if [[ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]]; then
  [[ $KEEP_TOKENS -eq 1 ]] && ns_die "--keep-tokens: OAuth-токен не найден в существующем plist"
  read -rs -p "CLAUDE_CODE_OAUTH_TOKEN (из claude setup-token): " CLAUDE_CODE_OAUTH_TOKEN; echo
fi
if [[ -z "${GITLAB_TOKEN:-}" && $KEEP_TOKENS -eq 0 ]]; then
  read -rs -p "GITLAB_TOKEN (PAT c api scope; пусто = MR отключён): " GITLAB_TOKEN; echo
fi
GITLAB_TOKEN="${GITLAB_TOKEN:-}"

# PATH для launchd: каталоги claude и jq + системные
CB="$(ns_cfg '.claude_bin' 'claude')"
CDIR="$(dirname "$(command -v "$CB" 2>/dev/null || echo /usr/local/bin/claude)")"
JDIR="$(dirname "$(command -v jq)")"
PATHV="$CDIR:$JDIR:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

mkdir -p "$NS_ROOT/.night/logs" "$HOME/Library/LaunchAgents"
ns_render "$NS_SKILL_DIR/templates/com.night-shift.PROJECT.plist" "$PL" \
  PROJECT="$PROJECT" RUNNER="$RUNNER" REPO="$NS_ROOT" HH="$HH" MM="$MM" \
  PATHV="$PATHV" HOMEV="$HOME" OAUTH="$CLAUDE_CODE_OAUTH_TOKEN" GLTOKEN="${GITLAB_TOKEN:-}"
chmod 600 "$PL"
plutil -lint "$PL" >/dev/null || ns_die "plist битый: $PL"

if [[ $NO_LOAD -eq 0 ]]; then
  launchctl unload "$PL" 2>/dev/null || true
  launchctl load "$PL"
  ns_log "загружен: $(basename "$PL") — старт ежедневно в $START"
else
  ns_log "сгенерирован (без load): $PL"
fi
ns_log "проверка: launchctl list | grep night-shift; ручной прогон: night-run.sh --now"
