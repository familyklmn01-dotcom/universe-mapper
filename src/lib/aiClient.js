import { validateAIStructure } from './aiStructureSchema.js'

/** Selects the route from Firebase's signed custom claims; the backend independently verifies entitlement. */
export async function generateAIStructure({ prompt, mode, user, signal } = {}) {
  const cleanPrompt = String(prompt || '').trim()
  if (!cleanPrompt) throw new Error('Tulis instruksi terlebih dahulu.')
  if (cleanPrompt.length > 5000) throw new Error('Instruksi terlalu panjang. Maksimal 5.000 karakter.')
  if (mode !== 'mindmap' && mode !== 'hierarchy') throw new Error('Pilih Mind Map atau Hierarchy.')
  if (!user || user.demo || typeof user.getIdTokenResult !== 'function') {
    throw new Error('AI online memerlukan akun Universe Mapper yang sudah masuk dan terverifikasi. Demo lokal tetap tersedia tanpa AI online.')
  }
  const tokenResult = await user.getIdTokenResult()
  const paid = tokenResult?.claims?.aiTier === 'paid'
  const endpoint = paid ? '/.netlify/functions/ai-structure-pro' : '/.netlify/functions/ai-structure'
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenResult.token}` },
    body: JSON.stringify({ prompt: cleanPrompt, mode }), signal,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error || `AI tidak tersedia (HTTP ${response.status}).`)
  return validateAIStructure(payload?.structure)
}
