import test from 'node:test'
import assert from 'node:assert/strict'
import { handler } from '../netlify/functions/ai-structure-pro.mjs'

test('Paid AI endpoint rejects non-POST methods', async () => {
  assert.equal((await handler({ httpMethod: 'GET', headers: {}, body: '' })).statusCode, 405)
})

test('Paid AI endpoint fails closed when configuration is missing', async () => {
  const oldKey = process.env.GEMINI_PAID_API_KEY, oldProject = process.env.FIREBASE_PROJECT_ID
  delete process.env.GEMINI_PAID_API_KEY; delete process.env.FIREBASE_PROJECT_ID
  try { assert.equal((await handler({ httpMethod: 'POST', headers: {}, body: '{}' })).statusCode, 503) }
  finally { if (oldKey === undefined) delete process.env.GEMINI_PAID_API_KEY; else process.env.GEMINI_PAID_API_KEY = oldKey; if (oldProject === undefined) delete process.env.FIREBASE_PROJECT_ID; else process.env.FIREBASE_PROJECT_ID = oldProject }
})

test('Paid AI endpoint rejects missing bearer token', async () => {
  const oldKey = process.env.GEMINI_PAID_API_KEY, oldProject = process.env.FIREBASE_PROJECT_ID
  process.env.GEMINI_PAID_API_KEY = 'test-key'; process.env.FIREBASE_PROJECT_ID = 'test-project'
  try { assert.equal((await handler({ httpMethod: 'POST', headers: {}, body: '{}' })).statusCode, 401) }
  finally { if (oldKey === undefined) delete process.env.GEMINI_PAID_API_KEY; else process.env.GEMINI_PAID_API_KEY = oldKey; if (oldProject === undefined) delete process.env.FIREBASE_PROJECT_ID; else process.env.FIREBASE_PROJECT_ID = oldProject }
})
