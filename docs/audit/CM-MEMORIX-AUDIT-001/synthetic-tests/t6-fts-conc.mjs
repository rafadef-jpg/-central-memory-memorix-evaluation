import { start } from './mcp-client.mjs'
import path from 'node:path'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
const A = start(path.join(fx, 'projA'), home); await A.init()
for (const q of ['"', 'a" OR 1=1 --', '*', 'NEAR(a b)', "'; DROP TABLE observations; --", 'projectId:synthetic/projB', 'SYNTH) OR (projectId']) {
  const r = await A.call('memorix_search', { query: q }); console.log(JSON.stringify(q).padEnd(40), r.split('\n')[0].slice(0, 120))
}
A.stop()
const S = [0,1,2].map(() => start(path.join(fx, 'projB'), home)); await Promise.all(S.map(s => s.init()))
const t0 = Date.now()
const res = await Promise.all(S.flatMap((s, i) => Array.from({ length: 40 }, (_, j) => s.call('memorix_store', { entityName: 'conc', type: 'discovery', title: `CONC w${i} n${j} distinct token q${i}x${j}`, narrative: `concurrent write ${i}-${j} unique payload zz${i}yy${j}` }))))
console.log('concurrent stores ok:', res.filter(r => r.startsWith('[OK]')).length, '/ 120 in', Date.now() - t0, 'ms; non-OK sample:', res.filter(r => !r.startsWith('[OK]')).slice(0, 3).map(x => x.slice(0, 160)))
S.forEach(s => s.stop())
