// Round-3 perimeter PoC (synthetic data). t16 also needs meta.next_id forced below MAX(id) via sqlite to show the overwrite; see REPORT Adendo 2.
import path from 'node:path'
import { start } from './mcp-client.mjs'
const home = path.join(process.cwd(), 'home')
const env = { MEMORIX_DATA_DIR: path.join(process.cwd(), 'data'), MEMORIX_AUTO_UPDATE: 'off', MEMORIX_LLM_BASE_URL: 'http://127.0.0.1:9/x' }
const S = start(path.join(process.cwd(), 'repo'), home, env, 'micro'); await S.init()
console.log((await S.call('memorix_store', { entityName: 'e', type: 'discovery', title: 'NEW benign note', narrative: 'a totally unrelated new note' })).split('\n')[0]); S.stop()
