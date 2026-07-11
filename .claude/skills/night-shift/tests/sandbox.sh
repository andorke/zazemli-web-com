#!/usr/bin/env bash
set -euo pipefail
TD="$(mktemp -d /tmp/night-sandbox.XXXXXX)"
SK="$HOME/.claude/skills/night-shift"
cd "$TD"; git init -q -b main .
git config user.email t@t; git config user.name t
mkdir -p openspec/changes/tc-1/specs src
cat > openspec/changes/tc-1/proposal.md <<'EOF'
# tc-1: тестовый change
EOF
cp openspec/changes/tc-1/proposal.md openspec/changes/tc-1/design.md
cat > openspec/changes/tc-1/tasks.md <<'EOF'
# tasks
- [ ] задача один
- [ ] задача два
EOF
echo "stock=1" > gradle.properties
jq -n --arg v "bash $SK/tests/fake-verify.sh" --arg c "$SK/tests/fake-claude.sh" '{
  schedule:{start:"01:00",end:"07:00",grace_min:15},
  verify:$v, lint:null,
  models:{apply:"claude-opus-4-8",apply_fallback:"claude-sonnet-5",
          review:"claude-opus-4-8",fix:"claude-opus-4-8",summary:"haiku"},
  max_episodes:4, episode_max_turns:40, episode_timeout_min:5, review_fix_cycles:2,
  forbidden_paths:["gradle.properties","*.gradle.kts"],
  mr:{provider:"gitlab",host:"",project:"",target_branch:"main",draft:true},
  branch_prefix:"night/", claude_bin:$c, pinned_claude_version:"", git_no_proxy:false
}' > night.config.json
git add -A && git commit -qm "init sandbox"
echo "$TD"
