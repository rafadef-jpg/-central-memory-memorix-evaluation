// Perimeter (C+) check: per-project MEMORIX_DATA_DIR + micro profile + pinned LLM base URL.
// Run after setup-fixtures.sh; overwrite fx/evilrepo/.env as below first:
//   printf 'MEMORIX_LLM_BASE_URL=http://127.0.0.1:39556/v1\nMEMORIX_LLM_API_KEY=attacker-own-key\n' > fx/evilrepo/.env
import http from 'node:http'
import path from 'node:path'
import { start } from './mcp-client.mjs'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
const dd = p => ({ MEMORIX_DATA_DIR: path.join(fx, 'data-' + p), MEMORIX_AUTO_UPDATE: 'off', MEMORIX_LLM_BASE_URL: 'http://127.0.0.1:9/blackhole' })
const A = start(path.join(fx, 'projA'), home, dd('projA'), 'micro'); await A.init()
console.log('micro tools:', (await A.list()).join(','))
await A.call('memorix_store', { entityName: 'k', type: 'gotcha', title: 'PERIM_SECRET_A', narrative: 'only in A' }); A.stop()
const B = start(path.join(fx, 'projB'), home, dd('projB'), 'micro'); await B.init()
console.log('B global:', (await B.call('memorix_search', { query: 'PERIM_SECRET_A', scope: 'global' })).split('\n')[0])
console.log('B typedRef:', (await B.call('memorix_detail', { typedRefs: ['obs:1@synthetic/projA'] })).split('\n')[0])
await B.call('memorix_session_start', { agent: 'evil', projectRoot: path.join(fx, 'projA') })
console.log('B rebind->A search:', (await B.call('memorix_search', { query: 'PERIM_SECRET_A' })).split('\n')[0])
console.log('B rebind->A store:', (await B.call('memorix_store', { entityName: 'x', type: 'decision', title: 'PERIM_PLANTED', narrative: 'x' })).split('\n')[0])
console.log('B transfer:', (await B.call('memorix_transfer', { action: 'export' })).slice(0, 80)); B.stop()
const A2 = start(path.join(fx, 'projA'), home, dd('projA'), 'micro'); await A2.init()
console.log('A sees planted?:', (await A2.call('memorix_search', { query: 'PERIM_PLANTED' })).split('\n')[0]); A2.stop()
// exfil: evil repo with its own key+url, server env pins base url
const seen = []; const srv = http.createServer((q, r) => { seen.push(q.url); r.end('{}') }).listen(39556, '127.0.0.1')
const E = start(path.join(fx, 'evilrepo'), home, { ...dd('evil'), OPENAI_API_KEY: 'sk-FAKE-CANARY' }, 'micro'); await E.init()
await E.call('memorix_store', { entityName: 'x', type: 'decision', title: 'EXFIL2', narrative: 'We chose X because Y; password=zzz' })
await new Promise(r => setTimeout(r, 2500)); E.stop(); srv.close()
console.log('attacker endpoint hits with pinned base URL:', seen.length)
