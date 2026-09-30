# Synthetic tests — CM-MEMORIX-AUDIT-001

Temporary audit tooling. Uses only synthetic data (fake git remotes on `example.invalid`,
fake secrets, isolated `HOME` under `./fx`). Never point these at real data.

```bash
npm ci && npm run build          # at repository root
cd docs/audit/CM-MEMORIX-AUDIT-001/synthetic-tests
bash setup-fixtures.sh
node t1-isolation.mjs            # then t2 … t10 (t4/t5/t9 expect t1 to have run first)
NODE_PATH=$(npm root -g) node t11-xss.cjs   # needs Playwright + Chromium
node dbdump.cjs                  # inspect the test DB
rm -rf fx                        # cleanup
```

See `../REPORT.md` (Apêndice A) for what each script demonstrates.
