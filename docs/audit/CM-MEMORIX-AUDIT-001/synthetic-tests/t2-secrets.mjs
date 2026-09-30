import { start } from './mcp-client.mjs'
import path from 'node:path'
const fx = path.resolve('fx'); const home = path.join(fx, 'home')
const samples = {
  anthropic: 'sk-ant-api03-' + 'Q'.repeat(90),
  openai: 'sk-proj-' + 'A1b2C3d4'.repeat(6),
  github_pat: 'ghp_' + 'a1B2c3D4e5'.repeat(4).slice(0,36),
  github_fine: 'github_pat_11ABCDEFG0' + 'x'.repeat(60),
  aws_akid: 'AKIAIOSFODNN7EXAMPLE',
  aws_secret: 'aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  slack: 'xoxb-123456789012-1234567890123-' + 'a'.repeat(24),
  stripe: 'sk_live_' + '4eC39HqLyjWDarjtT1zdp7dc',
  google: 'AIza' + 'SyA-1234567890abcdefghijklmnopqrstu',
  jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
  bearer: 'Authorization: Bearer abcDEF123456ghiJKL789012mnoPQR',
  pem: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA7synthSYNTH\n-----END RSA PRIVATE KEY-----',
  dotenv: 'DATABASE_URL=postgres://admin:S3cr3tSYNTH@db.internal:5432/prod',
  cookie: 'Cookie: session=abcd1234efgh5678ijkl; csrftoken=zzzSYNTH999',
  pt_senha: 'a senha do servidor é Tr0ub4dor&3SYNTH',
  generic_token: 'token: 9f8e7d6c5b4a39281706f5e4d3c2b1a0',
  fp_sha: 'commit 3f786850e387550fdab836ed7e6dc881de23001b fixed test',
  fp_uuid: 'request id 123e4567-e89b-12d3-a456-426614174000',
  fp_word: 'the password reset flow uses email links',
}
const A = start(path.join(fx, 'projA'), home); await A.init()
for (const [k, v] of Object.entries(samples)) {
  await A.call('memorix_store', { entityName: 'secrets-battery', type: 'discovery', title: 'SECBAT ' + k, narrative: 'value: ' + v })
}
A.stop()
