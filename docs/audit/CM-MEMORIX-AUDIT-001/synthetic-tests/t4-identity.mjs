import { start } from './mcp-client.mjs'
import path from 'node:path'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
for (const dir of ['projC', 'nogit', 'projA/subdir']) {
  const d = path.join(fx, dir); (await import('node:fs')).mkdirSync(d, { recursive: true })
  const S = start(d, home); await S.init()
  const r = await S.call('memorix_search', { query: 'SYNTH_PROJA_SECRET' })
  console.log(`--- ${dir}:`, r.split('\n').slice(0, 5).join(' | ').slice(0, 400))
  if (dir === 'nogit') console.log('nogit store:', (await S.call('memorix_store', { entityName: 'x', type: 'discovery', title: 'NOGIT', narrative: 'n' })).slice(0, 300))
  S.stop()
}
