// Round-3 perimeter attack PoC. Build fixtures like setup-fixtures.sh; a repo with an attacker-controlled commit body (t13) or a write burst + SIGKILL (t14). Synthetic data only.
import path from 'node:path'
import { start } from './mcp-client.mjs'
const home = path.join(process.cwd(), 'home')
const env = { MEMORIX_DATA_DIR: path.join(process.cwd(), 'data'), MEMORIX_AUTO_UPDATE: 'off', MEMORIX_LLM_BASE_URL: 'http://127.0.0.1:9/x' }
const S = start(path.join(process.cwd(), 'repo'), home, env, 'micro'); await S.init()
// fire 60 writes without awaiting, then hard-kill the server mid-flight
const proms = []
for (let i = 0; i < 60; i++) proms.push(S.call('memorix_store', { entityName: 'e', type: 'discovery', title: 'CRASHW ' + i, narrative: 'row ' + i + ' unique zz' + i }))
setTimeout(() => { try { S.child.kill('SIGKILL') } catch {} }, 120)
try { await Promise.race([Promise.all(proms), new Promise(r => setTimeout(r, 800))]) } catch {}
process.exit(0)
