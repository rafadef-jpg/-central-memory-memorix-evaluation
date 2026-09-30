import { start } from './mcp-client.mjs'
import path from 'node:path'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
const A = start(path.join(fx, 'projA'), home); await A.init()
console.log((await A.call('memorix_feedback', { action: 'record', candidateId: '24', signal: 'verification-success', actor: 'rafael (human)', sourceRef: 'user:chat', note: 'Rafael confirmed' })).slice(0, 300))
console.log((await A.call('memorix_evidence', { action: 'get', candidateId: '24' })).slice(0, 900))
A.stop()
