import { start } from './mcp-client.mjs'
import path from 'node:path'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
const A = start(path.join(fx, 'projA'), home); await A.init()
const pc = await A.call('memorix_project_context', { task: 'continue infra work on the database' })
console.log('PROJECT_CONTEXT:\n', pc.slice(0, 3500))
const ss = await A.call('memorix_session_start', { agent: 'codex' })
console.log('\nSESSION_START:\n', ss.slice(0, 2500))
console.log('\nDETAIL 2,3:\n', (await A.call('memorix_detail', { typedRefs: ['obs:2@synthetic/projA','obs:3@synthetic/projA'], purpose: 'audit', force: true })).slice(0, 2500))
A.stop()
