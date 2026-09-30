import { start } from './mcp-client.mjs'
import path from 'node:path'
import D from '../../../../node_modules/better-sqlite3/lib/index.js'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
const count = () => { const db = new D(path.join(home, '.memorix/data/memorix.db'), { readonly: true }); const r = db.prepare("select status, count(*) c from observations where projectId='synthetic/projD' group by status").all(); db.close(); return JSON.stringify(r) }
const S = start(path.join(fx, 'projD'), home); await S.init()
const variants = ['The auth timeout is 5000ms in production config', 'Auth timeout set to 5000ms for production config', 'Production config auth timeout is 5000 ms', 'In production the auth timeout config is 5000ms', 'Config: production auth timeout = 5000ms']
for (const [i, v] of variants.entries()) console.log((await S.call('memorix_store', { entityName: 'auth-config', type: 'how-it-works', title: `Auth timeout ${i}`, narrative: v })).split('\n')[0])
S.stop(); console.log('after store:', count())
for (let round = 0; round < 2; round++) {
  const R = start(path.join(fx, 'projD'), home); await R.init()
  for (let k = 0; k < 20; k++) { await R.call('memorix_retention', { action: 'report' }); await new Promise(r => setTimeout(r, 1000)) }
  R.stop(); console.log(`after restart ${round}:`, count())
}
