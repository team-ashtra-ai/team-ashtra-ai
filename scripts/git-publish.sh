#!/usr/bin/env bash

set -euo pipefail

branch="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$branch" == "HEAD" ]]; then
  echo "Cannot publish from a detached HEAD." >&2
  exit 1
fi

timestamp="$(TZ="${TZ:-America/Sao_Paulo}" date '+%Y-%m-%d %H:%M:%S %Z')"

git add -A
git commit --allow-empty -m "$timestamp"

if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  git push
else
  git push -u origin "$branch"
fi
