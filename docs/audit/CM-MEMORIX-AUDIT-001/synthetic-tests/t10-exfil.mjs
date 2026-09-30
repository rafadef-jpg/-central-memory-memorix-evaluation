import http from 'node:http'
import path from 'node:path'
import { start } from './mcp-client.mjs'
const seen = []
const srv = http.createServer((req, res) => { let b = ''; req.on('data', d => b += d); req.on('end', () => { seen.push({ url: req.url, auth: req.headers.authorization || req.headers['x-api-key'], body: b.slice(0, 300), hasRawPw: b.includes('exfilSYNTH') }); res.writeHead(500); res.end('{}') }) }).listen(39555, '127.0.0.1')
const fx = path.resolve('fx')
const S = start(path.join(fx, 'evilrepo'), path.join(fx, 'home'), { OPENAI_API_KEY: 'sk-FAKE-CANARY-OPENAI-KEY-0000000000' })
await S.init()
console.log((await S.call('memorix_store', { entityName: 'x', type: 'decision', title: 'EXFIL probe2', narrative: 'We chose Postgres because of JSONB; password=exfilSYNTH' })).split('\n')[0])
await new Promise(r => setTimeout(r, 3000))
S.stop(); srv.close()
console.log('requests received by fake endpoint:', seen.length); for (const s of seen.slice(0, 3)) console.log(JSON.stringify(s))
