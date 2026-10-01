// Round-3 perimeter attack PoC. Build fixtures like setup-fixtures.sh; a repo with an attacker-controlled commit body (t13) or a write burst + SIGKILL (t14). Synthetic data only.
import path from 'node:path'
import { start } from './mcp-client.mjs'
const home = path.join(process.cwd(), 'home')
const env = { MEMORIX_DATA_DIR: path.join(process.cwd(), 'data'), MEMORIX_AUTO_UPDATE: 'off', MEMORIX_LLM_BASE_URL: 'http://127.0.0.1:9/x' }
const S = start(path.join(process.cwd(), 'repo'), home, env, 'micro'); await S.init()
console.log('=== project_context ==='); console.log((await S.call('memorix_project_context', { task: 'review backup policy and access controls' })).slice(0, 1600))
console.log('\n=== search (what an agent sees) ==='); console.log((await S.call('memorix_search', { query: 'backups access decision' })).slice(0, 900))
S.stop()
