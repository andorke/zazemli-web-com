#!/usr/bin/env bash
# Синхронизация внешней базы знаний (Obsidian-vault VesnaPenguin/zazemli-vault).
#
# vault двигает фаундер через Obsidian Git plugin (автокоммиты) — здесь только pull
# (или клон, если vault ещё нет). Направление одностороннее: vault → локальный клон.
#
# git к github в этом окружении ходит через локальный прокси — берём его из $HTTPS_PROXY
# (curl его подхватывает сам, git — нет, поэтому прокидываем явно через -c http.proxy).
set -euo pipefail

# По умолчанию vault лежит рядом с репо сайта: <repo>/../zazemli-vault
VAULT_DIR="${VAULT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/zazemli-vault}"
REPO_URL="https://github.com/VesnaPenguin/zazemli-vault"
PROXY="${HTTPS_PROXY:-${https_proxy:-}}"

git_proxied() {
  if [ -n "$PROXY" ]; then
    GIT_TERMINAL_PROMPT=0 git -c http.proxy="$PROXY" -c https.proxy="$PROXY" "$@"
  else
    GIT_TERMINAL_PROMPT=0 git "$@"
  fi
}

if [ -d "$VAULT_DIR/.git" ]; then
  echo "→ pull vault: $VAULT_DIR"
  git_proxied -C "$VAULT_DIR" pull --ff-only
else
  echo "→ clone vault → $VAULT_DIR"
  git_proxied clone "$REPO_URL" "$VAULT_DIR"
fi
echo "✓ vault готов: $VAULT_DIR (точка входа: НАВИГАЦИЯ.md)"
