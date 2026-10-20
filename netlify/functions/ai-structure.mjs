import { validateAIStructure } from '../../src/lib/aiStructureSchema.js'
import { verifyFirebaseIdToken } from './firebaseIdToken.mjs'

const requestWindows = new Map()
const RATE_WINDOW_MS = 60_000
const DEFAULT_RATE_LIMIT = 8

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
})

function parseModelJson(text) {
  const raw = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  try { return JSON.parse(raw) } catch { throw new Error('Model AI mengembalikan format yang tidak valid. Coba instruksi yang lebih sederhana.') }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metode tidak didukung.' })

  const apiKey = process.env.GEMINI_API_KEY
  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!apiKey || !projectId) {
    return json(503, { error: 'Free AI belum dikonfigurasi di server. Atur GEMINI_API_KEY dan FIREBASE_PROJECT_ID di environment Netlify.' })
  }

  const auth = String(event.headers?.authorization || event.headers?.Authorization || '')
  const tokenMatch = auth.match(/^Bearer\s+(.+)$/i)
  if (!tokenMatch) return json(401, { error: 'Silakan masuk dengan akun Universe Mapper terlebih dahulu.' })
  const user = await verifyFirebaseIdToken(tokenMatch[1], projectId).catch(() => null)
  if (!user) return json(401, { error: 'Sesi tidak valid atau email belum terverifikasi. Masuk kembali lalu coba lagi.' })
  if (user.claims.aiTier === 'paid') return json(403, { error: 'Akun ini memiliki akses Paid AI. Gunakan jalur Paid AI.' })

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return json(400, { error: 'Permintaan tidak berupa JSON yang valid.' }) }
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
  const mode = body.mode
  if (!prompt) return json(400, { error: 'Tulis instruksi terlebih dahulu.' })
  if (prompt.length > 5000) return json(413, { error: 'Instruksi terlalu panjang. Maksimal 5.000 karakter.' })
  if (mode !== 'mindmap' && mode !== 'hierarchy') return json(400, { error: 'Jenis struktur tidak didukung.' })

  const now = Date.now()
  const limit = Math.max(1, Math.min(30, Number.parseInt(process.env.AI_FREE_RATE_LIMIT_PER_MINUTE || '', 10) || DEFAULT_RATE_LIMIT))
  const window = requestWindows.get(user.uid)
  if (!window || now - window.startedAt >= RATE_WINDOW_MS) requestWindows.set(user.uid, { startedAt: now, count: 1 })
  else if (window.count >= limit) return json(429, { error: 'Batas permintaan Free AI sementara tercapai. Tunggu sebentar lalu coba lagi.' })
  else window.count += 1
  if (requestWindows.size > 5000) { for (const [uid, record] of requestWindows) if (now - record.startedAt >= RATE_WINDOW_MS) requestWindows.delete(uid) }

  const model = process.env.GEMINI_FREE_MODEL || 'gemini-2.5-flash-lite'
  const systemInstruction = [
    'You generate editable node structures for Universe Mapper.',
    'Return JSON only, with exactly these fields: {"schemaVersion":1,"mode":"mindmap|hierarchy","root":"string","children":[{"name":"string","children":[]}]}.',
    'Every child must be an object with a non-empty name and children array. Keep labels concise.',
    'Use at most 120 nodes including the root and maximum nesting depth 8.',
    'Do not include markdown, explanations, HTML, or fields other than the requested structure.',
    `The required mode is ${mode}.`,
  ].join(' ')

  let response
  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json', maxOutputTokens: 4096 },
      }),
    })
  } catch {
    return json(502, { error: 'Tidak dapat menghubungi penyedia Free AI. Coba lagi nanti.' })
  }
  if (!response.ok) {
    const status = response.status
    // Keep the browser response generic; record the provider's actual error in Netlify Function logs for diagnosis.
    const providerError = await response.json().catch(() => ({}))
    console.error('[Free AI] Gemini request failed', {
      status,
      model,
      providerStatus: providerError?.error?.status || null,
      providerMessage: providerError?.error?.message || response.statusText || 'No provider error message',
    })
    return json(status === 429 ? 429 : 502, { error: status === 429 ? 'Kuota Free AI sedang habis. Coba lagi nanti.' : 'Penyedia Free AI gagal memproses permintaan.' })
  }

  const providerPayload = await response.json().catch(() => ({}))
  const text = providerPayload?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('')
  if (!text) return json(502, { error: 'Free AI tidak menghasilkan struktur. Coba instruksi yang lebih sederhana.' })
  try {
    const parsed = parseModelJson(text)
    const structure = validateAIStructure({ ...parsed, mode })
    return json(200, { structure, usage: { tier: 'free', provider: 'gemini', model } })
  } catch (error) {
    return json(422, { error: error instanceof Error ? error.message : 'Hasil AI tidak lolos validasi.' })
  }
}
