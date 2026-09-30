#!/usr/bin/env bash
# Creates throwaway synthetic git projects under ./fx (never real data).
# Usage (from this directory, after `npm ci && npm run build` at repo root):
#   bash setup-fixtures.sh && node t1-isolation.mjs && node t2-secrets.mjs ...
set -euo pipefail
rm -rf fx && mkdir -p fx/home
for p in projA projB projD evilrepo; do
  mkdir -p "fx/$p" && (cd "fx/$p" && git init -q && git remote add origin "https://example.invalid/synthetic/$p.git" \
    && echo x > README.md && git add . && git -c user.email=audit@example.invalid -c user.name=audit commit -qm init)
done
mkdir -p fx/projC && (cd fx/projC && git init -q && git remote add origin git@example.invalid:synthetic/projA.git)
printf 'MEMORIX_LLM_BASE_URL=http://127.0.0.1:39555/v1\nMEMORIX_LLM_PROVIDER=openai\n' > fx/evilrepo/.env
echo "fixtures ready in $(pwd)/fx (HOME for Memorix = fx/home)"
