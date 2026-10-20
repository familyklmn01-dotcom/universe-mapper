import test from 'node:test'
import assert from 'node:assert/strict'
import { handler } from '../netlify/functions/ai-structure.mjs'

test('Free AI endpoint rejects methods other than POST', async () => {
  const response = await handler({ httpMethod: 'GET', headers: {}, body: '' })
  assert.equal(response.statusCode, 405)
})

test('Free AI endpoint fails closed when provider credentials are missing', async () => {
  const previousGemini = process.env.GEMINI_API_KEY
  const previousFirebase = process.env.FIREBASE_WEB_API_KEY
  delete process.env.GEMINI_API_KEY
  delete process.env.FIREBASE_WEB_API_KEY
  try {
    const response = await handler({ httpMethod: 'POST', headers: {}, body: '{}' })
    assert.equal(response.statusCode, 503)
    assert.match(JSON.parse(response.body).error, /belum dikonfigurasi/i)
  } finally {
    if (previousGemini === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previousGemini
    if (previousFirebase === undefined) delete process.env.FIREBASE_WEB_API_KEY; else process.env.FIREBASE_WEB_API_KEY = previousFirebase
  }
})

test('Free AI endpoint rejects requests without a Firebase bearer token', async () => {
  const previousGemini = process.env.GEMINI_API_KEY
  const previousFirebase = process.env.FIREBASE_WEB_API_KEY
  process.env.GEMINI_API_KEY = 'test-key'
  process.env.FIREBASE_WEB_API_KEY = 'test-firebase-key'
  try {
    const response = await handler({ httpMethod: 'POST', headers: {}, body: JSON.stringify({ prompt: 'Make a map', mode: 'mindmap' }) })
    assert.equal(response.statusCode, 401)
  } finally {
    if (previousGemini === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previousGemini
    if (previousFirebase === undefined) delete process.env.FIREBASE_WEB_API_KEY; else process.env.FIREBASE_WEB_API_KEY = previousFirebase
  }
})
