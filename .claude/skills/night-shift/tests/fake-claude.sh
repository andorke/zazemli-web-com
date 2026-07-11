#!/usr/bin/env bash
# Имитация claude -p для тестов. Сценарий: env FAKE_SCENARIO (default ok).
# Пишет фиктивный result-JSON в stdout, работу делает в cwd (как настоящий агент).
set -euo pipefail
SCEN="${FAKE_SCENARIO:-ok}"
CH="${FAKE_CHANGE:-tc-1}"
TASKS="openspec/changes/$CH/tasks.md"
PROG="${FAKE_PROGRESS:-}"

case "$SCEN" in
  ok)
    line="$(grep -n '^\- \[ \]' "$TASKS" | head -1 | cut -d: -f1)"
    mkdir -p src; echo "impl for task at line $line" >> "src/feature.txt"
    sed -i '' "${line}s/^- \[ \]/- [x]/" "$TASKS"
    git add -A && git commit -qm "feat: implement next task of $CH"
    [[ -n "$PROG" ]] && { mkdir -p "$(dirname "$PROG")"; echo "done line $line" >> "$PROG"; }
    ;;
  fail_build)
    mkdir -p src; echo broken > src/broken.txt
    git add -A && git commit -qm "feat: broken change" ;;
  forbidden)
    echo "hacked=true" >> gradle.properties
    git add -A && git commit -qm "chore: touch forbidden" ;;
  spec_edit)
    echo "night edit" >> "openspec/changes/$CH/design.md"
    git add -A && git commit -qm "docs: illegal spec edit" ;;
  ratelimit)
    echo "You've hit your usage limit. Your limit will reset at 3:30am (Europe/Moscow)." >&2
    exit 1 ;;
  noop) : ;;
  escalate)
    [[ -n "$PROG" ]] && { mkdir -p "$(dirname "$PROG")"; echo "ESCALATE: спека неясна" >> "$PROG"; } ;;
  review_dirty)
    mkdir -p "$(dirname "$FAKE_REVIEW")"
    printf '# REVIEW %s\n- SCORE=90 src/feature.txt:1 — фиктивный баг\n' "$CH" > "$FAKE_REVIEW" ;;
  review_clean)
    mkdir -p "$(dirname "$FAKE_REVIEW")"
    printf '# REVIEW %s\nCLEAN\n' "$CH" > "$FAKE_REVIEW" ;;
  fix_ok)
    echo "fixed" >> src/feature.txt
    git add -A && git commit -qm "fix(review): address findings" ;;
esac
printf '{"type":"result","subtype":"success","total_cost_usd":0,"num_turns":3,"result":"fake %s"}\n' "$SCEN"
