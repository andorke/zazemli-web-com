#!/usr/bin/env bash
# Push + Draft-MR (§10 утро). MR только для done|needs_review; failed -> только push.
# Использование: make-mr.sh <change> [--dry-run]   (cwd: корень проекта; NS_STATE задан)
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

CH="$1"; DRY=0; [[ "${2:-}" == "--dry-run" ]] && DRY=1
ns_init "$PWD"
: "${NS_STATE:=$NS_ROOT/.night}"
SDIR="$NS_STATE/state/$CH"
BR="$(ns_cfg '.branch_prefix' 'night/')$CH"
STATUS="$(jq -r --arg c "$CH" '.items[]|select(.change==$c).status' "$NS_STATE/queue.json" 2>/dev/null || echo unknown)"

GITE=(env)
[[ "$(ns_cfg '.git_no_proxy' 'false')" == "true" ]] \
  && GITE=(env HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy=)

# --- description (evidence-контракт §6) ---
DESC_F="$(mktemp)"
{
  echo "## Ночная смена: $CH (status: $STATUS)"
  echo; echo "### Сделано (tasks.md)"
  git show "$BR:openspec/changes/$CH/tasks.md" 2>/dev/null | grep -E '^\- \[x\]' \
    || echo "_нет закрытых задач_"
  echo; echo "### Проверка"
  echo '```'
  VLOG="$(tail -20 "$NS_STATE"/logs/*/"$CH"/*.verify.log 2>/dev/null | tail -20 || true)"
  if [[ -n "$VLOG" ]]; then printf '%s\n' "$VLOG"; else echo "нет лога"; fi
  echo '```'
  echo; echo "### Ревью"
  cat "$SDIR/REVIEW.md" 2>/dev/null || echo "_ревью не запускалось_"
  echo; echo "### Эскалации и отклонённые находки"
  grep -E '^(ESCALATE|REJECTED):' "$SDIR/PROGRESS.md" 2>/dev/null || echo "_нет_"
  echo; echo "### Чеклист утреннего ревью"
  echo "- [ ] нет дублей существующего кода"
  echo "- [ ] правка покрывает все места (охват)"
  echo "- [ ] нет регрессий рядом"
  echo "- [ ] соответствует design.md"
} > "$DESC_F"

HOST="$(ns_cfg '.mr.host')"; PROJ="$(ns_cfg '.mr.project')"
TARGET="$(ns_cfg '.mr.target_branch' 'main')"
TITLE="Draft: feat($CH): night-shift work"

if [[ $DRY -eq 1 ]]; then
  jq -n --arg sb "$BR" --arg tb "$TARGET" --arg t "$TITLE" \
     --rawfile d "$DESC_F" '{source_branch:$sb,target_branch:$tb,title:$t,description:$d}'
  exit 0
fi

"${GITE[@]}" git push -q -u origin "$BR" 2>&1 | grep -v remote: >&2 || true
[[ "$STATUS" == "done" || "$STATUS" == "needs_review" ]] || exit 0
[[ -n "$HOST" && -n "$PROJ" ]] || { ns_log "mr.host/project пусты — MR пропущен"; exit 0; }
: "${GITLAB_TOKEN:?GITLAB_TOKEN не задан}"

ENC_PROJ="$(jq -rn --arg p "$PROJ" '$p|@uri')"
RESP="$("${GITE[@]}" curl -sfS -X POST "https://$HOST/api/v4/projects/$ENC_PROJ/merge_requests" \
  --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  --data-urlencode "source_branch=$BR" --data-urlencode "target_branch=$TARGET" \
  --data-urlencode "title=$TITLE" --data-urlencode "description@$DESC_F" \
  --data-urlencode "remove_source_branch=false" 2>&1)" || {
    ns_log "MR API упал: $RESP"; exit 0; }
echo "$RESP" | jq -r '.web_url // empty'
