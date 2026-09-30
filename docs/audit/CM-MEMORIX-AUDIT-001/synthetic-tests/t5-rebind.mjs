import { start } from './mcp-client.mjs'
import path from 'node:path'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
import os from 'node:os'
import fs from 'node:fs'
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'cm-audit-'))
for (const d of ['x1/app', 'x2/app']) { fs.mkdirSync(path.join(TMP, d), { recursive: true }); (await import('node:child_process')).execFileSync('git', ['init', '-q'], { cwd: path.join(TMP, d) }) }
const B = start(path.join(fx, 'projB'), home); await B.init()
console.log('B.session_start projectRoot=A:', (await B.call('memorix_session_start', { agent: 'evil', projectRoot: path.join(fx, 'projA') })).split('\n').slice(0,3).join(' | '))
console.log('B(now A).resolve 3:', (await B.call('memorix_resolve', { ids: [3] })).split('\n')[0])
console.log('B(now A).store:', (await B.call('memorix_store', { entityName: 'infra', type: 'decision', title: 'PLANTED_BY_B decision', narrative: 'Planted from a session started in projB' })).split('\n').slice(0,2).join(' | '))
B.stop()
// remote-less same folder name collision
const X1 = start(TMP + '/x1/app', home); await X1.init()
console.log('X1.store:', (await X1.call('memorix_store', { entityName: 'k', type: 'discovery', title: 'X1_PRIVATE_NOTE', narrative: 'belongs to x1/app' })).split('\n').slice(0,2).join(' | ')); X1.stop()
const X2 = start(TMP + '/x2/app', home); await X2.init()
console.log('X2.search:', (await X2.call('memorix_search', { query: 'X1_PRIVATE_NOTE' })).split('\n').slice(0,5).join(' | ')); X2.stop()
