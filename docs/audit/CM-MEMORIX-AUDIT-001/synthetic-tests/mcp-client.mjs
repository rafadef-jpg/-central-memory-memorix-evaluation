// Minimal JSON-RPC stdio client for synthetic Memorix tests. Temporary audit tooling.
import { spawn } from 'node:child_process'
import path from 'node:path'
const root = path.resolve(new URL('../../../..', import.meta.url).pathname) // repository root
const cli = path.join(root, 'dist/cli/index.js')
export function start(cwd, home, extraEnv = {}, mode = 'lite') {
  const child = spawn(process.execPath, [cli, 'serve', '--cwd', cwd, '--mode', mode], {
    cwd, env: { ...process.env, HOME: home, USERPROFILE: home, MEMORIX_EMBEDDING: 'off', MEMORIX_LLM_API_KEY: '', OPENAI_API_KEY: '', ANTHROPIC_API_KEY: '', MEMORIX_LLM_PROVIDER: '', NO_COLOR: '1', ...extraEnv },
    stdio: ['pipe', 'pipe', 'pipe'] })
  let buf = '', id = 0; const waiters = new Map(); let stderr = ''
  child.stderr.on('data', d => stderr += d)
  child.stdout.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i); buf = buf.slice(i + 1); try { const m = JSON.parse(line); if (m.id != null && waiters.has(m.id)) { waiters.get(m.id)(m); waiters.delete(m.id) } } catch {} } })
  const rpc = (method, params) => new Promise((res, rej) => { const my = ++id; const t = setTimeout(() => rej(new Error('timeout ' + method + ' ' + stderr.slice(-500))), 60000); waiters.set(my, m => { clearTimeout(t); res(m) }); child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: my, method, params }) + '\n') })
  const api = {
    child, get stderr() { return stderr },
    async init() { const r = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'audit-client', version: '0' } }); child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'); return r },
    async call(name, args) { const r = await rpc('tools/call', { name, arguments: args }); if (r.error) return 'ERROR: ' + JSON.stringify(r.error); return (r.result?.content || []).map(c => c.text).join('\n') + (r.result?.isError ? ' [isError]' : '') },
    async list() { const r = await rpc('tools/list', {}); return r.result.tools.map(t => t.name) },
    stop() { child.kill('SIGTERM') },
  }
  return api
}
