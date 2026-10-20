import { validateAIStructure } from '../../src/lib/aiStructureSchema.js'
import { verifyFirebaseIdToken } from './firebaseIdToken.mjs'

const windows = new Map()
const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) })

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metode tidak didukung.' })
  const apiKey = process.env.GEMINI_PAID_API_KEY || process.env.GEMINI_API_KEY
  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!apiKey || !projectId) return json(503, { error: 'Paid AI belum dikonfigurasi. Atur GEMINI_PAID_API_KEY dan FIREBASE_PROJECT_ID di Netlify.' })
  const auth = String(event.headers?.authorization || event.headers?.Authorization || '')
  const match = auth.match(/^Bearer\s+(.+)$/i)
  if (!match) return json(401, { error: 'Silakan masuk terlebih dahulu.' })
  let user
  try { user = await verifyFirebaseIdToken(match[1], projectId) } catch { user = null }
  if (!user) return json(401, { error: 'Token tidak valid atau email belum terverifikasi. Masuk kembali lalu coba lagi.' })
  if (user.claims.aiTier !== 'paid') return json(403, { error: 'Paid AI memerlukan entitlement aiTier=paid pada Firebase Authentication.' })
  let body
  try { body = JSON.parse(event.body || '{}') } catch { return json(400, { error: 'Permintaan tidak berupa JSON yang valid.' }) }
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
  const mode = body.mode
  if (!prompt) return json(400, { error: 'Tulis instruksi terlebih dahulu.' })
  if (prompt.length > 5000) return json(413, { error: 'Instruksi terlalu panjang. Maksimal 5.000 karakter.' })
  if (mode !== 'mindmap' && mode !== 'hierarchy') return json(400, { error: 'Jenis struktur tidak didukung.' })
  const now = Date.now(), limit = Math.max(1, Math.min(60, Number.parseInt(process.env.AI_PAID_RATE_LIMIT_PER_MINUTE || '', 10) || 20))
  const old = windows.get(user.uid)
  if (!old || now - old.startedAt >= 60_000) windows.set(user.uid, { startedAt: now, count: 1 })
  else if (old.count >= limit) return json(429, { error: 'Batas permintaan Paid AI sementara tercapai. Coba lagi sebentar.' })
  else old.count++
  if (windows.size > 5000) for (const [uid, entry] of windows) if (now - entry.startedAt >= 60_000) windows.delete(uid)
  const model = process.env.GEMINI_PAID_MODEL || 'gemini-2.5-pro'
  const instruction = `Generate an editable Universe Mapper structure. Return JSON only with fields {"schemaVersion":1,"mode":"mindmap|hierarchy","root":"string","children":[{"name":"string","children":[]}]}. Keep names concise, max 120 nodes including root and depth 8. No markdown or extra fields. Required mode: ${mode}.`
  let response
  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: instruction }] }, contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, responseMimeType: 'application/json', maxOutputTokens: 4096 } }),
    })
  } catch { return json(502, { error: 'Tidak dapat menghubungi penyedia Paid AI.' }) }
  if (!response.ok) return json(response.status === 429 ? 429 : 502, { error: response.status === 429 ? 'Kuota penyedia AI sedang habis.' : 'Penyedia Paid AI gagal memproses permintaan.' })
  const payload = await response.json().catch(() => ({}))
  const text = payload?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  if (!text) return json(502, { error: 'Paid AI tidak menghasilkan struktur.' })
  try { return json(200, { structure: validateAIStructure({ ...JSON.parse(text), mode }), usage: { tier: 'paid', provider: 'gemini', model } }) }
  catch { return json(422, { error: 'Hasil Paid AI tidak lolos validasi struktur.' }) }
}
